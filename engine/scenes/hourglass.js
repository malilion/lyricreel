// hourglass — Hourglass flips and drains while a heart shrinks
scene('hourglass', {"desc": "Hourglass flips and drains while a heart shrinks", "fits": "time, moment, waiting, losing", "demo": "Time is running out on us"}, s=>{
  secBg(s);
  const cx=960,cy=460, flip=eIO(inv(0,.3,s.lt));ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.PI*(1-flip)+Math.sin(s.t*2)*.03);
  const q=s.p, top=1-q*.9;
  const glass=P();glass.moveTo(-190,-300);glass.lineTo(190,-300);glass.bezierCurveTo(190,-120,24,-60,24,0);glass.bezierCurveTo(24,60,190,120,190,300);glass.lineTo(-190,300);glass.bezierCurveTo(-190,120,-24,60,-24,0);glass.bezierCurveTo(-24,-60,-190,-120,-190,-300);glass.closePath();
  sticker(glass,'#f6f0ff',14,10);
  ctx.save();ctx.clip(glass);ctx.fillStyle=C.hot;
  ctx.fillRect(-200,-300+(1-top)*280,400,280*top);ctx.beginPath();const bh=260*(1-top)+20;ctx.moveTo(-200,300);ctx.lineTo(-200,300-bh*.6);ctx.quadraticCurveTo(0,300-bh*1.4,200,300-bh*.6);ctx.lineTo(200,300);ctx.fill();
  if(flip>.95)ctx.fillRect(-5,-10,10,300);ctx.restore();ctx.lineWidth=10;ctx.strokeStyle=C.ink;ctx.stroke(glass);
  sticker(rrP(460,50,20,-230,-350),C.lemon,8,8);sticker(rrP(460,50,20,-230,300),C.lemon,8,8);ctx.restore();
  // 旁邊的心逐漸縮小
  heart(1400,300,160*(1-q*.6)*(1+s.b*.1),C.hot,.15);
  for(let i=0;i<5;i++)sparkle(520-i*50,200+i*130,20+s.b*14,C.white,s.t+i);
});
