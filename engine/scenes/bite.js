// bite — Lips approach a giant cherry and bite it
scene('bite', {"desc": "Lips approach a giant cherry and bite it", "fits": "bite, teeth, temptation, fruit", "demo": "One little bite and you're hooked", "arg": "burst word (default CHOMP!)"}, s=>{
  secBg(s);
  const q=s.p, bite=inv(.35,.45,q);
  const cx=1180,cy=440;const sq=1+s.b*.06;
  ctx.save();ctx.translate(cx,cy);ctx.scale(sq,sq);
  // 巨大櫻桃
  ctx.lineCap='round';ctx.strokeStyle=C.ink;ctx.lineWidth=26;ctx.beginPath();ctx.moveTo(0,-230);ctx.quadraticCurveTo(40,-360,140,-400);ctx.stroke();
  ctx.strokeStyle=C.green;ctx.lineWidth=14;ctx.stroke();
  sticker(circleP(260),C.cherry,16,12);ctx.fillStyle='rgba(255,255,255,.8)';ctx.fill(ellP(70,34,-110,-120,-.6));
  // 咬痕
  if(bite>0){const [bg]=secColors(s.sec);
    for(let i=0;i<5;i++){const a=Math.PI*.82+i*.14;const r=58*bite;ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(Math.cos(a)*262+6,Math.sin(a)*262+6,r,0,TAU);ctx.fill()}
    for(let i=0;i<5;i++){const a=Math.PI*.82+i*.14;const r=52*bite;ctx.fillStyle=C.blush;ctx.beginPath();ctx.arc(Math.cos(a)*262,Math.sin(a)*262,r,0,TAU);ctx.fill()}}
  ctx.restore();
  // 嘴唇：靠近 → 咬 → 退開
  const app=q<.4?eIO(inv(0,.38,q)):1-eOut(inv(.45,.7,q))*.6;
  const lx=lerp(250,cx-360,app), open=q<.36?clamp(q/.3):q<.45?1-inv(.36,.45,q):.1;
  ctx.save();ctx.translate(lx,cy+60);ctx.rotate(-.15);drawLips(190,C.hot,open);
  if(open>.4){ctx.fillStyle=C.white;for(let i=-2;i<=2;i++){ctx.fillRect(i*34-14,-8-open*20,28,26)}}ctx.restore();
  if(bite>.5&&q<.8){const k=eBack(inv(.4,.5,q));ctx.save();ctx.translate(cx-330,cy-230);ctx.rotate(-.2);ctx.scale(k,k);stext(s.arg||'CHOMP!',0,0,110,C.lemon);ctx.restore();
    for(let i=0;i<7;i++){const a=-2.4+i*.25;ctx.strokeStyle=C.ink;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(cx-230+Math.cos(a)*120,cy+Math.sin(a)*120);ctx.lineTo(cx-230+Math.cos(a)*200*k,cy+Math.sin(a)*200*k);ctx.stroke()}}
});
