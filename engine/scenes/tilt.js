// tilt — Whole world tilts, heart slides sideways, calendar pages fly away
scene('tilt', {"desc": "Whole world tilts, heart slides sideways, calendar pages fly away", "fits": "sideways, crash, chaos, leaving, days passing", "demo": "Turn the whole world upside down"}, s=>{
  const tilt=eBack(inv(0,.3,s.lt))*-.32;ctx.save();ctx.translate(960,540);ctx.rotate(tilt);ctx.translate(-960,-540);
  halftone(C.sky,'#5fc3f2',s.t,{drift:300,dir:-1});
  for(let i=0;i<14;i++){const y=hash(i)*H,len=200+hash(i*3)*400,x=((s.t*1800+hash(i*5)*W*2)%(W*2))-400;ctx.fillStyle=C.white;ctx.globalAlpha=.7;ctx.fillRect(W-x,y,len,10);}ctx.globalAlpha=1;
  heart(960+Math.sin(s.t*3)*60,420,340*(1+s.b*.08),C.hot,-.2);
  ctx.restore();
  // 日曆頁一張張飛走
  const n=Math.floor(s.p*10);for(let i=0;i<n;i++){const since=s.lt-i/10*s.dur;const x=1500+since*700,y=250+i*30-since*200+since*since*300;
    ctx.save();ctx.translate(x,y);ctx.rotate(since*3+i);sticker(rrP(180,200,12),C.cream,6,7);ctx.fillStyle=C.cherry;ctx.fillRect(-90,-100,180,50);ctx.font='80px Bagel,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(String(31-i),0,60);ctx.restore()}
  ctx.save();ctx.translate(1500,250);sticker(rrP(200,220,14),C.cream,10,8);ctx.fillStyle=C.cherry;ctx.fillRect(-100,-110,200,56);ctx.font='90px Bagel,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(31-n),0,30);ctx.restore();
});
