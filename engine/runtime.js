// ============================================================
//  lyricreel engine · runtime
//  歌詞排版、時間軸 → 場景、轉場、鏡頭律動、後製疊層，以及 window.renderAt(t)
// ============================================================

// ---------- 歌詞排版（整句一行，太長就等比縮小字級） ----------
const LYRIC_MAX_W = 1720, LYRIC_MAX_SIZE = 96, LYRIC_Y = 945;
function layoutLine(line){
  // j=1 的字（中日韓逐字）前面不加空格
  const measure=size=>{ctx.font=`${size}px Bagel, ${FONT_FALLBACK}`;const sp=size*.42;
    const row=line.words.map((wd,i)=>({...wd,ww:ctx.measureText(wd.w).width,gap:i&&!wd.j?sp:(i?size*.04:0)}));
    return {row,sp,size,total:row.reduce((a,w)=>a+w.ww+w.gap,0)}};
  let L=measure(LYRIC_MAX_SIZE);
  if(L.total>LYRIC_MAX_W)L=measure(Math.floor(LYRIC_MAX_SIZE*LYRIC_MAX_W/L.total));
  return L;
}
function drawLyrics(t,line,s){
  if(!line||!line.words.length||PROJECT.lyrics===false)return;
  const fade=1-inv(line.t1+.25,line.t1+.6,t);if(fade<=0)return;
  const L=layoutLine(line), size=L.size, y=LYRIC_Y;
  let x=960-L.total/2;
  L.row.forEach(wd=>{
    x+=wd.gap;const a=clamp((t-wd.t0+.06)/.18);if(a<=0){x+=wd.ww;return}
    const active=t>=wd.t0-.05&&t<wd.t1+.08, sc=eBack(a)*(active?1.08+s.b*.06:1);
    const rot=(hash(wd.t0*10)-.5)*.1;
    ctx.save();ctx.globalAlpha=fade;ctx.translate(x+wd.ww/2,y);ctx.rotate(rot);ctx.scale(sc,sc);
    if(active){ctx.save();ctx.rotate(-rot*1.5);sticker(rrP(wd.ww+22,size*.98,size*.22),C.lemon,6,6);ctx.restore()}
    stext(wd.w,0,4,size,active?C.hot:C.cream);ctx.restore();x+=wd.ww});
  // 和聲 ad-lib：手寫字斜放在右上
  (line.adlibs||[]).forEach((ad,i)=>{const a=clamp((t-ad.t0)/.2);if(a<=0||t>ad.t1+.8)return;
    ctx.save();ctx.globalAlpha=fade*clamp(1-(t-ad.t1-.4)/.4);ctx.translate(1560-i*40,y-150-i*70);ctx.rotate(-.12);const k=eBack(a);ctx.scale(k,k);
    ctx.font=`700 82px Caveat, ${FONT_FALLBACK}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=14;ctx.strokeStyle=C.ink;ctx.strokeText(ad.text,0,0);ctx.fillStyle=C.lemon;ctx.fillText(ad.text,0,0);ctx.restore()});
}

// ---------- 時間軸 → 目前場景 ----------
const INTERLUDE_GAP = 3.2; // 句與句間隔超過這麼久，就在中間切到間奏場景
function currentState(t){
  let idx=-1;for(let i=0;i<TL.length;i++){if(TL[i].t0-.12<=t)idx=i;else break}
  const inter=PROJECT.interlude||'title';
  if(idx<0)return {scene:TL.length?inter:'title',sec:'intro',t0:0,t1:TL.length?TL[0].t0:AU.dur,line:null};
  const L=TL[idx], next=TL[idx+1], end=next?next.t0-.12:AU.dur;
  if(t>L.t1+1.6&&end-L.t1>INTERLUDE_GAP)return {scene:inter,sec:'inter',t0:L.t1+1.6,t1:end,line:null};
  return {scene:L.scene,arg:L.arg,sec:L.sec,t0:L.t0-.12,t1:end,line:L};
}
function wipe(t,t0){
  const d=t-t0;if(d<0||d>.32)return;const p=d/.32;ctx.save();
  const cols=[C.lemon,C.hot,C.ink];for(let k=0;k<3;k++){const q=clamp(p*1.6-k*.18);if(q<=0||q>=1)continue;const x=lerp(-600,W+600,eIO(q));
    ctx.fillStyle=cols[k];ctx.beginPath();ctx.moveTo(x-500,0);ctx.lineTo(x+120,0);ctx.lineTo(x-80,H);ctx.lineTo(x-700,H);ctx.fill()}
  ctx.restore();
}
// 固定紙張紋理（不要逐幀隨機：會讓影片檔暴增）
let grain=null;
function makeGrain(){grain=document.createElement('canvas');grain.width=512;grain.height=512;const g=grain.getContext('2d'),im=g.createImageData(512,512);
  for(let i=0;i<im.data.length;i+=4){const v=hash(i*.37)*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=16}g.putImageData(im,0,0)}

const warned=new Set();
window.renderAt = function(t){
  if(!grain)makeGrain();
  const st=currentState(t), bi=beatInfo(t);
  const s={t,t0:st.t0,lt:t-st.t0,dur:Math.max(.5,st.t1-st.t0),b:bi.pulse,bass:feat(AU.bass,t),e:feat(AU.rms,t),sec:st.sec,line:st.line,arg:st.arg};
  s.p=clamp(s.lt/s.dur);
  let fn=S[st.scene];
  if(!fn){if(!warned.has(st.scene)){warned.add(st.scene);console.warn(`unknown scene "${st.scene}", using typo`)}fn=S.typo}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=C.ink;ctx.fillRect(0,0,W,H);
  // 鏡頭：低音縮放 + 副歌段落輕晃
  const hype=/^(chorus|post)/.test(secType(st.sec))?1:.4, z=1+s.b*.018*hype+s.bass*.01;
  const shx=Math.sin(t*37)*s.b*6*hype, shy=Math.cos(t*29)*s.b*6*hype;
  ctx.translate(960+shx,540+shy);ctx.scale(z,z);ctx.translate(-960,-540);
  fn(s);
  ctx.restore();ctx.setTransform(1,0,0,1,0,0);
  if(isFinale(st.sec))confetti(t,26,7,[C.lemon,C.cream,C.mint],.8);
  drawLyrics(t,st.line,s);
  wipe(t,st.t0);
  if(s.b>.6&&hype===1){ctx.fillStyle=`rgba(255,243,227,${(s.b-.6)*.18})`;ctx.fillRect(0,0,W,H)}
  const vg=ctx.createRadialGradient(960,540,500,960,540,1150);vg.addColorStop(0,'rgba(27,10,36,0)');vg.addColorStop(1,'rgba(27,10,36,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  for(let y=0;y<H;y+=512)for(let x=0;x<W;x+=512)ctx.drawImage(grain,x,y);
  const fin=clamp(t/.6), fout=clamp((AU.dur-t)/1.2);if(fin<1||fout<1){ctx.fillStyle=`rgba(27,10,36,${1-Math.min(fin,fout)})`;ctx.fillRect(0,0,W,H)}
};

// ---------- 載入專案資料 ----------
window.lrUse = function(data){
  PROJECT=data.project||{}; AU=data.audio; TL=data.timeline||[];
  Object.assign(C, PROJECT.palette||{}); buildSecBg(PROJECT.sections);
  FINALE_N=Math.max(0,...TL.filter(l=>secType(l.sec)==='chorus').map(l=>secNum(l.sec)));
};
// 場景圖鑑：用合成的節拍與示範歌詞單獨展示某個場景
window.lrDemo = function(name, arg){
  const meta=SCENE_META[name]||{}, text=meta.demo||'La la la la', words=text.split(/\s+/), dur=4;
  const beats=[];for(let b=.25;b<dur;b+=.5)beats.push(+b.toFixed(2));
  window.lrUse({project:{title:'LYRICREEL',artist:'scene gallery'},audio:{dur:30,beats,rms:Array(900).fill(.6),bass:Array(900).fill(.5)},
    timeline:[{sec:'chorus1',scene:name,arg:arg??null,text,t0:.3,t1:.3+words.length*.3,
      words:words.map((w,i)=>({w,t0:+(.3+i*.3).toFixed(2),t1:+(.3+(i+1)*.3).toFixed(2)})),adlibs:[]},
      {sec:'chorus1',scene:name,text:'',t0:dur,t1:dur,words:[],adlibs:[]}]});
};
