# Making a lyric MV with lyricreel (guide for AI coding agents)

You are helping someone turn a song and its lyrics into a lyric music video. This file is your playbook; README.md has the full reference.

## 0. Setup check

```bash
node --version && ffmpeg -version | head -1 && ls node_modules/puppeteer-core >/dev/null && echo ok
ls .venv/bin/python || (python3 -m venv .venv && .venv/bin/pip install -r requirements.txt)
```

Chrome must be installed; set `CHROME_PATH` if `lyricreel` can't find it. Run commands as `node bin/lyricreel.js …`, or as `lyricreel …` after `npm link`.

## 1. Create the project

```bash
node bin/lyricreel.js new projects/<slug> --audio <path/to/song> --title "<TITLE>" --artist "<Artist>"
```

Keep user songs under `projects/`, which is gitignored. **Never commit copyrighted audio or lyrics**, and never paste them into files outside `projects/`.

## 2. Write script.txt: this is the creative part

Read the whole lyric sheet first. Then, for every line:

1. **Section.** Work out the song structure: `intro`, `verse1`, `pre1`, `chorus1`, `post1`, `bridge`, `outro`, … Number repeats (`chorus2`, `chorus3`). The highest chorus number gets the finale treatment.
2. **Scene.** Pick the image the line is actually about. Run `node bin/lyricreel.js scenes` and look at `docs/gallery.jpg`. Match on meaning, not keywords: "I'm in way too deep" → `deepsea`; "wait a minute" → `stopwatch`.
3. **Custom scenes.** If nothing fits well, write a new scene rather than forcing a bad match (step 4). `typo:<WORD>` is the fallback, but a video that is mostly `typo` is a failure.
4. **Variety and rhythm.** Repeated choruses may reuse the same scene per line; that consistency reads as intentional. Avoid the same scene on consecutive lines unless the lyric repeats. Hooks and chants suit `queenrow`, `mirror` and `typo` with an arg.
5. **Ad-libs.** Put echoes and backing vocals in parentheses.

Pick one visual idea per line and draw it literally; that's what makes the video feel matched to the song. Write a short plan table (line → scene → why) for the user before building if they want to review it.

## 3. Build and check the timing

```bash
node bin/lyricreel.js build projects/<slug>
```

The `align` output marks each line:

- `' '`: matched from Whisper.
- `@`: pinned by hand.
- `~`: estimated.

Estimated lines and dense repeated sections (post-chorus chants, outros) are the usual problems. To fix them:

- Look at `projects/<slug>/build/asr.json` near the expected time; the words are there with timestamps, even if misheard.
- Use the beat grid: lines usually start a little before a bar line. `build/audio.json` has `beats` and `tempo`; at 120 BPM one bar is 2 s.
- Pin with `| @12.3` as the 4th column, re-run `align` (it takes about a second), and repeat.
- If a whole region is garbage (an intro under heavy effects), add it to `whisper.refine` in `project.json` and re-run `transcribe`.

## 4. Writing a new scene

Create `projects/<slug>/scenes/<name>.js`, or `engine/scenes/<name>.js` if it's generic enough for everyone. See the README section "Writing a scene" and copy the structure of an existing scene such as `engine/scenes/hourglass.js`.

Rules:

- **Deterministic.** Use `hash(n)` for randomness and `s.t` / `s.lt` for time. Never use `Math.random()`, `Date.now()` or state carried between frames: frames are rendered out of order during review.
- Paint the whole 1920×1080 frame. Start with `secBg(s)` or a full fill.
- Keep the key visual in the upper ~80% (y < 850). The lyric line sits around y = 945.
- Animate with `s.p` (0→1 over the scene) for the story beat. A good pattern is setup → change halfway → payoff, like the key turning in `heartlock` or the arrow hitting in `target`. Use `s.b` (beat pulse) for bounce.
- Use the palette `C.*` and the `sticker()` / `stext()` look so the video stays consistent.
- Don't add per-frame random full-screen noise; it multiplies the file size by about 5.
- Add `desc`, `fits`, `arg` and `demo` metadata. `demo` must be your own text, never real lyrics.

Test one scene in isolation:

```bash
node bin/lyricreel.js gallery --scene <name> --out /tmp/<name>.jpg   # built-in demo line
```

Then look at the image.

## 5. Review loop: always look at frames

Rendering takes minutes, so review with stills first:

```bash
node bin/lyricreel.js stills projects/<slug> 5,12.4,20,33.1,…   # pick 1–2 times inside every line
```

Open the JPEGs, or tile them with `ffmpeg -pattern_type glob -i 'out/stills/t*.jpg' -vf scale=640:360,tile=4x4 sheet.jpg`. Check for:

- the lyric being covered by artwork, or overflowing the frame
- the scene not reading as the lyric's meaning
- the right scene showing at the right time (timing drift shows up as the previous line's scene still on screen)
- empty or half-drawn frames, which usually mean a JS error: the CLI prints `[page error]`

## 6. Render and verify

```bash
node bin/lyricreel.js render projects/<slug>
ffprobe -v error -show_entries format=duration,size -of compact projects/<slug>/out/*.mp4
ffmpeg -i projects/<slug>/out/<TITLE>.mp4 -vf "blackdetect=d=0.3:pix_th=0.08,freezedetect=n=0.001:d=1.5" -an -f null - 2>&1 | grep -E "black_start|freeze_start"
ffmpeg -y -i projects/<slug>/out/<TITLE>.mp4 -vf "fps=1/5,scale=480:270,tile=6x6" -frames:v 1 /tmp/contact.jpg
```

Look at the contact sheet before calling it done. Report the duration, the file size, and anything you saw that was off.
