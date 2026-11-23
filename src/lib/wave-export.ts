const PAINTED=['fill','stroke'] as const;
export function currentWaveSvg(svg:SVGSVGElement){
 const copy=svg.cloneNode(true) as SVGSVGElement;
 copy.setAttributeNS('http://www.w3.org/2000/xmlns/','xmlns','http://www.w3.org/2000/svg');
 copy.setAttribute('width','400');copy.setAttribute('height','120');
 copy.setAttribute('font-family','Arial, Helvetica, sans-serif');
 // Colours come from scheme tokens in CSS; bake the ones on screen into the copy so it matches what was seen.
 const source=svg.querySelectorAll<SVGElement>('[class]'),target=copy.querySelectorAll<SVGElement>('[class]');
 source.forEach((element,index)=>{
  const style=typeof getComputedStyle==='function'?getComputedStyle(element):null;
  for(const property of PAINTED){const value=style?.getPropertyValue(property).trim();if(value&&/^(#|rgb)/.test(value)&&target[index].hasAttribute(property))target[index].setAttribute(property,value);}
 });
 return new XMLSerializer().serializeToString(copy);
}
