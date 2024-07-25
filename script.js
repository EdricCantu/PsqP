const can = document.getElementById('can');
const ctx = can.getContext('2d');
function resizeCanvas() {
  can.width = window.innerWidth;
  can.height = window.innerHeight;
  ctx.clearRect(0, 0, can.width, can.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
ctx.strokeStyle = "#777777";
ctx.lineWidth = 3;

function nearLD(perim, ld){
  const mustDiv = ld*2; //A pair of a line and a space.
  return (perim / Math.round(perim / mustDiv)) / 2;
}
function drawRoundRect(x,y, w,h, r){
  const lw = ctx.lineWidth;
  ctx.clearRect(x-lw,y-lw, w+(lw*2),h+(lw*2));
  ctx.moveTo(x, y+r);
  ctx.lineTo(x, (y+h)-r);//l t-b
  ctx.arcTo(x, y+h, x+r, y+h, r);
  ctx.lineTo((x+w)-r, y+h); //b l-r
  ctx.arcTo(x+w, y+h, x+w, (y+h)-r, r);
  ctx.lineTo(x+w, y+r); //r b-t
  ctx.arcTo(x+w, y, (x+w)-r, y, r);
  ctx.lineTo(x+r, y); //t r-l
  ctx.arcTo(x, y, x, y+r, r);
}
function drawDashedRoundRect(x,y, w,h, r, ld,ldo){
  const prevLd = ctx.getLineDash();
  const prevLdo = ctx.lineDashOffset;
  const d = 2*r;
  const perim = (Math.PI*d) + ((w-d)*2) + ((h-d)*2);
  ld = nearLD(perim, ld);
  ctx.setLineDash([ld,ld]);
  ctx.lineDashOffset = ldo;
  drawRoundRect(x,y,w,h,r);

  //ctx.setLineDash(prevLd);
  //ctx.lineDashOffset = prevLdo;
}
speed = 0.15;
begin = Date.now(); ldo = 0;
w = 300, h = 50, r = 25, ld = 15;

function animate(){
  ldo = (Date.now() - begin) * speed; 
  ctx.beginPath();
  drawDashedRoundRect(50,50, w,h, r, ld, ldo);
  ctx.stroke();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/*cmd for msg app via p2p rtc
███████████████████████████████ P2P: 

*/
