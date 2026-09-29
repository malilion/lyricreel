// kisses — Lipstick prints stamped on every beat around puckered lips
scene('kisses', {"desc": "Lipstick prints stamped on every beat around puckered lips", "fits": "kiss, love, lips, flirting", "demo": "Seal it with a kiss tonight"}, s=>{
  halftone(C.blush,C.pink,s.t,{spacing:52});
  // 依拍點蓋上口紅印
  const firstBeat=lastBeat(s.t0)+1, cur=lastBeat(s.t);
  for(let k=firstBeat;k<=cur;k++){const i=k-firstBeat, bt=AU.beats[k], a=clamp((s.t-bt)/.12);
    const x=200+hash(i*4.1+2)*1520,y=150+hash(i*7.3+1)*560,sc=lerp(1.8,1,eOut(a))*(.55+hash(i)*.4);
    ctx.save();ctx.translate(x,y);ctx.rotate((hash(i*3)-.5)*.8);ctx.scale(sc,sc);ctx.globalAlpha=.9*a;
    ctx.fillStyle=[C.cherry,C.hot,'#b0104a'][i%3];ctx.fill(lipsP(110));ctx.globalAlpha=1;ctx.strokeStyle=C.blush;ctx.lineWidth=6;
    for(let j=0;j<5;j++){ctx.beginPath();ctx.moveTo(-60+j*30,-30);ctx.lineTo(-58+j*28,20);ctx.stroke()}ctx.restore()}
  // 中央噘嘴大唇
  const pk=1+.12*Math.sin(s.lt*10)*(1-s.p)+s.b*.1;ctx.save();ctx.translate(960,420);ctx.scale(pk*1.3,pk*1.3);drawLips(200,C.cherry,0);ctx.restore();
  for(let i=0;i<6;i++){const a=i/6*TAU+s.t*.8, rr=330+Math.sin(s.t*3+i)*30;heart(960+Math.cos(a)*rr*1.4,420+Math.sin(a)*rr*.75,60+s.b*30,i%2?C.hot:C.lemon,a)}
});
