// deepsea — Camera sinks through water, depth markers scroll, anchored heart
scene('deepsea', {"desc": "Camera sinks through water, depth markers scroll, anchored heart", "fits": "deep, falling, sinking, drowning, depth", "demo": "Falling deeper than the ocean"}, s=>{
  const d=s.p;const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,`hsl(${lerp(330,270,d)},${lerp(90,70,d)}%,${lerp(72,22,d)}%)`);g.addColorStop(1,`hsl(${lerp(300,255,d)},80%,${lerp(45,10,d)}%)`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // 光束
  ctx.save();ctx.globalAlpha=.12*(1-d*.7);ctx.fillStyle=C.white;for(let i=0;i<5;i++){ctx.beginPath();const x=300+i*330+Math.sin(s.t+i)*40;ctx.moveTo(x,0);ctx.lineTo(x+120,0);ctx.lineTo(x+320,H);ctx.lineTo(x+80,H);ctx.fill()}ctx.restore();
  bubblesUp(s.t,40,'rgba(255,243,227,.8)',5,260);
  // 深度刻度（向上捲動）
  const scroll=s.lt*420;ctx.save();
  for(let k=0;k<12;k++){const y=H*.5+k*260-scroll;if(y<-80||y>H+80)continue;ctx.strokeStyle='rgba(255,243,227,.6)';ctx.lineWidth=4;ctx.setLineDash([16,14]);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.setLineDash([]);
    ctx.font='700 34px Grotesk,'+FONT_FALLBACK;ctx.fillStyle=C.cream;ctx.textAlign='left';ctx.fillText(`-${(k+1)*100}m`,1700,y-14)}ctx.restore();
  // 深度計
  ctx.save();ctx.translate(120,140);sticker(rrP(60,760,30,0,0),C.cream,8,8);ctx.fillStyle=C.hot;ctx.fill(rrP(36,740*d,18,12,10));ctx.restore();
  // 下沉的愛心 + 錨
  const bob=Math.sin(s.t*2)*20;ctx.save();ctx.translate(960+Math.sin(s.t*1.3)*60,430+bob);ctx.rotate(Math.sin(s.t*1.7)*.15);
  ctx.strokeStyle=C.ink;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(0,-120);ctx.lineTo(0,-600);ctx.stroke();heart(0,0,300*(1+s.b*.08),C.hot);ctx.restore();
  for(let i=0;i<8;i++){const y=(430-((s.t*200+i*80)%400));ctx.strokeStyle=C.cream;ctx.lineWidth=4;ctx.beginPath();ctx.arc(960+Math.sin(s.t*1.3)*60+Math.sin(i*2)*80,y-120,6+i%3*5,0,TAU);ctx.stroke()}
});
