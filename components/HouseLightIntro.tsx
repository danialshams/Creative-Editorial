"use client";

import { useEffect, useState } from "react";

/** The highlight really travels along one SVG roof/wall path, no fake static logo GIF. */
export default function HouseLightIntro({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let already = false;
    try { already = sessionStorage.getItem("khaneh-choob-intro-v1") === "done"; } catch {}
    if (already || reduced) {
      const t = window.setTimeout(onComplete, 80);
      return () => window.clearTimeout(t);
    }
    // Warm the hero photograph while the outline is being drawn.
    const hero = new Image(); hero.src = "/images/hero-scene.webp";
    const exit = window.setTimeout(() => setExiting(true), 3220);
    const done = window.setTimeout(() => {
      try { sessionStorage.setItem("khaneh-choob-intro-v1", "done"); } catch {}
      onComplete();
    }, 3880);
    return () => {window.clearTimeout(exit); window.clearTimeout(done);};
  }, [onComplete]);

  return <div className={`house-intro ${exiting ? "house-intro--exit" : ""}`} role="status" aria-label="خانه چوب در حال آماده شدن است">
    <div className="house-intro__ambient"/>
    <div className="house-intro__stage">
      <svg className="house-intro__graphic" viewBox="0 0 340 255" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id="house-tracer-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
          <linearGradient id="house-copper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#caa27e"/><stop offset=".55" stopColor="#885630"/><stop offset="1" stopColor="#cba986"/></linearGradient>
        </defs>
        <path className="house-intro__trace-shape" id="intro-house-curve" d="M 305 107 L 170 20 L 35 107 L 35 222 Q 35 233 47 233 L 293 233 Q 305 233 305 221 L 305 107" fill="none" stroke="url(#house-copper)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" pathLength="1000"/>
        <path className="house-intro__glowing-stroke" d="M 305 107 L 170 20 L 35 107 L 35 222 Q 35 233 47 233 L 293 233 Q 305 233 305 221 L 305 107" fill="none" stroke="#ffe3b5" strokeWidth="12" filter="url(#house-tracer-glow)" strokeLinecap="round" pathLength="1000"/>
        <path className="house-intro__sharp-stroke" d="M 305 107 L 170 20 L 35 107 L 35 222 Q 35 233 47 233 L 293 233 Q 305 233 305 221 L 305 107" fill="none" stroke="#fff5df" strokeWidth="3.2" strokeLinecap="round" pathLength="1000"/>
        <circle r="7" fill="#fff8e9" className="house-intro__headlight">
          <animateMotion dur="2.65s" begin=".15s" fill="freeze" calcMode="paced"><mpath href="#intro-house-curve"/></animateMotion>
        </circle>
      </svg>
      <span className="house-intro__brand">خانه چوب</span>
      <span className="house-intro__sub">خانه‌ای برای آرامش</span>
    </div>
    <div className="house-intro__bottom"><i/><span>THE ART OF LIVING</span><i/></div>
  </div>;
}
