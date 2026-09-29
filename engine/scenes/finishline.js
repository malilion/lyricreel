// finishline — A heart sprints toward a finish line and brakes right before it
scene('finishline', {"desc": "A heart sprints toward a finish line and brakes right before it", "fits": "finish, race, goal, rushing, slowing down", "demo": "Slow down before you cross the line", "arg": "banner text (default FINISH)"}, s=>{
  ctx.fillStyle=C.mint;ctx.fillRect(0,0,W,H);rays(1500,430,16,C.white,s.t,.3,.1);
  // 跑道
  ctx.fillStyle=C.orange;ctx.fillRect(0,600,W,480);ctx.fillStyle=C.cream;for(let i=0;i<4;i++)ctx.fillRect(0,650+i*110,W,8);
  // 終點格子線
  const fx=1450;for(let r=0;r<16;r++)for(let c=0;c<2;c++){ctx.fillStyle=(r+c)&1?C.ink:C.white;ctx.fillRect(fx+c*30,600+r*30,30,30)}
  // 終點布條 + 旗子
  ctx.fillStyle=C.ink;ctx.fillRect(fx-10,180,18,430);ctx.fillRect(fx+60,180,18,430);
  ctx.save();ctx.translate(fx+34,230);for(let i=0;i<4;i++)for(let j=0;j<3;j++){const wv=Math.sin(s.t*6+i*.8)*10;ctx.fillStyle=(i+j)&1?C.ink:C.white;ctx.fillRect(40+i*55,-60+j*45+wv,55,45)}ctx.restore();
  sticker(rrP(480,90,20,fx-460,150),C.lemon,8,8);ctx.font='56px Bagel,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(s.arg||'FINISH',fx-220,198);
  // 愛心衝刺 → 急煞
  const q=s.p, x=lerp(150,fx-190,eOut(clamp(q/.7)));
  const skid=inv(.5,.7,q);if(skid>0){ctx.strokeStyle=C.ink;ctx.lineWidth=10;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(x-260*skid,790);ctx.lineTo(x,790);ctx.moveTo(x-220*skid,815);ctx.lineTo(x,815);ctx.stroke();ctx.globalAlpha=1}
  const lean=q<.55?.25:-.3*Math.exp(-(q-.55)*10);
  heart(x,680-Math.abs(Math.sin(s.t*10))*30*(q<.6?1:0),220,C.hot,lean);
  if(q<.6)for(let i=0;i<5;i++){ctx.strokeStyle=C.ink;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x-160-i*20,600+i*30);ctx.lineTo(x-260-i*40,600+i*30);ctx.stroke()}
  if(q>.65){const k=eBack(inv(.65,.75,q));ctx.save();ctx.translate(x+30,420);ctx.scale(k,k);stext('!',0,0,160,C.cherry);ctx.restore()}
});
