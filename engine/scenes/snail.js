// snail — Heart-shelled snail crawls; speed display reads 0.1 km/h
scene('snail', {"desc": "Heart-shelled snail crawls; speed display reads 0.1 km/h", "fits": "slow, lazy, taking time, going nowhere", "demo": "Take it slow, we got all night", "arg": "speed text (default 0.1)"}, s=>{
  halftone(C.cream,C.blush,s.t,{drift:4});
  ctx.fillStyle=C.mint;ctx.fillRect(0,760,W,H-760);ctx.strokeStyle=C.ink;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,760);ctx.lineTo(W,760);ctx.stroke();
  snailProp(lerp(1400,1100,s.p),720,1.25,s.t);
  // 慢速儀表
  ctx.save();ctx.translate(420,380);sticker(rrP(460,200,30),C.ink,10,0);ctx.font='120px Bagel,'+FONT_FALLBACK;ctx.fillStyle=C.lemon;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((s.arg||(0.1+Math.sin(s.t*.5)*.02).toFixed(1)),-40,0);
  ctx.font='700 40px Grotesk,'+FONT_FALLBACK;ctx.fillStyle=C.cream;ctx.fillText('km/h',150,40);ctx.restore();
  for(let i=0;i<4;i++){ctx.save();ctx.translate(1100+lerp(300,0,s.p)-300-i*70,700);ctx.fillStyle='rgba(27,10,36,.25)';ctx.fill(ellP(40,10));ctx.restore()}
});
