import type {Metadata} from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';
export const metadata:Metadata={title:'Liquidity | Two ways to move type',description:'Explore a GSAP wave and Rapier rigid-body particles through the same word, with explicit playback and accessible controls.'};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><div className="app-shell"><Navigation/>{children}<footer><span>Liquidity / an exploration by Sammii Kellow</span><span>SVG curves and rigid bodies. Two different materials.</span></footer></div></body></html>;
}
