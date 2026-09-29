// queenrow — Row of five bouncing chess queens under a headline
scene('queenrow', {"desc": "Row of five bouncing chess queens under a headline", "fits": "hook repeats, post-chorus chants, attitude", "demo": "No games, no games", "arg": "headline (default NO GAMES)"}, s=>{
  halftone(...secColors(s.sec),s.t,{spacing:40,drift:40});
  rays(960,540,24,C.white,s.t,.25,.3);
  const n=5;for(let i=0;i<n;i++){const x=180+i*390, d=Math.abs(i-2);
    ctx.save();ctx.translate(x,500+d*40+Math.sin(s.t*8+i)*10*(1+s.b));const sc=(1-d*.18)*(1+s.b*.1)*.95;ctx.scale(i%2?-sc:sc,sc);
    ctx.rotate(Math.sin(s.t*4+i)*.05);queenPiece([C.hot,C.lilac,C.cherry,C.lilac,C.hot][i]);ctx.restore()}
  stext(s.arg||'NO GAMES',960,130,120,C.cream);
});
