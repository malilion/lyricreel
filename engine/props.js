// 多個場景共用的道具
function chefHat(){const p=P();p.moveTo(-95,40);p.bezierCurveTo(-200,15,-175,-130,-80,-105);p.bezierCurveTo(-60,-200,60,-200,80,-105);
  p.bezierCurveTo(175,-130,200,15,95,40);p.closePath();sticker(p,C.white,10,9);sticker(rrP(200,70,12,-100,35),C.white,10,9);
  ctx.lineWidth=6;ctx.strokeStyle=C.ink;[-50,0,50].forEach(x=>{ctx.beginPath();ctx.moveTo(x,45);ctx.lineTo(x,95);ctx.stroke()})}
function cherries(s){
  ctx.lineCap='round';ctx.strokeStyle=C.ink;ctx.lineWidth=20;
  const st=[[-70,60],[70,80]];st.forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(x,y-40);ctx.quadraticCurveTo(x*.3,-80,10,-150);ctx.stroke()});
  ctx.strokeStyle=C.green;ctx.lineWidth=10;st.forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(x,y-40);ctx.quadraticCurveTo(x*.3,-80,10,-150);ctx.stroke()});
  const leaf=P();leaf.moveTo(10,-150);leaf.quadraticCurveTo(90,-210,150,-150);leaf.quadraticCurveTo(80,-110,10,-150);sticker(leaf,C.green,6,6);
  st.forEach(([x,y])=>{sticker(circleP(78,x,y),C.cherry,10,9);ctx.fillStyle='rgba(255,255,255,.8)';ctx.fill(ellP(22,12,x-30,y-34,-.6))});
}
function wheel(){ctx.lineWidth=26;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.arc(6,6,110,0,TAU);ctx.stroke();ctx.strokeStyle=C.sky;ctx.lineWidth=18;ctx.beginPath();ctx.arc(0,0,110,0,TAU);ctx.stroke();
  ctx.lineWidth=14;ctx.strokeStyle=C.ink;for(const a of[0,2.1,4.2]){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a+1.57)*105,Math.sin(a+1.57)*105);ctx.stroke()}sticker(circleP(30),C.sky,4,7)}
function queenPiece(col){
  sticker(rrP(300,50,20,-150,150),col,12,10);
  const b=P();b.moveTo(-115,152);b.quadraticCurveTo(-55,30,-48,-58);b.lineTo(48,-58);b.quadraticCurveTo(55,30,115,152);b.closePath();sticker(b,col,12,10);
  const cr=P();cr.moveTo(-72,-70);cr.lineTo(-95,-178);cr.lineTo(-42,-118);cr.lineTo(0,-200);cr.lineTo(42,-118);cr.lineTo(95,-178);cr.lineTo(72,-70);cr.closePath();sticker(cr,C.lemon,10,9);
  sticker(ellP(82,20,0,-62),col,8,9);
  [[-95,-178],[0,-200],[95,-178]].forEach(([x,y])=>sticker(circleP(16,x,y),C.lemon,4,7));
  ctx.fillStyle='rgba(255,255,255,.55)';ctx.fill(ellP(12,60,-40,60,-.15));
}
function kingPiece(col){
  sticker(rrP(200,36,14,-100,100),col,8,8);
  const b=P();b.moveTo(-75,102);b.quadraticCurveTo(-36,20,-32,-40);b.lineTo(32,-40);b.quadraticCurveTo(36,20,75,102);b.closePath();sticker(b,col,8,8);
  sticker(rrP(80,40,14,-40,-80),col,6,8);sticker(rrP(18,64,4,-9,-140),col,5,7);sticker(rrP(52,18,4,-26,-122),col,5,7);
}
function palm(x,y,sc,t){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.strokeStyle=C.ink;ctx.lineWidth=46;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(40,-200,-20,-420);ctx.stroke();ctx.strokeStyle='#b0703a';ctx.lineWidth=32;ctx.stroke();
  for(let i=0;i<6;i++){ctx.save();ctx.translate(-20,-420);ctx.rotate(i/6*TAU+Math.sin(t*2+i)*.08);const l=P();l.moveTo(0,0);l.quadraticCurveTo(120,-70,230,20);l.quadraticCurveTo(120,-20,0,0);sticker(l,C.green,6,7);ctx.restore()}
  sticker(circleP(26,-10,-400),'#8a5a2b',4,6);sticker(circleP(26,-40,-395),'#8a5a2b',4,6);ctx.restore()}
function snailProp(x,y,sc,t){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
  const body=P();body.moveTo(-180,40);body.quadraticCurveTo(-190,-20,-140,-30);body.lineTo(120,-10);body.quadraticCurveTo(170,40,140,50);body.closePath();sticker(body,C.blush,8,8);
  ctx.strokeStyle=C.ink;ctx.lineWidth=8;[[-160,-90],[-120,-100]].forEach(([ex,ey])=>{ctx.beginPath();ctx.moveTo(-150,-30);ctx.lineTo(ex,ey+Math.sin(t*3)*6);ctx.stroke();sticker(circleP(12,ex,ey+Math.sin(t*3)*6),C.ink,0,0)});
  ctx.rotate(Math.sin(t*1.5)*.03);ctx.translate(20,-80);heart(0,0,220,C.hot,0);
  ctx.strokeStyle=C.ink;ctx.lineWidth=6;ctx.beginPath();for(let a=0;a<12;a+=.2){const r=8+a*5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r-10)}ctx.stroke();ctx.restore()}
