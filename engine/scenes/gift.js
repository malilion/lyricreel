// gift — Gift box shakes and pops: confetti and a diamond ring rises
scene('gift', {"desc": "Gift box shakes and pops: confetti and a diamond ring rises", "fits": "surprise, present, proposal, promise", "demo": "Wrap it up, a sweet surprise"}, s=>{
  secBg(s);
  const cx=960,cy=560,q=s.p, pop=inv(.35,.45,q), shake=q<.35?Math.sin(s.t*40)*.06*(q/.35):0;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(shake);
  sticker(rrP(420,300,20,-210,-60),C.hot,14,10);ctx.fillStyle=C.lemon;ctx.fillRect(-35,-60,70,300);ctx.lineWidth=8;ctx.strokeStyle=C.ink;ctx.strokeRect(-35,-60,70,300);
  ctx.save();ctx.translate(-pop*260,-pop*380);ctx.rotate(-pop*1.2);sticker(rrP(470,90,18,-235,-130),C.hot,10,10);ctx.fillStyle=C.lemon;ctx.fillRect(-35,-130,70,90);ctx.strokeRect(-35,-130,70,90);
  const bow=P();bow.moveTo(0,-130);bow.bezierCurveTo(-120,-240,-160,-100,0,-130);bow.moveTo(0,-130);bow.bezierCurveTo(120,-240,160,-100,0,-130);sticker(bow,C.lemon,6,8);ctx.restore();ctx.restore();
  if(pop>0){confetti(s.lt,70,11,[C.lemon,C.hot,C.mint,C.sky,C.cream],1.2);
    const rise=eBack(inv(.4,.6,q));ctx.save();ctx.translate(cx,cy-120-rise*220);ctx.scale(rise,rise);ctx.rotate(Math.sin(s.t*2)*.1);
    ctx.lineWidth=40;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.ellipse(6,56,110,100,0,0,TAU);ctx.stroke();ctx.lineWidth=26;ctx.strokeStyle=C.lemon;ctx.beginPath();ctx.ellipse(0,50,110,100,0,0,TAU);ctx.stroke();
    const gem=P();gem.moveTo(-70,-40);gem.lineTo(-40,-90);gem.lineTo(40,-90);gem.lineTo(70,-40);gem.lineTo(0,40);gem.closePath();sticker(gem,C.sky,8,8);
    ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-70,-40);ctx.lineTo(70,-40);ctx.moveTo(-20,-90);ctx.lineTo(0,-40);ctx.lineTo(20,-90);ctx.moveTo(0,-40);ctx.lineTo(0,40);ctx.stroke();ctx.restore();
    for(let i=0;i<6;i++){const a=i/6*TAU+s.t*2;sparkle(cx+Math.cos(a)*260,cy-340+Math.sin(a)*160,26+s.b*20,i%2?C.white:C.lemon,s.t)}}
});
