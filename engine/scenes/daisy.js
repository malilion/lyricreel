// daisy — Daisy loses its petals one by one; a sign gets crossed out
scene('daisy', {"desc": "Daisy loses its petals one by one; a sign gets crossed out", "fits": "loves-me-not, choosing, rejection, flowers", "demo": "Loves me, loves me not", "arg": "sign text (default LOVES ME?)"}, s=>{
  secBg(s);
  const cx=760,cy=440,np=12, gone=Math.floor(clamp(s.p/.8)*np);
  ctx.strokeStyle=C.ink;ctx.lineWidth=30;ctx.beginPath();ctx.moveTo(cx+8,cy);ctx.quadraticCurveTo(cx-60,cy+300,cx+20,H+20);ctx.stroke();ctx.strokeStyle=C.green;ctx.lineWidth=18;ctx.stroke();
  for(let i=0;i<np;i++){const a=i/np*TAU+Math.sin(s.t)*.05;
    if(i<gone){ // 飄落的花瓣
      const since=(s.lt-(i+1)/np*.8*s.dur);const fx=cx+Math.cos(a)*200+since*140+Math.sin(since*5+i)*40, fy=cy+Math.sin(a)*200+since*380;
      ctx.save();ctx.translate(fx,fy);ctx.rotate(a+since*4);sticker(ellP(95,34,0,0),C.white,5,7);ctx.restore();continue}
    ctx.save();ctx.translate(cx,cy);ctx.rotate(a);sticker(ellP(115,42,150,0),C.white,6,8);ctx.restore()}
  sticker(circleP(95,cx,cy),C.lemon,10,10);ctx.fillStyle=C.orange;for(let i=0;i<14;i++)ctx.fill(circleP(8,cx+Math.cos(i*2.4)*50*Math.sqrt(i/14),cy+Math.sin(i*2.4)*50*Math.sqrt(i/14)));
  // 右側牌子，後半段被打叉
  ctx.save();ctx.translate(1420,420);ctx.rotate(.06+Math.sin(s.t*2)*.03);sticker(rrP(520,230,30),C.cream,12,10);ctx.font='96px Bagel,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.arg||'LOVES ME?',0,6);
  const x=eBack(inv(.45,.6,s.p));if(x>0){ctx.scale(x,x);stext('✗',0,0,300,C.cherry)}ctx.restore();
});
