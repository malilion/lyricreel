// orbit — Ringed planet with a personal-space bubble; a small planet orbits and bounces off
scene('orbit', {"desc": "Ringed planet with a personal-space bubble; a small planet orbits and bounces off", "fits": "space, distance, closeness, orbit, stars", "demo": "Come closer, but not too close"}, s=>{
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1b0a3a');g.addColorStop(1,'#5a1a6e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<140;i++){const x=hash(i)*W,y=hash(i*2.7)*H,tw=.5+.5*Math.sin(s.t*3+i);ctx.fillStyle=`rgba(255,243,227,${.3+tw*.7})`;ctx.fillRect(x,y,3+tw*2,3+tw*2)}
  for(let i=0;i<5;i++)sparkle(hash(i*9)*W,hash(i*13)*H*.8,14+10*Math.sin(s.t*2+i),C.lemon,0);
  const cx=960,cy=450;
  // 個人空間泡泡
  const R=270+s.b*25;ctx.save();ctx.setLineDash([26,20]);ctx.lineDashOffset=-s.t*60;ctx.lineWidth=8;ctx.strokeStyle=C.mint;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();ctx.restore();
  ctx.fillStyle='rgba(125,232,195,.08)';ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();
  // 主角星球（帶環）
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.35);
  ctx.lineWidth=22;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.ellipse(6,6,240,60,0,Math.PI,TAU);ctx.stroke();ctx.strokeStyle=C.lemon;ctx.lineWidth=14;ctx.beginPath();ctx.ellipse(0,0,240,60,0,Math.PI,TAU);ctx.stroke();
  sticker(circleP(150),C.hot,12,10);ctx.fillStyle=C.pink;ctx.fill(ellP(60,30,-40,-60,.3));ctx.fill(ellP(30,18,60,40,.3));
  ctx.lineWidth=22;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.ellipse(6,6,240,60,0,0,Math.PI);ctx.stroke();ctx.strokeStyle=C.lemon;ctx.lineWidth=14;ctx.beginPath();ctx.ellipse(0,0,240,60,0,0,Math.PI);ctx.stroke();ctx.restore();
  // 靠近又被彈開的小星球
  const ang=s.t*1.6, want=lerp(520,R+40,Math.abs(Math.sin(s.t*1.2))), r=Math.max(R+75,want);
  const ox=cx+Math.cos(ang)*r*1.25, oy=cy+Math.sin(ang)*r*.8;
  ctx.save();ctx.translate(ox,oy);sticker(circleP(62),C.lemon,7,8);ctx.fillStyle=C.ink;ctx.fill(circleP(7,-18,-6));ctx.fill(circleP(7,18,-6));ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,10,16,.2,Math.PI-.2);ctx.stroke();ctx.restore();
  if(r<=R+80){ctx.save();ctx.translate(cx+Math.cos(ang)*(R+10)*1.1,cy+Math.sin(ang)*(R+10)*.85);ctx.rotate(ang);ctx.strokeStyle=C.cream;ctx.lineWidth=7;
    for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(10,i*30);ctx.lineTo(50,i*44);ctx.stroke()}ctx.restore()}
});
