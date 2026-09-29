// beach — Beach with palm tree, umbrella, circled holiday date and a slow snail
scene('beach', {"desc": "Beach with palm tree, umbrella, circled holiday date and a slow snail", "fits": "holiday, vacation, relax, slow, summer", "demo": "Take a day off with me", "arg": "calendar label (default HOLIDAY)"}, s=>{
  const g=ctx.createLinearGradient(0,0,0,600);g.addColorStop(0,C.sky);g.addColorStop(1,C.blush);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  sticker(circleP(150,1450,250),C.lemon,0,10);
  for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#5fc3f2':'#3aa6e0';ctx.beginPath();ctx.moveTo(0,560+i*30);for(let x=0;x<=W;x+=40)ctx.lineTo(x,560+i*30+Math.sin(x*.01+s.t*2+i)*10);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill()}
  ctx.fillStyle='#ffe0a8';ctx.beginPath();ctx.moveTo(0,760);ctx.quadraticCurveTo(960,690,W,760);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  palm(260,820,1,s.t);
  // 陽傘
  ctx.save();ctx.translate(1280,820);ctx.strokeStyle=C.ink;ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-40,-330);ctx.stroke();ctx.translate(-40,-330);ctx.rotate(-.12);
  const um=P();um.moveTo(-260,40);um.quadraticCurveTo(0,-230,260,40);um.closePath();sticker(um,C.hot,10,9);ctx.save();ctx.clip(um);ctx.fillStyle=C.cream;for(let i=-3;i<3;i+=2){ctx.beginPath();ctx.moveTo(0,-200);ctx.lineTo(i*90,60);ctx.lineTo((i+1)*90,60);ctx.fill()}ctx.restore();ctx.stroke(um);ctx.restore();
  // 日曆圈起的假日
  ctx.save();ctx.translate(700,300);ctx.rotate(-.08);sticker(rrP(240,250,16),C.cream,10,8);ctx.fillStyle=C.cherry;ctx.fillRect(-120,-125,240,60);ctx.font='26px Grotesk,'+FONT_FALLBACK;ctx.fillStyle=C.cream;ctx.textAlign='center';ctx.fillText(s.arg||'HOLIDAY',0,-86);
  ctx.font='110px Bagel,'+FONT_FALLBACK;ctx.fillStyle=C.ink;ctx.textBaseline='middle';ctx.fillText('♥',0,40);ctx.restore();
  // 慢慢爬的蝸牛
  snailProp(lerp(1560,1420,s.p),770,.6,s.t);
});
