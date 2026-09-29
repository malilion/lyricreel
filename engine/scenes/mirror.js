// mirror — Hand mirror whose word stretches its last letter; tiled wallpaper of the word
scene('mirror', {"desc": "Hand mirror whose word stretches its last letter; tiled wallpaper of the word", "fits": "self-love, me, ego, reflection", "demo": "Look at me, look at me", "arg": "word in the mirror (default ME)"}, s=>{
  const [a,b]=secColors(s.sec);ctx.fillStyle=a;ctx.fillRect(0,0,W,H);
  const sz=180,off=(s.t*80)%sz;ctx.font='90px Bagel,'+FONT_FALLBACK;ctx.textAlign='center';ctx.textBaseline='middle';
  for(let y=-sz;y<H+sz;y+=sz)for(let x=-sz;x<W+sz;x+=sz){const i=Math.round(x/sz)+Math.round(y/sz)*3;ctx.fillStyle=i%2?b:C.cream;ctx.globalAlpha=.55;ctx.fillText(s.arg||'ME',x+off,y+off*.6);}
  ctx.globalAlpha=1;
  // 手鏡
  const k=eBack(inv(0,.2,s.lt))*(1+s.b*.08);ctx.save();ctx.translate(960,400);ctx.rotate(Math.sin(s.t*2)*.08);ctx.scale(k*.85,k*.85);
  sticker(rrP(80,300,30,-40,220),C.lemon,12,10);sticker(ellP(260,300),C.lemon,14,12);
  const gg=ctx.createLinearGradient(-200,-240,200,240);gg.addColorStop(0,C.sky);gg.addColorStop(1,C.lilac);ctx.fillStyle=gg;ctx.fill(ellP(210,250));ctx.lineWidth=8;ctx.strokeStyle=C.ink;ctx.stroke(ellP(210,250));
  ctx.save();ctx.clip(ellP(210,250));ctx.fillStyle='rgba(255,255,255,.4)';ctx.beginPath();ctx.moveTo(-200,-100);ctx.lineTo(-100,-260);ctx.lineTo(-50,-260);ctx.lineTo(-170,-40);ctx.fill();ctx.restore();
  const es=1+Math.floor(s.p*5);const wd=s.arg||'ME', str=wd+wd.slice(-1).repeat(es-1);stext(str,0,0,Math.min(170,900/(str.length+1)),C.hot);ctx.restore();
  for(let i=0;i<8;i++){const a2=i/8*TAU+s.t;sparkle(960+Math.cos(a2)*420,470+Math.sin(a2)*340,20+s.b*26,i%2?C.white:C.lemon,s.t)}
});
