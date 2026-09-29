"""產生範例用的原創伴奏（120 BPM、32 秒、鼓＋貝斯＋和弦墊音），不含任何版權素材。
python3 make_song.py && ffmpeg -y -i song.wav -b:a 160k song.mp3"""
import numpy as np, wave

SR, BPM, BARS = 44100, 120, 16
beat = 60 / BPM
dur = BARS * 4 * beat
t_all = np.arange(int(dur * SR)) / SR
mix = np.zeros_like(t_all)

def add(sig, at, gain=1.0):
    i = int(at * SR); j = min(len(mix), i + len(sig)); mix[i:j] += sig[:j - i] * gain

def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.12)

rng = np.random.default_rng(7)
def snare():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return (rng.standard_normal(n) * 0.6 + np.sin(2 * np.pi * 190 * t) * 0.5) * env(n, 0.001, 0.07)

def hat():
    n = int(0.06 * SR); x = rng.standard_normal(n); x = np.diff(np.concatenate([[0], x]))
    return x * env(n, 0.0005, 0.015)

def tone(freq, length, kind='saw', d=0.4):
    n = int(length * SR); t = np.arange(n) / SR
    if kind == 'sine':
        s = np.sin(2 * np.pi * freq * t)
    else:
        s = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 8))
    return s * env(n, 0.01, d)

# I–V–vi–IV（C G Am F）
chords = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
for bar in range(BARS):
    t0 = bar * 4 * beat
    root, triad = chords[bar % 4]
    drums = bar >= 2                      # 前兩小節只有和弦
    for b in range(4):
        tb = t0 + b * beat
        if drums:
            add(kick(), tb, 0.9)
            if b in (1, 3): add(snare(), tb, 0.45)
            for h in (0, 0.5): add(hat(), tb + h * beat, 0.25)
        add(tone(midi(root), beat * 0.9, 'sine', 0.35), tb, 0.35 if drums else 0.2)
        if b in (0, 2) and bar >= 6:     # 副歌加一個簡單旋律
            add(tone(midi(triad[(bar + b) % 3] + 12), beat * 0.8, 'saw', 0.25), tb + 0.5 * beat, 0.06)
    for m in triad:
        add(tone(midi(m), 4 * beat, 'saw', 1.6), t0, 0.05)

mix = mix / np.abs(mix).max() * 0.9
fade = np.minimum(1, (dur - t_all) / 1.5); mix *= fade
pcm = (np.stack([mix, mix], 1) * 32767).astype('<i2')
with wave.open('song.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f'song.wav {dur:.1f}s')
