import { useId } from "react";
import type { WatchTone } from "@/lib/collection";

const appearances = {
  champagne: {
    metalHi: "#f5e5b6", metal: "#c7a974", metalLo: "#57482f", dial: "#152a22", dialDeep: "#07100f", hand: "#d4bc88", leather: "#141a16", jewel: "#9a664d",
  },
  steel: {
    metalHi: "#f1f2ed", metal: "#b0b8b4", metalLo: "#4a5e5e", dial: "#283237", dialDeep: "#0d1317", hand: "#d3ded9", leather: "#1c262b", jewel: "#73968b",
  },
  copper: {
    metalHi: "#f4cbbb", metal: "#bd8679", metalLo: "#4c2c2c", dial: "#2b1e1d", dialDeep: "#100d0d", hand: "#ebc4ab", leather: "#1b1214", jewel: "#be8a56",
  },
} as const;

export function WatchVisual({ tone = "champagne", className = "", label = "ساعت مکانیکی هورل" }: { tone?: WatchTone; className?: string; label?: string }) {
  const uid = useId().replace(/:/g, "");
  const t = appearances[tone];
  const ID = (s: string) => `${uid}-${s}`;
  return (
    <svg className={`watch-visual ${className}`} viewBox="0 0 700 900" role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={ID("strap")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#070a09"/><stop offset=".17" stopColor={t.leather}/><stop offset=".51" stopColor="#354038"/><stop offset=".82" stopColor={t.leather}/><stop offset="1" stopColor="#050706"/>
        </linearGradient>
        <linearGradient id={ID("case")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.metalLo}/><stop offset=".17" stopColor={t.metalHi}/><stop offset=".35" stopColor={t.metal}/><stop offset=".57" stopColor="#584e3b"/><stop offset=".75" stopColor={t.metalHi}/><stop offset="1" stopColor={t.metalLo}/>
        </linearGradient>
        <linearGradient id={ID("rim")} x1="0" y1="0" x2="1" y2=".1">
          <stop offset="0" stopColor={t.metalLo}/><stop offset=".25" stopColor={t.metalHi}/><stop offset=".51" stopColor={t.metalLo}/><stop offset=".8" stopColor={t.metalHi}/><stop offset="1" stopColor={t.metalLo}/>
        </linearGradient>
        <radialGradient id={ID("dial")} cx="35%" cy="20%" r="80%">
          <stop offset="0" stopColor={t.dial}/><stop offset=".58" stopColor={t.dialDeep}/><stop offset="1" stopColor="#030606"/>
        </radialGradient>
        <radialGradient id={ID("glass")} cx="15%" cy="8%" r="100%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".20"/><stop offset=".35" stopColor="#ffffff" stopOpacity=".026"/><stop offset="1" stopColor="#000000" stopOpacity=".26"/>
        </radialGradient>
        <filter id={ID("shadow")} x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="27"/></filter>
        <filter id={ID("smallshadow")} x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="1" dy="8" stdDeviation="8" floodColor="#000" floodOpacity=".8"/></filter>
        <pattern id={ID("stitches")} width="20" height="16" patternUnits="userSpaceOnUse"><path d="M4 0V7" stroke="#8c8b7a" strokeOpacity=".18" strokeWidth="1.5"/></pattern>
      </defs>

      <ellipse cx="349" cy="472" rx="257" ry="318" fill="#000" opacity=".48" filter={`url(#${ID("shadow")})`}/>
      {/* Polished hardware and hand-stitched leather strap */}
      <rect x="251" y="-30" width="198" height="340" rx="27" fill={`url(#${ID("strap")})`}/>
      <rect x="267" y="-28" width="166" height="340" rx="12" stroke="#e1d8bf" strokeOpacity=".17" strokeWidth="2" fill="none" strokeDasharray="4 7"/>
      <rect x="260" y="-20" width="180" height="330" fill={`url(#${ID("stitches")})`} opacity=".5"/>
      <rect x="250" y="585" width="200" height="370" rx="28" fill={`url(#${ID("strap")})`}/>
      <rect x="267" y="587" width="166" height="336" rx="12" stroke="#e1d8bf" strokeOpacity=".16" strokeWidth="2" fill="none" strokeDasharray="4 7"/>
      <path d="M260 275V300M440 275V300M260 592V615M440 592V615" stroke={t.metal} strokeWidth="18" opacity=".9"/>
      <rect x="600" y="399" width="35" height="91" rx="13" fill={`url(#${ID("rim")})`} stroke={t.metalHi} strokeOpacity=".5"/>
      {Array.from({length: 10}, (_,i)=><path key={i} d={`M${607+i*2.2} 406V484`} stroke={t.metalLo} strokeWidth=".85" opacity=".85"/>)}
      <circle cx="350" cy="447" r="259" fill={`url(#${ID("case")})`} filter={`url(#${ID("smallshadow")})`}/>
      <circle cx="350" cy="447" r="253" fill="none" stroke={t.metalHi} strokeOpacity=".42" strokeWidth="3"/>
      <circle cx="350" cy="447" r="242" fill={`url(#${ID("rim")})`} stroke={t.metalLo} strokeWidth="3"/>
      <circle cx="350" cy="447" r="227" fill="#050a08" stroke={t.metalHi} strokeOpacity=".68" strokeWidth="2"/>
      <circle cx="350" cy="447" r="219" fill={`url(#${ID("dial")})`}/>
      <circle cx="350" cy="447" r="211" fill="none" stroke={t.metal} strokeOpacity=".24" strokeWidth="1.1"/>
      <circle cx="350" cy="447" r="198" fill="none" stroke={t.metal} strokeOpacity=".19" strokeWidth="1" strokeDasharray="1.3 3.7"/>
      {/* Minute graduations, larger raised indexes */}
      {Array.from({length:60},(_,i)=>{
        const major=i%5===0;
        return <g key={i} transform={`rotate(${i*6} 350 447)`}>
          <line x1="350" y1={major?"243":"244"} x2="350" y2={major?"262":"251"} stroke={major?t.metalHi:t.metal} strokeWidth={major?"4":"1.25"} strokeLinecap="round" opacity={major?".98":".56"}/>
          {major&&<line x1="349" y1="264" x2="349" y2="274" stroke={t.metalLo} strokeWidth="1" opacity=".6"/>}
        </g>;
      })}
      <text x="350" y="332" fill={t.metalHi} textAnchor="middle" fontSize="26" fontFamily="Georgia, serif" letterSpacing="6">HORÉL</text>
      <path d="M332 343H368" stroke={t.metal} strokeOpacity=".65" strokeWidth="1"/>
      <text x="350" y="367" fill={t.metal} opacity=".65" textAnchor="middle" fontSize="9" fontFamily="Arial, sans-serif" letterSpacing="3.4">ATELIER DU TEMPS</text>
      <text x="350" y="632" fill={t.metal} opacity=".72" textAnchor="middle" fontSize="12" fontFamily="Georgia, serif" letterSpacing="3">AUTOMATIC</text>
      <text x="350" y="651" fill={t.metal} opacity=".54" textAnchor="middle" fontSize="8" fontFamily="Arial, sans-serif" letterSpacing="2.8">ÉDITION 01</text>
      {/* Open-heart movement with two counter-rotating brass gears */}
      <circle cx="350" cy="554" r="52" fill="#020403" stroke={t.metal} strokeWidth="3"/>
      <circle cx="350" cy="554" r="43" fill="#17201c" stroke={t.metalLo} strokeWidth="2.2"/>
      <g transform="translate(350 554)">
        <g className="watch-gear watch-gear-forward">
          {Array.from({length:12},(_,i)=><rect key={i} x="-4" y="-34" width="8" height="14" rx="1" transform={`rotate(${i*30})`} fill={t.metal}/>) }
          <circle r="26" fill="none" stroke={t.metalHi} strokeWidth="7"/>
          <circle r="19" fill="none" stroke={t.metalLo} strokeWidth="2"/>
          {Array.from({length:6},(_,i)=><path key={i} d="M0 -24V-8" transform={`rotate(${i*60})`} stroke={t.metalHi} strokeWidth="3.4" strokeLinecap="round"/>)}
          <circle r="8" fill={t.jewel} stroke={t.metalHi} strokeWidth="2"/>
        </g>
      </g>
      <g transform="translate(318 565) scale(.44)">
        <g className="watch-gear watch-gear-reverse">
          {Array.from({length:10},(_,i)=><rect key={i} x="-5" y="-30" width="10" height="13" rx="1" transform={`rotate(${i*36})`} fill={t.metalHi}/>) }
          <circle r="23" fill="none" stroke={t.metal} strokeWidth="6"/>
          <circle r="6" fill={t.jewel}/>
        </g>
      </g>
      <g transform="translate(377 580) scale(.4)"><g className="watch-gear watch-gear-forward"><circle r="22" stroke={t.metal} fill="none" strokeWidth="7"/><path d="M0-20V20M-20 0H20" stroke={t.metalHi} strokeWidth="3"/><circle r="6" fill={t.jewel}/></g></g>
      {/* Sweeping center hands */}
      <g className="watch-hour-hand"><path d="M350 450L342 451L343 395L350 356L357 395L358 451Z" fill={t.hand} stroke="#2b2720" strokeWidth="1"/></g>
      <g className="watch-minute-hand"><path d="M350 451L346 450L346 318L350 288L354 318L354 450Z" fill={t.metalHi} stroke="#343024" strokeWidth="1.1"/></g>
      <g className="watch-second-hand"><path d="M350 497V275" stroke={t.jewel} strokeWidth="1.75"/><circle cx="350" cy="475" r="7" fill="none" stroke={t.jewel} strokeWidth="1.8"/></g>
      <circle cx="350" cy="447" r="11" fill={t.metalLo} stroke={t.metalHi} strokeWidth="3"/>
      <circle cx="350" cy="447" r="3.5" fill={t.metalHi}/>
      {/* Crystal glow and cinematic highlight */}
      <circle cx="350" cy="447" r="217" fill={`url(#${ID("glass")})`} pointerEvents="none"/>
      <path d="M180 308Q350 158 508 297" fill="none" stroke="#fff7d9" strokeWidth="3.5" opacity=".14" strokeLinecap="round"/>
      <path d="M171 566Q350 737 525 560" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".10"/>
      <circle cx="350" cy="447" r="228" fill="none" stroke="#fff6db" strokeOpacity=".12" strokeWidth="4"/>
    </svg>
  );
}
