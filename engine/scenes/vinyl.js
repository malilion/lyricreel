// vinyl — Spinning record; music notes turn into hearts halfway
scene('vinyl', {"desc": "Spinning record; music notes turn into hearts halfway", "fits": "music, song, dance, records", "demo": "Play our song one more time"}, s=>{
  secBg(s);
  const cx=760,cy=460;ctx.save();ctx.translate(cx,cy);ctx.rotate(s.t*3.5);
  sticker(circleP(330),C.ink,14,0);ctx.strokeStyle='#3b2346';ctx.lineWidth=3;for(let r=140;r<320;r+=16){ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke()}
  ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,320,-.4,.1);ctx.fill();ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,320,2.7,3.2);ctx.fill();
  sticker(circleP(120),C.hot,0,6);ctx.fillStyle=C.cream;ctx.fill(heartP(120));sticker(circleP(12),C.ink,0,0);ctx.restore();
  // 唱臂
  ctx.save();ctx.translate(1180,160);ctx.rotate(.55+Math.sin(s.t*2)*.01);sticker(rrP(26,340,13,-13,0),C.cream,6,7);sticker(rrP(60,80,12,-30,320),C.lemon,6,7);ctx.restore();sticker(circleP(50,1180,160),C.lemon,6,8);
  // 音符 → 愛心
  for(let i=0;i<9;i++){const ph=(s.lt*.55+i/9)%1, x=cx+200+ph*900, y=cy-120-ph*320+Math.sin(ph*9+i)*50;const toHeart=s.p>.5;
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.sin(ph*Math.PI);
    if(toHeart){heart(0,0,70,i%2?C.hot:C.cherry,Math.sin(s.t*3+i)*.3)}else{ctx.fillStyle=C.ink;ctx.fill(ellP(26,20,0,40,-.4));ctx.fillRect(18,-50,10,90);ctx.fillRect(18,-50,46,16)}
    ctx.restore()}
});
