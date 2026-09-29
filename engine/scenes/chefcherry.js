// chefcherry — No-cooking chef hat, then shiny cherries with sparkles and a check mark
scene('chefcherry', {"desc": "No-cooking chef hat, then shiny cherries with sparkles and a check mark", "fits": "taste, food, cooking, sweetness, cherries", "demo": "Can't bake a thing but I know what's sweet"}, s=>{
  secBg(s);
  const a=inv(0,.25,s.lt), q=s.p;
  // 左：廚師帽 + 禁止
  ctx.save();ctx.translate(560,420+Math.sin(s.t*3)*10);ctx.rotate(-.12);ctx.scale(eBack(a)*1.15,eBack(a)*1.15);chefHat();
  const nb=eBack(inv(.15,.45,q));ctx.save();ctx.scale(nb,nb);ctx.lineWidth=34;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(8,8,215,0,TAU);ctx.moveTo(-145,-145);ctx.lineTo(160,160);ctx.stroke();
  ctx.strokeStyle=C.cherry;ctx.lineWidth=24;ctx.beginPath();ctx.arc(0,0,215,0,TAU);ctx.moveTo(-150,-150);ctx.lineTo(152,152);ctx.stroke();ctx.restore();ctx.restore();
  // 右：櫻桃
  const c=eBack(inv(.4,.62,q));ctx.save();ctx.translate(1370,440+Math.sin(s.t*4)*12);ctx.rotate(.1+Math.sin(s.t*2)*.05);ctx.scale(c*(1.2+s.b*.1),c*(1.2+s.b*.1));cherries(s);ctx.restore();
  if(q>.55)for(let i=0;i<5;i++){const a2=i/5*TAU+s.t;sparkle(1370+Math.cos(a2)*300,430+Math.sin(a2)*230,30+18*Math.sin(s.t*6+i),i%2?C.lemon:C.white,s.t)}
  if(q>.6){ctx.save();ctx.translate(1600,210);ctx.rotate(.2);const k=eBack(inv(.6,.72,q));ctx.scale(k,k);stext('✓',0,0,150,C.mint);ctx.restore()}
});
