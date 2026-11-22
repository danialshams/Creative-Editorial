"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createVelvetScene } from "./velvet-simulation";
import "./VelvetCurtainIntro.css";

type CurtainProps = { onComplete?: () => void };

/** An unobtrusive intro; unmounts itself when the curtains are offstage. */
export default function VelvetCurtainIntro({ onComplete }: CurtainProps) {
  const stage = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const host = stage.current;
    const canvas = surface.current;
    if (!host || !canvas) return;
    let alive = true;
    const bodyOverflow = document.body.style.overflow;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const settle = () => {
      if (!alive) return;
      alive = false;
      document.body.style.overflow = bodyOverflow;
      setHidden(true);
      onComplete?.();
    };
    if (reduced) { settle(); return; }

    document.body.style.overflow = "hidden";
    const engine = createVelvetScene(canvas);
    if (!engine.available) host.classList.add("velvet-curtain--fallback");

    const motion = { position: 0 };
    let animation: ReturnType<typeof gsap.to> | null = null;
    let pending = 0;
    // The loader protects the page briefly but never traps users on a slow network.
    const timeout = window.setTimeout(settle, 4850);
    const hero = document.querySelector<HTMLImageElement>(".hero-photo img, #home picture img, #home img");
    const imageReady = () => new Promise<void>((resolve) => {
      if (!hero || (hero.complete && hero.naturalWidth > 0)) return resolve();
      let finished = false;
      const done = () => { if (finished) return; finished = true; hero?.removeEventListener("load", done); hero?.removeEventListener("error", done); resolve(); };
      hero.addEventListener("load", done, { once: true });
      hero.addEventListener("error", done, { once: true });
      window.setTimeout(done, 1400);
    });

    Promise.all([imageReady(), new Promise<void>((resolve) => { pending = window.setTimeout(resolve, 500); })]).then(() => {
      if (!alive) return;
      host.classList.add("velvet-curtain--parting");
      animation = gsap.to(motion, {
        position: 1,
        duration: 2.15,
        ease: "power2.inOut",
        onUpdate: () => engine.setOpening(motion.position),
        onComplete: () => {
          host.classList.add("velvet-curtain--released");
          window.setTimeout(settle, 320);
        },
      });
    });

    return () => {
      alive = false;
      window.clearTimeout(timeout);
      window.clearTimeout(pending);
      animation?.kill();
      engine.dispose();
      document.body.style.overflow = bodyOverflow;
    };
  }, [onComplete]);

  if (hidden) return null;
  return (
    <div className="velvet-curtain" ref={stage} role="status" aria-label="گشایش مجموعه میزونور">
      <div className="velvet-curtain__backdrop" aria-hidden="true" />
      <div className="velvet-curtain__fallback" aria-hidden="true"><span/><span/></div>
      <canvas ref={surface} className="velvet-curtain__canvas" aria-hidden="true" />
      <div className="velvet-curtain__rail" aria-hidden="true" />
      <div className="velvet-curtain__valance" aria-hidden="true" />
      <div className="velvet-curtain__cord velvet-curtain__cord--left" aria-hidden="true" />
      <div className="velvet-curtain__cord velvet-curtain__cord--right" aria-hidden="true" />
      <div className="velvet-curtain__identity">
        <span className="velvet-curtain__ornament" aria-hidden="true">✦</span>
        <span className="velvet-curtain__wordmark">MAISON NOOR</span>
        <span className="velvet-curtain__descriptor">INTERIOR ATELIER</span>
        <span className="velvet-curtain__hairline" aria-hidden="true" />
      </div>
    </div>
  );
}