// title — 標題卡：歌名逐字彈出、放射光、漂浮愛心、歌手名牌
scene('title', {"desc":"Title card: the song title pops in letter by letter over sunburst rays, with an artist badge","fits":"intro, outro, instrumental breaks","arg":"text to show (default: project title)","demo":""}, s=>{
  secBg(s);rays(960,470,18,C.lemon,s.t,.28);
  floatHearts(s.t,14,3,[C.hot,C.lemon,C.cream],44);
  const word=String(s.arg||PROJECT.title||'LYRICREEL'), chars=[...word];
  let size=250;ctx.font=`${size}px Bagel, ${FONT_FALLBACK}`;let tw=ctx.measureText(word).width;
  if(tw>1600){size=Math.floor(size*1600/tw);ctx.font=`${size}px Bagel, ${FONT_FALLBACK}`;tw=ctx.measureText(word).width}
  const widths=chars.map(ch=>ctx.measureText(ch).width), reveal=Math.max(1.2,s.dur*.8), n=chars.length;
  let x=960-tw/2;
  chars.forEach((ch,i)=>{
    const born=i===0?-1:(i-1)/Math.max(1,n-1)*reveal, a=clamp((s.lt-born)/.25);
    const sc=eBack(a), bob=Math.sin(s.t*6+i*.8)*14*(1+s.b), rot=Math.sin(s.t*3+i)*.08;
    if(ch!==' '&&a>0){ctx.save();ctx.translate(x+widths[i]/2,430+bob);ctx.rotate(rot);ctx.scale(sc,sc*(1+s.b*.12));
      stext(ch,0,0,size,i===0?C.cream:[C.lemon,C.cream,C.sky,C.mint][i%4]);ctx.restore()}
    x+=widths[i];
  });
  if(PROJECT.artist){ctx.save();ctx.translate(960,640);ctx.rotate(-.04);ctx.font='700 38px Grotesk,'+FONT_FALLBACK;
    const aw=ctx.measureText(PROJECT.artist).width+120;sticker(rrP(aw,78,39),C.ink,0,0);
    ctx.fillStyle=C.cream;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(PROJECT.artist,0,2);ctx.restore()}
  for(let i=0;i<6;i++)sparkle(260+i*280+Math.sin(i)*60,180+hash(i)*120+Math.sin(s.t*2+i)*20,26+s.b*18,i%2?C.lemon:C.white,s.t+i);
});
