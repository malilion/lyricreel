// target — Arrow flies into a bullseye
scene('target', {"desc": "Arrow flies into a bullseye", "fits": "aim, precision, hitting the mark", "demo": "Aim straight for my heart", "arg": "caption (default RIGHT ✓)"}, s=>{
  secBg(s);
  const cx=1060,cy=440;[[300,C.cream],[240,C.hot],[180,C.cream],[120,C.hot],[60,C.lemon]].forEach(([r,c],i)=>sticker(circleP(r,cx,cy),c,i?0:14,8));
  const hit=inv(.3,.55,s.p), ax=lerp(-300,cx,eIn(hit)), ay=lerp(cy-260,cy,eIn(hit));
  const wob=hit>=1?Math.sin((s.lt-s.dur*.55)*40)*Math.exp(-(s.lt-s.dur*.55)*5)*.2:0;
  ctx.save();ctx.translate(ax,ay);ctx.rotate(Math.atan2(260,cx+300)+wob);
  ctx.fillStyle=C.ink;ctx.fillRect(-420,-9,420,18);const tip=P();tip.moveTo(20,0);tip.lineTo(-40,-26);tip.lineTo(-40,26);tip.closePath();sticker(tip,C.cream,0,6);
  const fl=P();fl.moveTo(-420,0);fl.lineTo(-360,-50);fl.lineTo(-320,-50);fl.lineTo(-360,0);fl.lineTo(-320,50);fl.lineTo(-360,50);fl.closePath();sticker(fl,C.hot,0,6);ctx.restore();
  if(hit>=1){const k=eBack(inv(.55,.65,s.p));for(let i=0;i<10;i++){const a=i/10*TAU;ctx.strokeStyle=C.ink;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*330,cy+Math.sin(a)*330);ctx.lineTo(cx+Math.cos(a)*(330+80*k),cy+Math.sin(a)*(330+80*k));ctx.stroke()}
    ctx.save();ctx.translate(cx+360,cy-260);ctx.rotate(.2);ctx.scale(k,k);stext(s.arg||'RIGHT ✓',0,0,90,C.mint);ctx.restore()}
});
