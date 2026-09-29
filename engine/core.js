// ============================================================
//  lyricreel engine · core
//  共用常數、數學工具、貼紙風格繪圖原件、背景、場景註冊表。
//  所有場景檔都在全域作用域執行，可以直接使用這裡的函式。
// ============================================================
const W = 1920, H = 1080;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
// 調色盤：專案可在 project.json 的 "palette" 覆寫任一色
const C = {
  ink:'#1b0a24', pink:'#ff4fa3', hot:'#ff2e7e', cherry:'#e0173c', lemon:'#ffe14d',
  cream:'#fff3e3', sky:'#86d8ff', mint:'#7de8c3', lilac:'#c9a7ff', white:'#ffffff',
  orange:'#ff9a3c', blush:'#ffc2dc', deep:'#3a1466', green:'#3fbf6a'
};
// Bagel 等字型沒有中日韓字形時的備援
const FONT_FALLBACK = '"PingFang TC","Hiragino Sans","Noto Sans CJK TC","Microsoft JhengHei",sans-serif';
// 由 runtime 在載入專案後填入
let TL = [], AU = { dur: 0, beats: [], rms: [], bass: [] }, PROJECT = {};

// ---------- 工具 ----------
const clamp = (x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp = (a,b,t)=>a+(b-a)*t;
const inv = (a,b,x)=>clamp((x-a)/(b-a));
const eOut = t=>1-Math.pow(1-t,3);
const eIn = t=>t*t*t;
const eIO = t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eBack = t=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)};
const eElastic = t=>t<=0?0:t>=1?1:Math.pow(2,-10*t)*Math.sin((t*10-.75)*2.094)+1;
const hash = n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const TAU = Math.PI*2;

function feat(arr,t){arr=arr||[];return arr[clamp(Math.floor(t*30),0,arr.length-1)]||0}
function lastBeat(t){let lo=0,hi=AU.beats.length-1,r=-1;while(lo<=hi){const m=(lo+hi)>>1;if(AU.beats[m]<=t){r=m;lo=m+1}else hi=m-1}return r}
function beatInfo(t){const i=lastBeat(t);const bt=i>=0?AU.beats[i]:0;const nb=AU.beats[i+1]??bt+0.465;return {i,pulse:i>=0?Math.exp(-(t-bt)*7):0,phase:clamp((t-bt)/(nb-bt))}}

// ---------- 貼紙風格繪圖 ----------
function sticker(path, fill, sh=10, lw=8){
  ctx.save();ctx.translate(sh,sh);ctx.fillStyle=C.ink;ctx.fill(path);ctx.restore();
  ctx.fillStyle=fill;ctx.fill(path);
  if(lw){ctx.lineWidth=lw;ctx.strokeStyle=C.ink;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke(path)}
}
function stext(str,x,y,size,fill,font='Bagel',sh){
  ctx.font=`${size}px ${font}, ${FONT_FALLBACK}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
  sh = sh ?? size*0.07; ctx.lineWidth=size*0.13;ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;
  ctx.strokeText(str,x+sh,y+sh);ctx.fillText(str,x+sh,y+sh);
  ctx.strokeText(str,x,y);ctx.fillStyle=fill;ctx.fillText(str,x,y);
}
function P(){return new Path2D()}
function circleP(r,x=0,y=0){const p=P();p.arc(x,y,r,0,TAU);return p}
function ellP(rx,ry,x=0,y=0,rot=0){const p=P();p.ellipse(x,y,rx,ry,rot,0,TAU);return p}
function rrP(w,h,r,x=-w/2,y=-h/2){const p=P();p.roundRect(x,y,w,h,r);return p}
function heartP(s){const p=P();p.moveTo(0,s*.42);
  p.bezierCurveTo(-s*.12,s*.3,-s*.62,.02*s,-s*.55,-s*.28);p.bezierCurveTo(-s*.48,-s*.6,-s*.06,-s*.62,0,-s*.3);
  p.bezierCurveTo(s*.06,-s*.62,s*.48,-s*.6,s*.55,-s*.28);p.bezierCurveTo(s*.62,.02*s,s*.12,s*.3,0,s*.42);p.closePath();return p}
function starP(r1,r2,n=5,rot=-Math.PI/2){const p=P();for(let i=0;i<n*2;i++){const r=i%2?r2:r1,a=rot+i*Math.PI/n;i?p.lineTo(Math.cos(a)*r,Math.sin(a)*r):p.moveTo(Math.cos(a)*r,Math.sin(a)*r)}p.closePath();return p}
function sparkleP(r){const p=P();p.moveTo(0,-r);p.quadraticCurveTo(0,0,r,0);p.quadraticCurveTo(0,0,0,r);p.quadraticCurveTo(0,0,-r,0);p.quadraticCurveTo(0,0,0,-r);p.closePath();return p}
function lipsP(s){const p=P();p.moveTo(-s,0);
  p.bezierCurveTo(-s*.7,-s*.38,-s*.35,-s*.58,-s*.12,-s*.4);p.quadraticCurveTo(0,-s*.28,s*.12,-s*.4);
  p.bezierCurveTo(s*.35,-s*.58,s*.7,-s*.38,s,0);p.bezierCurveTo(s*.6,s*.62,-s*.6,s*.62,-s,0);p.closePath();return p}
function drawLips(s,fill=C.cherry,open=0){
  sticker(lipsP(s),fill,s*.06,s*.06);
  ctx.beginPath();ctx.moveTo(-s*.92,0);ctx.quadraticCurveTo(0,s*(.12+open*.3),s*.92,0);ctx.lineWidth=s*.05;ctx.strokeStyle=C.ink;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.75)';ctx.fill(ellP(s*.2,s*.07,-s*.3,s*.22,-.2));
}
function sparkle(x,y,r,col=C.white,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);sticker(sparkleP(r),col,r*.12,r*.1);ctx.restore()}
function heart(x,y,s,col=C.hot,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);sticker(heartP(s),col,s*.07,s*.06);
  ctx.fillStyle='rgba(255,255,255,.7)';ctx.fill(ellP(s*.1,s*.06,-s*.28,-s*.3,-.6));ctx.restore()}

// ---------- 背景 ----------
function halftone(bg,dot,t,{spacing=46,drift=18,maxr=.42,dir=1}={}){
  ctx.fillStyle=bg;ctx.fillRect(-200,-200,W+400,H+400);
  ctx.fillStyle=dot;const off=(t*drift*dir)%spacing;
  for(let y=-spacing;y<H+spacing;y+=spacing)for(let x=-spacing;x<W+spacing;x+=spacing){
    const X=x+off,Y=y+off*.5;const g=clamp((X/W*.6+Y/H*.7)*.9-.15+Math.sin(t*.7+X*.003)*.1);
    const r=spacing*maxr*g;if(r>.8){ctx.beginPath();ctx.arc(X,Y,r,0,TAU);ctx.fill()}}
}
function rays(cx,cy,n,col,t,alpha=.35,speed=.15){
  ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=col;ctx.translate(cx,cy);ctx.rotate(t*speed);
  for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(0,0);const a=i/n*TAU,b=a+TAU/n/2;ctx.lineTo(Math.cos(a)*2400,Math.sin(a)*2400);ctx.lineTo(Math.cos(b)*2400,Math.sin(b)*2400);ctx.fill()}
  ctx.restore();
}
function checker(y0,col1,col2,t,speed=0){
  // 透視棋盤地板
  const hz=y0, rows=10;ctx.save();
  for(let r=0;r<rows;r++){
    const z0=r+ (speed*t)%2, z1=z0+1;
    const ya=hz+ (H-hz)*Math.pow(z0/rows,1.8), yb=hz+(H-hz)*Math.pow(Math.min(z1,rows)/rows,1.8);
    for(let c=-12;c<12;c++){
      const k=(c+Math.floor(r+(speed*t)%2*0))&1;
      const wa=lerp(60,420,Math.pow(z0/rows,1.2)), wb=lerp(60,420,Math.pow(Math.min(z1,rows)/rows,1.2));
      ctx.fillStyle=((c+r)&1)?col1:col2;ctx.beginPath();
      ctx.moveTo(960+c*wa,ya);ctx.lineTo(960+(c+1)*wa,ya);ctx.lineTo(960+(c+1)*wb,yb);ctx.lineTo(960+c*wb,yb);ctx.fill();
    }
  }
  ctx.restore();
}
function bubblesUp(t,n,col,seed=1,speed=160){
  for(let i=0;i<n;i++){const x=hash(i*3.1+seed)*W, sp=speed*(.6+hash(i+seed*9)*.8), r=6+hash(i*7+seed)*26;
    const y=H+60-((t*sp+hash(i*1.7+seed)*H*1.4)%(H+160));
    ctx.save();ctx.globalAlpha=.85;ctx.lineWidth=4;ctx.strokeStyle=col;ctx.beginPath();ctx.arc(x+Math.sin(t*2+i)*14,y,r,0,TAU);ctx.stroke();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(x+Math.sin(t*2+i)*14-r*.35,y-r*.35,r*.2,0,TAU);ctx.fill();ctx.restore()}
}
function confetti(t,n,seed,cols,gravity=1){
  for(let i=0;i<n;i++){const x=(hash(i+seed)*W+Math.sin(t*1.3+i)*40), sp=(120+hash(i*2.3+seed)*260)*gravity;
    const y=((t*sp+hash(i*5.1+seed)*H)%(H+100))-50;ctx.save();ctx.translate(x,y);ctx.rotate(t*3*(hash(i)-.5)*4+i);
    ctx.fillStyle=cols[i%cols.length];ctx.fillRect(-10,-5,20,10*Math.abs(Math.cos(t*4+i)));ctx.restore()}
}
function floatHearts(t,n,seed,cols,size=40){
  for(let i=0;i<n;i++){const x=hash(i*1.9+seed)*W, sp=40+hash(i+seed)*80, y=H+80-((t*sp+hash(i*4.4+seed)*H*1.3)%(H+200));
    heart(x+Math.sin(t+i)*30,y,size*(.6+hash(i*8+seed)*.9),cols[i%cols.length],Math.sin(t*1.5+i)*.3)}
}

// ---------- 段落背景 ----------
// 段落名稱會去掉結尾數字取類型（chorus2 → chorus）；最後一次副歌與其後段用 finale 配色
let SEC_BG = {};
function buildSecBg(extra){
  SEC_BG = {
    intro:[C.pink,C.hot], chorus:[C.pink,C.hot], post:[C.lemon,C.orange], verse:[C.cream,C.blush],
    pre:[C.lilac,'#b48cff'], bridge:[C.lemon,C.orange], outro:[C.pink,C.hot], inter:[C.pink,C.hot],
    'chorus-finale':[C.hot,C.cherry], 'post-finale':[C.lilac,C.pink], ...(extra||{})
  };
}
buildSecBg();
function secType(sec){return String(sec||'intro').toLowerCase().replace(/[-_ ]?\d+$/,'')}
function secNum(sec){const m=String(sec||'').match(/(\d+)$/);return m?+m[1]:1}
let FINALE_N = 0; // runtime 設定：最後一次副歌的編號（至少第 2 次才算）
function isFinale(sec){const ty=secType(sec);return FINALE_N>=2&&(ty==='chorus'||ty==='post')&&secNum(sec)===FINALE_N}
function secColors(sec){const ty=secType(sec);return (isFinale(sec)&&SEC_BG[ty+'-finale'])||SEC_BG[ty]||SEC_BG.intro}
function secBg(s,opts){const [a,b]=secColors(s.sec);halftone(a,b,s.t,opts)}

// ---------- 場景註冊 ----------
// scene(name, meta, fn)：fn(s) 每幀呼叫一次，畫滿整個 1920×1080 畫面（歌詞由 runtime 另外疊上）
// s = { t 全曲秒數, t0 場景開始, lt 場景內秒數, dur 場景長度, p 進度 0..1,
//       b 拍點脈衝 0..1, bass 低音 0..1, e 音量 0..1, sec 段落, line 當前歌詞, arg 腳本參數 }
const S = {}, SCENE_META = {};
function scene(name, meta, fn){ S[name] = fn; SCENE_META[name] = meta || {}; }
