"""音訊分析：BPM、拍點、RMS / 低音 / 高音包絡（30fps）→ build/audio.json"""
import json, os, sys
import numpy as np, librosa
from common import load_project, build_dir

def main(pdir):
    cfg = load_project(pdir)
    y, sr = librosa.load(os.path.join(pdir, cfg['audio']), sr=22050, mono=True)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
    hop = 512
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    S = np.abs(librosa.stft(y, hop_length=hop)); freqs = librosa.fft_frequencies(sr=sr)
    bass, high = S[freqs < 150].mean(0), S[freqs > 4000].mean(0)
    dur = len(y) / sr; n = int(dur * 30)
    t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
    def rs(a):
        a = np.interp(np.arange(n) / 30, t[:len(a)], a); a = a / (np.percentile(a, 99) + 1e-9)
        return np.clip(a, 0, 1.2).round(3).tolist()
    out = dict(dur=dur, tempo=float(np.atleast_1d(tempo)[0]), beats=[round(float(b), 3) for b in beats],
               rms=rs(rms), bass=rs(bass), high=rs(high))
    json.dump(out, open(os.path.join(build_dir(pdir), 'audio.json'), 'w'))
    print(f'audio: {dur:.1f}s  {out["tempo"]:.1f} BPM  {len(beats)} beats')

if __name__ == '__main__':
    main(sys.argv[1])
