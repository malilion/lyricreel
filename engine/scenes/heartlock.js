// heartlock — Heart-shaped padlock; a key slides in, turns and opens it
scene('heartlock', {"desc": "Heart-shaped padlock; a key slides in, turns and opens it", "fits": "letting someone in, unlock, trust, secret", "demo": "You hold the only key"}, s=>{
  secBg(s);
  const cx=960,cy=500,open=eBack(inv(.55,.7,s.p));
  ctx.save();ctx.translate(cx,cy-120-open*90);ctx.rotate(open*-.25);ctx.lineWidth=60;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(8,8,130,Math.PI,TAU);ctx.lineTo(138,120);ctx.moveTo(-122,8);ctx.lineTo(-122,120);ctx.stroke();
  ctx.lineWidth=42;ctx.strokeStyle='#d7d0e2';ctx.beginPath();ctx.arc(0,0,130,Math.PI,TAU);ctx.lineTo(130,110);ctx.moveTo(-130,0);ctx.lineTo(-130,110);ctx.stroke();ctx.restore();
  ctx.save();ctx.translate(cx,cy+90);ctx.scale(1+s.b*.05,1+s.b*.05);heart(0,0,560,C.hot);ctx.fillStyle=C.ink;ctx.fill(circleP(34,0,-20));ctx.fillRect(-14,-10,28,90);ctx.restore();
  // 鑰匙
  const kin=eOut(inv(.1,.45,s.p)), turn=inv(.45,.55,s.p)*Math.PI/2;
  ctx.save();ctx.translate(lerp(cx+700,cx+30,kin),cy+60);ctx.rotate(turn);ctx.scale(1,Math.cos(turn)*.7+.3);
  sticker(rrP(260,34,10,0,-17),C.lemon,6,8);sticker(circleP(70,330,0),C.lemon,8,8);ctx.save();ctx.translate(330,4);ctx.fillStyle=C.hot;ctx.fill(heartP(70));ctx.restore();
  sticker(rrP(30,50,6,40,10),C.lemon,4,7);sticker(rrP(30,40,6,100,10),C.lemon,4,7);ctx.restore();
  if(open>.5)for(let i=0;i<6;i++){const a=i/6*TAU;sparkle(cx+Math.cos(a)*380,cy+Math.sin(a)*300,30,C.lemon,s.t)}
});
