"""歌詞腳本 × Whisper 逐字時間 → build/timeline.js（只用標準函式庫）

1. 句子起點
   - 腳本第 4 欄有 @秒數 的句子直接釘死（pinned），並把全曲切成數段
   - 每段內把歌詞 token 與 ASR token 做序列比對，至少對上 2 個字的句子取得起點（asr）
   - 剩下的句子依字數在已知句子之間內插（interp）
2. 句內每個字的時間：再做一次句內比對，對上的字用 ASR 時間，其餘內插
3. ad-lib（括號內和聲）放在它前一個主詞之後出現
"""
import difflib, glob, json, os, sys
from common import load_project, parse_script, build_dir, tokens

WORD_DUR = 0.3     # 沒有任何依據時，每個字估計的長度（秒）
MIN_GAP = 0.25     # 兩句起點最小間隔


def asr_tokens(asr, t_from, t_to):
    """把 ASR 字展開成 token，多字元（中日韓）平均分配時間。"""
    out = []
    for w in asr:
        if not (t_from <= w['s'] < t_to):
            continue
        tk = tokens(w['w'])
        for i, t in enumerate(tk):
            s = w['s'] + (w['e'] - w['s']) * i / max(1, len(tk))
            out.append((t, s, w['e']))
    return out


def lyric_tokens(line_words):
    """[(token, word_index)]"""
    return [(t, k) for k, w in enumerate(line_words) for t in tokens(w)]


def match(ly, sr):
    """單調的全域序列比對（DP）：最大化對上的 token 數，連續對上額外加分。
    比 difflib 的貪婪最長區塊穩定：重複的副歌不會被對到別的副歌去。回傳 [(lyric_idx, asr_idx)]"""
    A = [t for t, _ in ly]; B = [t for t, *_ in sr]
    n, m = len(A), len(B)
    if not n or not m:
        return []
    NEG = float('-inf')
    best = [[0.0] * (m + 1) for _ in range(n + 1)]     # 前 i 個歌詞 token × 前 j 個 ASR token 的最佳分數
    endm = [[NEG] * (m + 1) for _ in range(n + 1)]     # 同上但 (i, j) 恰好對上
    for i in range(1, n + 1):
        bi, bp, ei, ep, ai = best[i], best[i - 1], endm[i], endm[i - 1], A[i - 1]
        for j in range(1, m + 1):
            if ai == B[j - 1]:
                ei[j] = max(bp[j - 1], ep[j - 1] + 0.5) + 1.0
            v = bp[j] if bp[j] > bi[j - 1] else bi[j - 1]
            bi[j] = v if v > ei[j] else ei[j]
    pairs, i, j, in_match = [], n, m, False
    while i > 0 and j > 0:
        if in_match or (endm[i][j] != NEG and endm[i][j] >= best[i][j] - 1e-9):
            pairs.append((i - 1, j - 1))
            # 決定前一步是否也在連續對上的狀態
            in_match = endm[i - 1][j - 1] != NEG and endm[i - 1][j - 1] + 0.5 >= best[i - 1][j - 1] and \
                abs(endm[i][j] - (endm[i - 1][j - 1] + 1.5)) < 1e-9
            i, j = i - 1, j - 1
        elif best[i - 1][j] >= best[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return pairs[::-1]


def cluster_start(ms, n_words):
    """一句話對上的 (字序, 時間) 可能零散；取時間上最密集的一群，回傳 (字序, 時間) 起點與該群大小。"""
    ms = sorted(ms, key=lambda m: m[1])
    groups, cur = [], [ms[0]]
    for a, b in zip(ms, ms[1:]):
        if b[1] - a[1] > 2.5 or b[0] <= a[0] - 1:
            groups.append(cur); cur = [b]
        else:
            cur.append(b)
    groups.append(cur)
    g = max(groups, key=len)
    return g[0], len({k for k, _ in g})


def line_starts(lines, asr, dur):
    N = len(lines)
    t0 = [l['start'] for l in lines]
    status = ['pinned' if s is not None else None for s in t0]
    cuts = [i for i in range(N) if t0[i] is not None]
    bounds = sorted(set([0] + cuts + [N]))
    segs = list(zip(bounds, bounds[1:]))   # 以釘住的句子為界切段
    for a, b in segs:
        ta = t0[a] if t0[a] is not None else 0.0
        tb = t0[b] if b < N and t0[b] is not None else dur
        ly = [(tok, (i, k)) for i in range(a, b) for tok, k in lyric_tokens(lines[i]['words'])]
        sr = asr_tokens(asr, ta - 0.3, tb - 0.05)
        found = {}
        for li, si in match(ly, sr):
            i, k = ly[li][1]
            found.setdefault(i, []).append((k, sr[si][1]))
        for i, ms in found.items():
            if status[i] == 'pinned':
                continue
            need = 1 if len(lines[i]['words']) <= 2 else 2
            (k, s), size = cluster_start(ms, len(lines[i]['words']))
            if size >= need:
                t0[i] = max(ta, s - k * WORD_DUR * 0.9)
                status[i] = 'asr'
    # 單調性：不合理的 asr 起點丟掉改內插
    last = -1.0
    for i in range(N):
        if t0[i] is None:
            continue
        if t0[i] < last + MIN_GAP and status[i] != 'pinned':
            t0[i], status[i] = None, None
            continue
        last = t0[i]
    # 內插
    nw = [max(1, len(l['words'])) for l in lines]
    known = [i for i in range(N) if t0[i] is not None]
    for i in range(N):
        if t0[i] is not None:
            continue
        before = [k for k in known if k < i]
        after = [k for k in known if k > i]
        if before and after:
            a, b = before[-1], after[0]
            w_all = sum(nw[a:b]); w_here = sum(nw[a:i])
            t0[i] = t0[a] + (t0[b] - t0[a]) * w_here / w_all
        elif after:
            b = after[0]
            t0[i] = max(0.0, t0[b] - sum(nw[i:b]) * WORD_DUR)
        elif before:
            a = before[-1]
            t0[i] = t0[a] + sum(nw[a:i]) * WORD_DUR
        else:
            t0[i] = 1.0 + sum(nw[:i]) * WORD_DUR
        status[i] = 'interp'
    return [round(t, 3) for t in t0], status


def word_times(line, t0, nxt, asr):
    words = line['words']
    n = len(words)
    if not n:
        return []
    ly = lyric_tokens(words)
    sr = asr_tokens(asr, t0 - 0.35, nxt - 0.1)
    hit = {}
    for li, si in match(ly, sr):
        k = ly[li][1]
        if k not in hit:
            hit[k] = sr[si][1:]
    span_end = min(nxt - 0.15, t0 + max(0.6, n * WORD_DUR))
    # 錨點（單調）：句首、對上的字、句尾
    anchors = [(-1, t0)]
    for k in sorted(hit):
        s = hit[k][0]
        if s > anchors[-1][1] + 0.05 and s < nxt:
            anchors.append((k, s))
    end_t = max(anchors[-1][1] + 0.3, span_end) if anchors[-1][0] != n else anchors[-1][1]
    anchors.append((n, min(max(end_t, span_end), nxt)))
    starts = []
    for k in range(n):
        if k == 0:
            starts.append(t0)
            continue
        exact = [a for a in anchors if a[0] == k]
        if exact:
            starts.append(exact[0][1])
            continue
        lo = [a for a in anchors if a[0] < k][-1]
        hi = [a for a in anchors if a[0] > k][0]
        lo_k, lo_t = (lo if lo[0] >= 0 else (0, t0))
        starts.append(lo_t + (hi[1] - lo_t) * (k - lo_k) / (hi[0] - lo_k))
    out = []
    for k, w in enumerate(words):
        if k + 1 < n:
            e = starts[k + 1]
        else:
            e = min(nxt, (hit[k][1] if k in hit else starts[k] + 0.35) + 0.05)
        wd = dict(w=w, t0=round(starts[k], 3), t1=round(max(e, starts[k] + 0.12), 3))
        if line['joins'][k]:
            wd['j'] = 1
        out.append(wd)
    return out


def main(pdir):
    cfg = load_project(pdir)
    lines = parse_script(pdir, cfg)
    bd = build_dir(pdir)
    ap = os.path.join(bd, 'audio.json')
    if not os.path.exists(ap):
        raise SystemExit('缺少 build/audio.json，先跑 `lyricreel analyze`')
    aud = json.load(open(ap))
    asr_path = os.path.join(bd, 'asr.json')
    asr = json.load(open(asr_path)) if os.path.exists(asr_path) else []
    if not asr:
        print('（沒有 build/asr.json：只用 @ 釘住的時間與內插）')
    dur = aud['dur']
    t0s, status = line_starts(lines, asr, dur)
    timeline = []
    for i, L in enumerate(lines):
        t0 = t0s[i]
        nxt = t0s[i + 1] if i + 1 < len(lines) else dur - 1.5
        words = word_times(L, t0, nxt, asr)
        ads = []
        for before, txt in L['adlibs']:
            at = words[before - 1]['t1'] + 0.05 if before and words else t0
            at += 0.4 * sum(1 for x in ads if x['anchor'] == before)   # 同一位置的多個 ad-lib 依序錯開
            ads.append(dict(text=txt, anchor=before, t0=round(at, 3), t1=round(min(nxt, at + 1.3), 3)))
        if not words and ads:
            # 整句都是 ad-lib：拆成逐字顯示
            parts = [p for p in ' '.join(a['text'] for a in ads).replace(',', ' ').split() if p]
            d = (nxt - t0 - 0.3) / len(parts)
            words = [dict(w=p, t0=round(t0 + j * d, 3), t1=round(t0 + (j + 1) * d, 3)) for j, p in enumerate(parts)]
            ads = []
        for a in ads:
            a.pop('anchor', None)
        t1 = max([w['t1'] for w in words] + [a['t1'] for a in ads] + [t0])
        timeline.append(dict(sec=L['sec'], scene=L['scene'], arg=L['arg'], text=L['text'], t0=t0,
                             t1=round(min(t1, nxt), 3), words=words, adlibs=ads))
    scene_dir = os.path.join(pdir, 'scenes')
    scene_files = sorted(os.path.basename(p) for p in glob.glob(os.path.join(scene_dir, '*.js')))
    project = {k: cfg[k] for k in ('title', 'artist', 'audio', 'palette', 'sections', 'interlude', 'lyrics') if k in cfg}
    project['sceneFiles'] = scene_files
    audio = {k: aud[k] for k in ('dur', 'tempo', 'beats', 'rms', 'bass')}
    data = dict(project=project, audio=audio, timeline=timeline)
    with open(os.path.join(bd, 'timeline.js'), 'w', encoding='utf-8') as f:
        f.write('// generated by lyricreel align — do not edit; edit script.txt instead\n')
        f.write('window.LR_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    json.dump(timeline, open(os.path.join(bd, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    mark = {'pinned': '@', 'asr': ' ', 'interp': '~'}
    for L, st in zip(timeline, status):
        print(f"{mark[st]}{L['t0']:7.2f}-{L['t1']:7.2f}  {L['sec']:<9} {L['scene']:<11} {L['text'][:60]}")
    c = {k: status.count(k) for k in ('pinned', 'asr', 'interp')}
    print(f"\n{len(timeline)} lines: {c['asr']} from ASR, {c['pinned']} pinned (@), {c['interp']} interpolated (~)")
    if c['interp']:
        print('~ 的句子是估計值：預覽確認後可在 script.txt 第 4 欄加上 @秒數 釘住')


if __name__ == '__main__':
    main(sys.argv[1])
