// queen — Spotlit chess queen on a checkerboard; the king gets knocked over
scene('queen', {"desc": "Spotlit chess queen on a checkerboard; the king gets knocked over", "fits": "confidence, power, winning, attitude", "demo": "I make the moves, you just watch", "arg": "caption after the king falls (default CHECKMATE)"}, s=>{
  ctx.fillStyle=C.ink;ctx.fillRect(0,0,W,H);
  checker(560,C.pink,C.cream,s.t,0);
  // 聚光燈
  const g=ctx.createRadialGradient(960,560,40,960,560,700);g.addColorStop(0,'rgba(255,225,77,.45)');g.addColorStop(1,'rgba(27,10,36,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(840,-10);ctx.lineTo(1080,-10);ctx.lineTo(1400,760);ctx.lineTo(520,760);ctx.fill();
  const a=eBack(inv(0,.25,s.lt));
  ctx.save();ctx.translate(960,500+(1-a)*300);const sc=(1.35+s.b*.06)*a;ctx.scale(sc,sc);queenPiece(C.hot);ctx.restore();
  // 小國王被撞倒
  const fall=eOut(inv(.45,.65,s.p));ctx.save();ctx.translate(1450+fall*60,680);ctx.rotate(fall*1.45);ctx.translate(0,-110);kingPiece(C.lilac);ctx.restore();
  if(fall>.9){ctx.save();ctx.translate(1560,480);ctx.rotate(.15);stext(s.arg||'CHECKMATE',0,0,70,C.lemon);ctx.restore()}
  for(let i=0;i<4;i++)sparkle(700+i*170,200+Math.sin(s.t*3+i)*30,24+s.b*20,C.lemon,s.t*2+i);
});
