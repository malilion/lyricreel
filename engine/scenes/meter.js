// meter — Gauge needle drops from max to zero, then z z z
scene('meter', {"desc": "Gauge needle drops from max to zero, then z z z", "fits": "interest, boredom, energy, level, rating", "demo": "Your signal's fading out", "arg": "gauge label (default INTEREST)"}, s=>{
  secBg(s);
  const cx=960,cy=600,R=380;
  const arc=P();arc.arc(cx,cy,R,Math.PI,TAU);arc.lineTo(cx+R-70,cy);arc.arc(cx,cy,R-70,TAU,Math.PI,true);arc.closePath();sticker(arc,C.cream,12,10);
  const segs=[C.cherry,C.orange,C.lemon,C.mint,C.hot];segs.forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,R-8,Math.PI+i*Math.PI/5+.02,Math.PI+(i+1)*Math.PI/5-.02);ctx.arc(cx,cy,R-62,Math.PI+(i+1)*Math.PI/5-.02,Math.PI+i*Math.PI/5+.02,true);ctx.fill()});
  ctx.font='700 40px Grotesk,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(s.arg||'INTEREST',cx,cy-150);
  const v=lerp(.95,.05,eIO(inv(.1,.85,s.p)))+Math.sin(s.t*20)*.02;const a=Math.PI+v*Math.PI;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(a);sticker(rrP(R-40,26,13,0,-13),C.ink,6,0);ctx.restore();sticker(circleP(44,cx,cy),C.hot,6,8);
  if(s.p>.7){ctx.font='80px Caveat,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.save();ctx.translate(1480,300);ctx.rotate(-.1);ctx.fillText('z z z',0,Math.sin(s.t*2)*20);ctx.restore()}
});
