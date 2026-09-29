// 專案自訂場景範例：放在 <project>/scenes/*.js 會自動載入，可直接使用 engine/core.js 的所有工具
// 拍點上擴散的同心圓 + 中央爆炸星形 + 關鍵字
scene('custom-burst', {"desc":"Example project scene: beat rings, exploding star, keyword","fits":"drops, big moments","arg":"keyword (default DROP)","demo":"Here comes the drop"}, s=>{
  ctx.fillStyle=C.ink;ctx.fillRect(0,0,W,H);
  // 每個拍點放出一圈，往外擴散淡出
  const first=lastBeat(s.t0)+1, cur=lastBeat(s.t);
  for(let k=Math.max(first,cur-6);k<=cur;k++){const age=s.t-AU.beats[k];
    ctx.strokeStyle=[C.hot,C.lemon,C.mint][k%3];ctx.globalAlpha=clamp(1-age/1.6);ctx.lineWidth=18;
    ctx.beginPath();ctx.arc(960,460,80+age*700,0,TAU);ctx.stroke()}
  ctx.globalAlpha=1;
  const k=eBack(inv(0,.3,s.lt))*(1+s.b*.15);
  ctx.save();ctx.translate(960,460);ctx.rotate(s.t*.8);ctx.scale(k,k);sticker(starP(300,140,12),C.lemon,14,10);ctx.restore();
  stext(s.arg||'DROP',960,460,190*k,C.hot);
});
