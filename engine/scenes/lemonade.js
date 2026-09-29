// lemonade — Glass of lemonade drained through a straw, floating lemon slices
scene('lemonade', {"desc": "Glass of lemonade drained through a straw, floating lemon slices", "fits": "drink, sip, sweet, lemonade, refresh", "demo": "Sweet and sour, just like me", "arg": "handwritten note (default sip~)"}, s=>{
  halftone(C.mint,'#5fd6ad',s.t);
  const cx=960,cy=500,level=lerp(.9,.25,eIO(s.p));
  const glass=P();glass.moveTo(-200,-280);glass.lineTo(200,-280);glass.lineTo(160,300);glass.quadraticCurveTo(0,330,-160,300);glass.closePath();
  // 吸管
  ctx.save();ctx.translate(60,0);ctx.lineCap='round';ctx.lineWidth=46;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(cx+36,cy+200);ctx.lineTo(cx+100,cy-400);ctx.lineTo(cx+230,cy-470);ctx.stroke();
  ctx.lineWidth=32;ctx.strokeStyle=C.hot;ctx.stroke();ctx.setLineDash([22,22]);ctx.strokeStyle=C.cream;ctx.stroke();ctx.setLineDash([]);ctx.restore();
  ctx.save();ctx.translate(cx,cy);sticker(glass,'#eefaf6',14,0);ctx.save();ctx.clip(glass);
  const top=300-580*level;ctx.fillStyle=C.lemon;ctx.beginPath();ctx.moveTo(-220,top);for(let x=-220;x<=220;x+=20)ctx.lineTo(x,top+Math.sin(x*.03+s.t*4)*8);ctx.lineTo(220,340);ctx.lineTo(-220,340);ctx.fill();
  for(let i=0;i<3;i++){ctx.save();ctx.translate(-90+i*90,Math.max(top+40,-200)+Math.sin(s.t*2+i)*14);ctx.rotate(.3*i-.3);sticker(rrP(90,90,16),'rgba(255,255,255,.7)',0,6);ctx.restore()}
  for(let i=0;i<14;i++){const y=300-((s.t*120+i*47)%Math.max(40,300-top));ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-150+hash(i)*300,y,4+i%3*3,0,TAU);ctx.stroke()}
  ctx.restore();ctx.lineWidth=12;ctx.strokeStyle=C.ink;ctx.stroke(glass);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(-160,-240,20,380);
  // 杯緣檸檬片
  ctx.translate(-190,-280);ctx.rotate(-.4);sticker(circleP(90),C.lemon,8,9);ctx.fillStyle=C.cream;ctx.fill(circleP(72));ctx.fillStyle=C.lemon;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,64,i/8*TAU+.06,(i+1)/8*TAU-.06);ctx.fill()}ctx.restore();
  if(s.p>.4){ctx.save();ctx.translate(1450,260);ctx.rotate(.12);ctx.font='110px Caveat,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.fillText(s.arg||'sip~',0,0);ctx.restore()}
  [[330,260],[520,620],[1500,560],[1700,180]].forEach(([x,y],i)=>{ctx.save();ctx.translate(x,y+Math.sin(s.t*2+i)*30);ctx.rotate(s.t*.8+i);sticker(circleP(58),C.lemon,6,7);ctx.fillStyle=C.cream;ctx.fill(circleP(46));ctx.fillStyle=C.lemon;for(let j=0;j<8;j++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,40,j/8*TAU+.08,(j+1)/8*TAU-.08);ctx.fill()}ctx.restore()});
});
