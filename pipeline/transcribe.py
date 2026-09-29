"""Whisper 逐字時間戳 → build/asr.json（[{w, s, e}]）

project.json 可設定：
  "whisper": {"model": "small.en", "language": "en", "refine": [[0, 21], [129, 166]]}
refine：難辨識的片段（前奏、混音密集處）以歌詞當提示再單獨跑一次，結果取代原本該區間的字。
"""
import os, sys, json, argparse
os.environ.setdefault('NUMBA_DISABLE_JIT', '1')        # 避開 Python 3.13 上 word_timestamps 的 numba segfault
os.environ.setdefault('KMP_DUPLICATE_LIB_OK', 'TRUE')
from common import load_project, build_dir, parse_script

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('project')
    ap.add_argument('--model'); ap.add_argument('--lang'); ap.add_argument('--refine', help='例如 0-21,129-166')
    a = ap.parse_args()
    cfg = load_project(a.project); wc = cfg.get('whisper', {})
    model_name = a.model or wc.get('model', 'small')
    lang = a.lang or wc.get('language')          # None = 自動偵測
    refine = [tuple(map(float, r.split('-'))) for r in a.refine.split(',')] if a.refine else [tuple(r) for r in wc.get('refine', [])]
    try:
        lyrics = ' '.join(' '.join(l['words']) for l in parse_script(a.project, cfg))
    except SystemExit:
        lyrics = ''
    prompt = lyrics[:400] or None
    import whisper
    m = whisper.load_model(model_name)
    audio = whisper.load_audio(os.path.join(a.project, cfg['audio']))
    def run(x, offset, use_prompt):
        r = m.transcribe(x, language=lang, fp16=False, word_timestamps=True, condition_on_previous_text=False,
                         initial_prompt=prompt if use_prompt else None)
        return [dict(w=w['word'].strip(), s=round(w['start'] + offset, 2), e=round(w['end'] + offset, 2))
                for seg in r['segments'] for w in seg.get('words', [])]
    print(f'whisper {model_name} (lang={lang or "auto"}) …', flush=True)
    words = run(audio, 0, False)
    for s0, s1 in refine:
        print(f'refine {s0}-{s1}s …', flush=True)
        part = run(audio[int(s0 * 16000):int(s1 * 16000)], s0, True)
        words = [w for w in words if not (s0 <= w['s'] < s1)] + [w for w in part if s0 <= w['s'] < s1]
    words.sort(key=lambda w: w['s'])
    json.dump(words, open(os.path.join(build_dir(a.project), 'asr.json'), 'w'), ensure_ascii=False)
    print(f'asr: {len(words)} words → build/asr.json')

if __name__ == '__main__':
    main()
