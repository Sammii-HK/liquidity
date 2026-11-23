export const SCENE = { width:300, height:100 };
export function scenePoint(clientX:number,clientY:number,rect:{left:number;top:number;width:number;height:number},width=300,height=100) {
  if(rect.width<=0||rect.height<=0)return {x:width/2,y:height/2};
  return {x:Math.max(0,Math.min(width,(clientX-rect.left)/rect.width*width)),y:Math.max(0,Math.min(height,(clientY-rect.top)/rect.height*height))};
}
export function impulseAt(position:{x:number;y:number},origin:{x:number;y:number},kind:'move'|'splash') {
  const dx=position.x-origin.x,dy=position.y-origin.y;
  const distance=Math.hypot(dx,dy),radius=kind==='splash'?50:40;
  if(!Number.isFinite(distance)||distance>radius)return null;
  const nx=distance>0.0001?dx/distance:0,ny=distance>0.0001?dy/distance:-1;
  const safe=Math.max(distance,0.1);
  // Splash eases from full strength at the centre to nothing at the rim, so a tap reads as a ripple, not a flat shove.
  const strength=kind==='splash'?500*(1-distance/radius)**2:Math.min(10000/(safe*safe),300);
  return {x:nx*strength,y:ny*strength*(kind==='splash'?0.3:1)};
}
export function wavePath(phase:number,amplitude=12) {
  const safePhase=Number.isFinite(phase)?phase:200;
  const safeAmplitude=Math.max(0,Math.min(28,Number.isFinite(amplitude)?amplitude:12));
  let path='M0,70';
  for(let x=0;x<=400;x+=20)path+=` L${x},${(70+safeAmplitude*Math.sin((x-safePhase)*0.02+Math.PI/2)).toFixed(3)}`;
  return path+' V120 H0 Z';
}
