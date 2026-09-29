// eye — Big eye with lashes and a heart pupil, looks around and blinks
scene('eye', {"desc": "Big eye with lashes and a heart pupil, looks around and blinks", "fits": "see, watch, look, notice, eyes", "demo": "I see everything you do"}, s=>{
  secBg(s);
  const cx=960,cy=430, open=eOut(inv(0,.3,s.lt))*(1-Math.max(0,1-Math.abs((s.lt-s.dur*.7)*9)));
  const ew=460,eh=250*open;
  // 睫毛
  ctx.lineCap='round';for(let i=0;i<7;i++){const a=-Math.PI*.85+i*(Math.PI*.7/6);const x0=cx+Math.cos(a)*ew*.9,y0=cy+Math.sin(a)*(eh+10)*.9;
    ctx.strokeStyle=C.ink;ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+Math.cos(a)*110,y0+Math.sin(a)*(60+eh*.4));ctx.stroke()}
  const eyeP=P();eyeP.moveTo(cx-ew,cy);eyeP.quadraticCurveTo(cx,cy-eh*1.9,cx+ew,cy);eyeP.quadraticCurveTo(cx,cy+eh*1.9,cx-ew,cy);eyeP.closePath();
  sticker(eyeP,C.white,14,14);
  ctx.save();ctx.clip(eyeP);const look=Math.sin(s.t*1.4)*150;
  sticker(circleP(170,cx+look,cy),C.hot,0,10);ctx.fillStyle=C.pink;ctx.fill(circleP(120,cx+look,cy));
  ctx.save();ctx.translate(cx+look,cy+10);ctx.scale(1+s.b*.25,1+s.b*.25);ctx.fillStyle=C.ink;ctx.fill(heartP(150));ctx.restore();
  ctx.fillStyle=C.white;ctx.fill(circleP(30,cx+look-60,cy-60));ctx.fill(circleP(14,cx+look+50,cy+40));ctx.restore();
  ctx.lineWidth=14;ctx.strokeStyle=C.ink;ctx.stroke(eyeP);
  for(let i=0;i<3;i++)sparkle(cx+560+i*60,cy-240+i*120,34-i*6+s.b*16,C.lemon,s.t+i);
});
