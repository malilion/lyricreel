<div align="center">

# lyricreel

**放進一首歌和歌詞，輸出跟著節拍走的歌詞 MV。每一格畫面都是程式畫出來的。**

[English](README.md) · **繁體中文**

<img src="docs/demo.gif" width="560" alt="lyricreel demo">

<sub>內附的示範專案：原創合成伴奏，搭配自編歌詞。</sub>

</div>

## 這是什麼？

lyricreel 會把一個音訊檔和它的歌詞，做成 1080p、波普貼紙風格的歌詞 MV：

- **聽懂這首歌**：抓出 BPM、拍點、音量與低音。鏡頭跟著大鼓脈動，副歌時會晃動，拍點上會閃光。
- **找出每個字什麼時候唱**：用 Whisper 逐字時間戳，再和你的歌詞做單調序列比對，重複的副歌不會對錯。任何一句都可以手動釘住時間。
- **每句歌詞一個畫面**：內建 27 個手寫 Canvas 場景（西洋棋皇后、下沉的愛心、檸檬水、碼錶…）。每句選一個，或用幾行 JavaScript 自己寫。
- **歌詞跟著唱出來**：唱到的字彈出，正在唱的字有貼紙底色，括號內的和聲用手寫字顯示，長句自動縮小保持一行。中日韓歌詞逐字拆開。
- **確定性渲染**：用 headless Chrome 逐幀繪製、ffmpeg 編碼，同樣的輸入永遠得到同樣的影片。

它是設計給 AI 程式代理（Claude Code、Codex）使用的。把歌和歌詞交給它，[AGENTS.md](AGENTS.md) 會告訴它怎麼規劃場景、寫新場景、輸出檢查截圖、修正看起來不對的地方。當然你自己手動操作也可以。

## 場景庫

<img src="docs/gallery.jpg" alt="scene gallery">

完整清單與說明在 [docs/SCENES.md](docs/SCENES.md)，可以用 `lyricreel gallery` 重新產生。

## 需求

- Node.js 18+、ffmpeg、Google Chrome 或 Chromium
- Python 3.10+，用於音訊分析與語音辨識（librosa、openai-whisper）

```bash
git clone https://github.com/malilion/lyricreel && cd lyricreel
npm install
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
npm link            # 選用：讓 `lyricreel` 可以直接執行（否則用 `node bin/lyricreel.js`）
```

## 先跑示範（30 秒，不需要人聲）

```bash
lyricreel build examples/demo --no-asr     # 分析節拍 + 對齊已釘住時間的歌詞
lyricreel preview examples/demo            # 打開印出的網址，按 Play
lyricreel render examples/demo             # → examples/demo/out/LYRICREEL.mp4
```

## 做你自己的 MV

```bash
lyricreel new projects/my-song --audio ~/Music/my-song.mp3 --title "MY SONG" --artist "Me"
# 編輯 projects/my-song/script.txt（見下方）
lyricreel build projects/my-song           # 分析 + Whisper + 對齊
lyricreel preview projects/my-song
lyricreel stills projects/my-song 12,34.5,61
lyricreel render projects/my-song
```

`projects/` 已加入 .gitignore，你的歌和歌詞只會留在自己電腦上。

### script.txt

一行一句歌詞：

```
# 段落    | 場景[:參數]   | 歌詞（括號內為和聲）                  | @起點秒數（選填）
intro     | title         | Hey, it's lyricreel                  | @1.0
chorus1   | sun           | Shining like a summer song (so bright)
chorus1   | lemonade      | Sweet as lemonade
post1     | mirror:ME     | Me, me, me
bridge    | typo:DROP     | Here comes the drop
```

- **段落**決定背景配色與能量。`chorus`、`post`、`verse`、`pre`、`bridge`、`intro`、`outro` 各有一套外觀，結尾可加數字（`chorus2`）。最後一次副歌會用「finale」配色並撒彩帶。留空則沿用上一行。
- **場景**可以是場景庫或專案 `scenes/` 資料夾裡的任何名稱。`:參數` 用來覆寫場景裡的文字（見 SCENES.md 的 arg 欄）。留空等於 `typo`。
- **和聲**寫在括號裡，會以手寫字顯示在歌詞旁。
- **@起點**把這句的開始時間釘死（秒）。`lyricreel align` 會用 `~` 標出估計出來的句子；看預覽，把不準的釘住即可。

### project.json

```json
{
  "title": "MY SONG",
  "artist": "Me",
  "audio": "song.mp3",
  "whisper": { "model": "small", "language": "en", "refine": [[0, 20]] },
  "palette": { "pink": "#ff6fb5" },
  "sections": { "verse": ["#fff3e3", "#ffc2dc"] },
  "interlude": "title",
  "lyrics": true
}
```

| 欄位 | 意義 |
|---|---|
| `whisper.model` | `tiny` … `large-v3`；英文歌用 `small.en` 就不錯 |
| `whisper.language` | `null` 為自動偵測；指定（`"ko"`、`"zh"`、`"ja"`…）效果較好 |
| `whisper.refine` | 需要以歌詞為提示重新辨識的時間區間（混音密集的前奏或尾奏） |
| `palette` | 覆寫引擎顏色（`ink pink hot cherry lemon cream sky mint lilac orange blush`） |
| `sections` | 依段落類型覆寫背景 `[底色, 網點色]` |
| `interlude` | 超過 3.2 秒的純音樂空檔要顯示的場景 |
| `lyrics` | `false` 則不顯示歌詞（純畫面） |

### 寫一個場景

把檔案放進 `projects/my-song/scenes/`（只給該專案用）或 `engine/scenes/`（加入場景庫）：

```js
scene('rocket', {"desc":"A rocket launches on the drop","fits":"launch, flying, rising","arg":"label","demo":"Up, up and away"}, s => {
  secBg(s);                                     // 依段落配色的網點背景
  const y = lerp(900, -200, eIn(s.p));          // s.p：場景內進度 0→1
  ctx.save(); ctx.translate(960, y); ctx.scale(1 + s.b * .1, 1 + s.b * .1);   // s.b：拍點脈衝
  sticker(rrP(120, 300, 60), C.hot);            // 有墨線與陰影的貼紙形狀
  ctx.restore();
  stext(s.arg || 'LIFT OFF', 960, 200, 120, C.lemon);
});
```

場景會收到 `s = { t, lt, p, dur, b, bass, e, sec, line, arg }`，負責畫滿整個 1920×1080 畫面，歌詞會自動疊在上面。工具函式都在 [engine/core.js](engine/core.js)：緩動函數、確定性亂數 `hash`、`sticker`、`stext`、愛心、星星、嘴唇、閃光等形狀，以及網點、放射光、彩帶、泡泡背景。

規則：必須是**確定性**的（用 `hash()`，不要用 `Math.random()` 或 `Date`），而且每次都要畫滿整個畫面。

## 運作方式

```
song.mp3 ─► analyze.py ──► build/audio.json   （拍點、音量、低音，30fps）
         └► transcribe.py ► build/asr.json    （Whisper 逐字時間戳）
script.txt + 上面兩者 ─► align.py ─► build/timeline.js
engine/player.html + 場景 + timeline.js ─► headless Chrome renderAt(t) ─► ffmpeg ─► mp4
```

## 指令

| 指令 | 作用 |
|---|---|
| `new <dir> [--audio f] [--title] [--artist]` | 建立專案 |
| `analyze <dir>` | 拍點 / BPM / 能量 |
| `transcribe <dir> [--model] [--lang] [--refine a-b,…]` | Whisper 逐字時間戳 |
| `align <dir>` | 產生歌詞時間軸，並列出哪些句子是 ASR 對上、手動釘住或估計的 |
| `build <dir> [--no-asr]` | 以上三步 |
| `preview <dir> [--port]` | 本機播放器，有音訊和進度條 |
| `stills <dir> t1,t2,… [--out]` | 輸出檢查用截圖 |
| `render <dir> [--from] [--to] [--fps] [--crf] [--out]` | 輸出 mp4 成片 |
| `scenes [--md]` / `gallery [--scene name]` | 瀏覽場景庫 |

## 備註

- 在 Python 3.13 上，Whisper 逐字時間戳可能因 numba JIT 而 segfault；`transcribe.py` 已自動設定 `NUMBA_DISABLE_JIT=1`。
- 在 8 核 Mac 上渲染速度約每秒 10 幀，一首 3 分鐘的歌大約要 8–10 分鐘。
- **版權**：只使用你有權使用的音訊與歌詞，而且不要 commit 它們，這也是 `projects/` 被 gitignore 的原因。本 repo 裡的引擎、場景和示範都是原創的。

## 授權

程式碼：[MIT](LICENSE)。`engine/fonts/` 裡的字型（Bagel Fat One、Space Grotesk、Caveat）採用 [SIL Open Font License](engine/fonts/)。
