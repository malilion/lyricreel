// heatrain — Blazing heat and thermometer, then clouds roll in and it rains
scene('heatrain', {"desc": "Blazing heat and thermometer, then clouds roll in and it rains", "fits": "heat vs rain, weather change, cooling down", "demo": "Too hot, bring on the rain"}, s=>{
  const r=inv(.45,.7,s.p);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,r<.5?C.orange:'#6a7fd6');g.addColorStop(1,r<.5?C.hot:'#b7a3ff');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalAlpha=1-r;rays(960,300,20,C.lemon,s.t,.5,.4);sticker(circleP(200*(1+s.b*.1),960,300),C.lemon,0,10);ctx.restore();
  // 溫度計
  ctx.save();ctx.translate(250,160);sticker(rrP(80,560,40,0,0),C.cream,10,9);sticker(circleP(80,40,600),C.cherry,10,9);const lv=lerp(.95,.25,r);ctx.fillStyle=C.cherry;ctx.fillRect(22,560-520*lv,36,520*lv+40);ctx.restore();
  // 雲 + 雨
  const cl=eOut(r);for(let i=0;i<3;i++){ctx.save();ctx.translate(lerp(-400+i*1200,500+i*450,cl),180+i*30);const c=P();c.moveTo(-210,90);c.bezierCurveTo(-300,90,-290,-10,-190,0);c.bezierCurveTo(-190,-110,-40,-140,0,-60);c.bezierCurveTo(40,-170,220,-150,200,-20);c.bezierCurveTo(300,-20,310,90,210,90);c.closePath();sticker(c,C.cream,10,9);ctx.restore()}
  if(r>.3){ctx.strokeStyle='rgba(255,243,227,.9)';ctx.lineWidth=6;ctx.lineCap='round';for(let i=0;i<120;i++){const x=hash(i)*W*1.1,y=((s.t*1400+hash(i*3)*H)%H);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-14,y+50);ctx.stroke()}}
  // 流汗的愛心 → 撐傘
  heart(1300,640,300,C.hot,Math.sin(s.t*3)*.1);
  if(r<.5){for(let i=0;i<3;i++){const y=((s.t*200+i*60)%180);ctx.fillStyle=C.sky;ctx.beginPath();ctx.arc(1420+i*20,520+y,14,0,TAU);ctx.fill()}}
  else{ctx.save();ctx.translate(1300,380);ctx.strokeStyle=C.ink;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,200);ctx.stroke();const um=P();um.moveTo(-230,40);um.quadraticCurveTo(0,-200,230,40);um.closePath();sticker(um,C.lemon,8,9);ctx.restore()}
});
