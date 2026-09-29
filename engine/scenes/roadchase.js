// roadchase — Perspective highway, a heart runs while little hearts chase it; crossed-out steering wheel
scene('roadchase', {"desc": "Perspective highway, a heart runs while little hearts chase it; crossed-out steering wheel", "fits": "chase, running, driving, speed, pursuit", "demo": "Catch me if you can, I'm already gone"}, s=>{
  // 天空 + 透視公路
  const hz=330;ctx.fillStyle=C.sky;ctx.fillRect(0,0,W,H);rays(960,hz,20,C.white,s.t,.25,.05);
  ctx.fillStyle=C.pink;ctx.fillRect(0,hz,W,H-hz);
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(930,hz);ctx.lineTo(990,hz);ctx.lineTo(1700,H);ctx.lineTo(220,H);ctx.fill();
  ctx.fillStyle='#3a2442';ctx.beginPath();ctx.moveTo(935,hz);ctx.lineTo(985,hz);ctx.lineTo(1660,H);ctx.lineTo(260,H);ctx.fill();
  for(let i=0;i<9;i++){const z=((i/9)+s.t*1.4)%1,z2=z+.045;const y1=hz+(H-hz)*z*z,y2=hz+(H-hz)*z2*z2;const w1=4+z*z*30,w2=4+z2*z2*30;
    ctx.fillStyle=C.lemon;ctx.beginPath();ctx.moveTo(960-w1,y1);ctx.lineTo(960+w1,y1);ctx.lineTo(960+w2,y2);ctx.lineTo(960-w2,y2);ctx.fill()}
  // 速度線
  ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=6;for(let i=0;i<22;i++){const a=hash(i)*TAU,r0=300+((s.t*900+hash(i*3)*900)%900);
    ctx.beginPath();ctx.moveTo(960+Math.cos(a)*r0,hz+Math.sin(a)*r0*.6);ctx.lineTo(960+Math.cos(a)*(r0+120),hz+Math.sin(a)*(r0+120)*.6);ctx.stroke()}
  // 奔跑的愛心 + 追逐的小愛心
  const run=Math.abs(Math.sin(s.t*9))*30;
  heart(960+Math.sin(s.t*2.2)*220,700-run,260*(1+s.b*.08),C.hot,Math.sin(s.t*9)*.12);
  for(let k=0;k<3;k++){const ph=s.t*2.2-(k+1)*.5;heart(960+Math.sin(ph)*220*(1-.12*(k+1)),900-k*50-Math.abs(Math.sin(s.t*9+k))*20,90-k*15,[C.lemon,C.cream,C.mint][k],Math.sin(s.t*9+k)*.2)}
  // 前半段：打叉的方向盤
  const a=eBack(inv(0,.2,s.lt))*(1-inv(.55,.7,s.p));if(a>0){ctx.save();ctx.translate(260,230);ctx.rotate(s.t*2);ctx.scale(a,a);wheel();ctx.restore();
    ctx.save();ctx.translate(260,230);ctx.scale(a,a);stext('✗',0,0,220,C.cherry);ctx.restore()}
});
