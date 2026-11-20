'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Waves} from 'lucide-react';
export default function Navigation(){
 const path=usePathname();
 return <><a href="#main" className="skip-link">Skip to the study</a><header className="site-header"><Link className="wordmark" href="/"><Waves size={23} aria-hidden="true"/>Liquidity<span> / motion studies</span></Link><nav aria-label="Study sections">{[['/','Overview'],['/gsap','Wave'],['/canvas','Particles']].map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined}>{label}</Link>)}</nav></header></>;
}
