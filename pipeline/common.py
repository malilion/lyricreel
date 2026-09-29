"""lyricreel 共用：專案設定與歌詞腳本解析（只用標準函式庫）。"""
import json, os, re

def load_project(pdir):
    path = os.path.join(pdir, 'project.json')
    if not os.path.exists(path):
        raise SystemExit(f'找不到 {path}；先用 `lyricreel new <dir>` 建立專案')
    cfg = json.load(open(path, encoding='utf-8'))
    cfg.setdefault('audio', 'song.mp3')
    cfg.setdefault('script', 'script.txt')
    return cfg

def build_dir(pdir):
    d = os.path.join(pdir, 'build'); os.makedirs(d, exist_ok=True); return d

CJK_CH = '\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af'
CJK = re.compile(f'[{CJK_CH}]')
PIECE = re.compile(f"(?:[{CJK_CH}]|[^\\s{CJK_CH}\\W]+|[\\w'’]+)[^\\w\\s]*")

def split_words(s):
    """以空白分詞；中日韓字逐字拆開（j=1 表示前面不加空格），標點黏在前一個字後面。"""
    words, joins = [], []
    for w in s.split():
        if not re.search(r'\w', w): continue
        pieces = PIECE.findall(w) if CJK.search(w) else [w]
        for i, p in enumerate(pieces):
            words.append(p); joins.append(1 if i else 0)
    return words, joins

LINE_RE = re.compile(r'^\s*@?\s*([0-9]+(?:\.[0-9]+)?)\s*$')

def parse_script(pdir, cfg=None):
    """script.txt 每行：section | scene[:arg] | lyric (ad-lib) | @start
    - section 留空 = 沿用上一行；scene 留空 = typo
    - 第 4 欄 @秒數 可選，用來把該句起點釘死（自動對齊不準時用）
    - # 開頭為註解；空行忽略"""
    cfg = cfg or load_project(pdir)
    lines, sec = [], 'intro'
    for n, raw in enumerate(open(os.path.join(pdir, cfg['script']), encoding='utf-8'), 1):
        raw = raw.rstrip('\n')
        if not raw.strip() or raw.lstrip().startswith('#'): continue
        parts = [p.strip() for p in raw.split('|')]
        if len(parts) < 3:
            raise SystemExit(f'script 第 {n} 行需要至少 3 欄 "section | scene | lyric"：{raw!r}')
        sec = parts[0] or sec
        scene, _, arg = (parts[1] or 'typo').partition(':')
        text = '|'.join(parts[2:3])
        start = None
        if len(parts) >= 4 and parts[3]:
            m = LINE_RE.match(parts[3])
            if not m: raise SystemExit(f'script 第 {n} 行第 4 欄應為 @秒數：{parts[3]!r}')
            start = float(m.group(1))
        words, joins = split_words(re.sub(r'\([^)]*\)', ' ', text))
        adlibs = [(len(split_words(re.sub(r'\([^)]*\)', ' ', text[:m.start()]))[0]), m.group(1).strip())
                  for m in re.finditer(r'\(([^)]*)\)', text)]
        lines.append(dict(n=n, sec=sec, scene=scene.strip(), arg=arg.strip() or None, text=text,
                          words=words, joins=joins, adlibs=adlibs, start=start))
    if not lines: raise SystemExit('script.txt 沒有任何歌詞行')
    return lines

CJK = re.compile(r'[぀-ヿ㐀-鿿가-힯]')

def tokens(word):
    """比對用的正規化 token：拉丁字母小寫去標點；中日韓逐字拆開。"""
    w = word.lower().replace('’', "'")
    if CJK.search(w):
        return [c for c in w if CJK.match(c) or c.isalnum()]
    t = re.sub(r"[^\w]", '', w).replace('_', '')
    return [t] if t else []
