// stopwatch — Stopwatch runs then freezes, with a stop hand
scene('stopwatch', {"desc": "Stopwatch runs then freezes, with a stop hand", "fits": "wait, stop, time, pause, hold on", "demo": "Hold on, hold on, just a second", "arg": "shout (default WAIT!)"}, s=>{
  secBg(s);rays(960,440,14,C.white,s.t,.25,-.08);
  const cx=960,cy=460;sticker(rrP(90,70,14,cx-45,cy-360),C.cream,8,8);sticker(rrP(40,60,10,cx-20,cy-300),C.cream,6,7);
  sticker(circleP(300,cx,cy),C.hot,16,12);sticker(circleP(250,cx,cy),C.cream,0,8);
  for(let i=0;i<12;i++){const a=i/12*TAU;ctx.strokeStyle=C.ink;ctx.lineWidth=i%3?6:12;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*215,cy+Math.sin(a)*215);ctx.lineTo(cx+Math.cos(a)*240,cy+Math.sin(a)*240);ctx.stroke()}
  const stop=s.dur*.35, tt=Math.min(s.lt,stop)+Math.max(0,s.lt-stop)*.02;const a=-Math.PI/2+tt*4;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(a);sticker(rrP(200,18,9,0,-9),C.cherry,4,0);ctx.restore();sticker(circleP(26,cx,cy),C.ink,0,0);
  if(s.lt>stop){const k=eBack(inv(stop,stop+.2,s.lt));ctx.save();ctx.translate(cx+380,cy-220);ctx.rotate(.18);ctx.scale(k,k);stext(s.arg||'WAIT!',0,0,120,C.lemon);ctx.restore();
    ctx.save();ctx.translate(cx-400,cy+40);ctx.rotate(-.2);ctx.scale(k,k);// 停止手勢
    const hand=P();hand.roundRect(-70,-60,140,170,40);for(let f=0;f<4;f++)hand.roundRect(-70+f*36,-160,32,130,16);hand.roundRect(-120,-10,60,110,28);sticker(hand,C.blush,8,8);ctx.restore()}
});
