"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createVelvetScene } from "./velvet-simulation";
import "./VelvetCurtainIntro.css";

type CurtainProps = {
  onRevealStart?: () => void;
  onComplete?: () => void;
};

/** Only the physically moving fabric is drawn; the actual homepage remains beneath it. */
export default function VelvetCurtainIntro({ onRevealStart, onComplete }: CurtainProps) {
  const stage = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    const host = stage.current;
    const canvas = surface.current;
    if (!host || !canvas) return;
    let alive = true;
    let waitFrame = 0;
    let timer = 0;
    const priorOverflow = document.body.style.overflow;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const done = () => {
      if (!alive) return;
      alive = false;
      document.body.style.overflow = priorOverflow;
      setHidden(true);
      onComplete?.();
    };
    if (reduced) { done(); return; }

    document.body.style.overflow = "hidden";
    const cloth = createVelvetScene(canvas);
    host.classList.add(cloth.available ? "velvet-curtain--webgl" : "velvet-curtain--fallback");

    // The CSS fallback also travels fully outside both edges without hiding the hero.
    const motion = { value: 0 };
    let tween: gsap.core.Tween | null = null;
    let started = false;
    const begin = () => {
      if (!alive || started) return;
      started = true;
      onRevealStart?.();
      host.classList.add("velvet-curtain--parting");
      tween = gsap.to(motion, {
        value: 1,
        // Slow, continuous silk-like pull without sharp acceleration near the midpoint.
        duration: 4.0,
        ease: "sine.inOut",
        onUpdate: () => cloth.setOpening(motion.value),
        onComplete: () => {
          cloth.setOpening(1);
          if (!cloth.available) { timer = window.setTimeout(done, 190); return; }
          const awaitOffstage = () => {
            if (!alive) return;
            if (cloth.isOffscreen()) { done(); return; }
            waitFrame = requestAnimationFrame(awaitOffstage);
          };
          waitFrame = requestAnimationFrame(awaitOffstage);
        },
      });
    };

    // Wait for hero decode, not merely the start of a network request.
    const hero = document.querySelector<HTMLImageElement>(".hero-photo img");
    const heroReady = new Promise<void>((resolve) => {
      if (!hero) { resolve(); return; }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        hero.removeEventListener("load", finish);
        hero.removeEventListener("error", finish);
        resolve();
      };
      if (hero.complete && hero.naturalWidth > 0) {
        if (typeof hero.decode === "function") hero.decode().catch(() => undefined).finally(finish);
        else finish();
      } else {
        hero.addEventListener("load", finish, { once: true });
        hero.addEventListener("error", finish, { once: true });
      }
      window.setTimeout(finish, 4000);
    });
    Promise.all([heroReady, new Promise<void>(resolve => window.setTimeout(resolve, 420))]).then(begin);

    // Failsafe for an unresponsive GPU. Ordinary exits never fade or replace the curtain.
    const safety = window.setTimeout(() => {
      if (!alive) return;
      if (!started) begin();
      if (cloth.available && !cloth.isOffscreen()) host.classList.add("velvet-curtain--emergency");
      window.setTimeout(done, 1050);
    }, 16000);

    return () => {
      alive = false;
      window.clearTimeout(safety);
      window.clearTimeout(timer);
      cancelAnimationFrame(waitFrame);
      tween?.kill();
      cloth.dispose();
      document.body.style.overflow = priorOverflow;
    };
  }, [onRevealStart, onComplete]);

  if (hidden) return null;
  return (
    <div className="velvet-curtain" ref={stage} aria-hidden="true">
      <div className="velvet-curtain__fallback"><span /><span /></div>
      <canvas ref={surface} className="velvet-curtain__canvas" />
    </div>
  );
}
