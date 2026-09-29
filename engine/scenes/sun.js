// sun — Big sun with sunglasses, rotating rays and heat waves
scene('sun', {"desc": "Big sun with sunglasses, rotating rays and heat waves", "fits": "summer, sun, hot, day, shine", "demo": "Shining brighter every day"}, s=>{
  halftone(C.lemon,C.orange,s.t,{drift:10});rays(960,450,24,C.orange,s.t,.4,.25);
  const cx=960,cy=450,sc=eBack(inv(0,.3,s.lt))*(1+s.b*.06);ctx.save();ctx.translate(cx,cy);ctx.scale(sc,sc);ctx.rotate(Math.sin(s.t)*.05);
  for(let i=0;i<14;i++){ctx.save();ctx.rotate(i/14*TAU+s.t*.5);const r=P();r.moveTo(250,-34);r.lineTo(360+Math.sin(s.t*5+i)*20,0);r.lineTo(250,34);r.closePath();sticker(r,C.orange,6,8);ctx.restore()}
  sticker(circleP(240),C.lemon,14,12);
  // 墨鏡
  const gl=P();gl.roundRect(-190,-70,160,110,40);gl.roundRect(30,-70,160,110,40);sticker(gl,C.ink,0,0);ctx.lineWidth=16;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(-40,-40);ctx.lineTo(40,-40);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(-160,-50,40,16);ctx.fillRect(60,-50,40,16);
  ctx.lineWidth=14;ctx.beginPath();ctx.arc(0,70,90,.3,Math.PI-.3);ctx.stroke();ctx.fillStyle=C.hot;ctx.fill(circleP(34,-150,70));ctx.fill(circleP(34,150,70));ctx.restore();
  // 熱浪
  ctx.strokeStyle='rgba(255,46,126,.6)';ctx.lineWidth=8;for(let k=0;k<3;k++){ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,880+k*50+Math.sin(x*.02+s.t*6+k)*14);ctx.stroke()}
});
