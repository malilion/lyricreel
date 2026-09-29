// typo — 通用動態字卡：一個大關鍵字＋殘影＋放射光。沒有合適意象時的萬用場景
scene('typo', {"desc":"Kinetic typography: one huge keyword with echo outlines and sunburst; the all-purpose fallback","fits":"any line, shouted hooks, when no motif fits","arg":"keyword (default: longest word in the line)","demo":"Turn it up louder"}, s=>{
  secBg(s);rays(960,440,20,C.white,s.t,.22,.2);
  const words=(s.line&&s.line.words||[]).map(w=>w.w.replace(/[^\p{L}\p{N}']/gu,'')).filter(Boolean);
  const kw=String(s.arg||words.slice().sort((a,b)=>b.length-a.length)[0]||'YEAH').toUpperCase();
  let size=300;ctx.font=`${size}px Bagel, ${FONT_FALLBACK}`;const w=ctx.measureText(kw).width;if(w>1500)size=Math.floor(size*1500/w);
  const k=eBack(inv(0,.25,s.lt))*(1+s.b*.08);
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=4;i>=1;i--){ctx.save();ctx.translate(960+i*16*Math.sin(s.t*2),440+i*20);ctx.scale(k,k);ctx.globalAlpha=.3;
    ctx.font=`${size}px Bagel, ${FONT_FALLBACK}`;ctx.lineWidth=6;ctx.strokeStyle=C.ink;ctx.strokeText(kw,0,0);ctx.restore()}
  ctx.save();ctx.translate(960,440);ctx.rotate(Math.sin(s.t*2)*.04);ctx.scale(k,k);stext(kw,0,0,size,C.lemon);ctx.restore();
  for(let i=0;i<8;i++){const a=i/8*TAU+s.t*.6;sparkle(960+Math.cos(a)*760,440+Math.sin(a)*330,22+s.b*20,i%2?C.white:C.lemon,s.t)}
});
