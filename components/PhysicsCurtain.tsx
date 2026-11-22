"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = { onFinished: () => void };
type Particle = { x: number; px: number; y: number; py: number };
type Cloth = { side: "left" | "right"; particles: Particle[] };

const STRIPS = 34;
const ROWS = 25;
const clamp = (v: number, low: number, high: number) => Math.min(high, Math.max(low, v));
const rgb = (r: number, g: number, b: number) => "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";

/**
 * A curtain drawn as 2 deformable fabric surfaces, not sliding DOM panels.
 * Each vertical mass point uses damped Verlet integration. Top attachments
 * travel along the rod, the bottom of the fabric follows with spring delay.
 * The folded ribbons are shaded per strip to approximate velvet pleats.
 */
export default function PhysicsCurtain({ onFinished }: Props) {
  const surface = useRef<HTMLCanvasElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const [firstPaint, setFirstPaint] = useState(false);

  useEffect(() => {
    const canvas = surface.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) { onFinished(); return; }
    let active = true;
    let raf = 0;
    let safety = 0;
    let tween: gsap.core.Timeline | null = null;
    let width = Math.max(320, window.innerWidth);
    let height = Math.max(320, window.innerHeight);
    let half = width / 2;
    let previous = performance.now();
    let time = 0;
    let done = false;
    const driver = { progress: 0 };

    function makeCloths(): Cloth[] {
      return (["left", "right"] as const).map(side => ({
        side,
        particles: Array.from({ length: ROWS }, (_, i) => {
          const y = height * i / (ROWS - 1);
          return { x: half + 2, px: half + 2, y, py: y };
        }),
      }));
    }
    let cloths = makeCloths();

    function resize() {
      width = Math.max(320, window.innerWidth);
      height = Math.max(320, window.innerHeight);
      half = width / 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cloths = makeCloths();
    }

    function step(dt: number) {
      const target = half + 2 - driver.progress * (half - 12);
      cloths.forEach(cloth => {
        const nodes = cloth.particles;
        nodes[0].px = nodes[0].x;
        nodes[0].x = target;
        nodes[0].y = 0;
        for (let j = 1; j < ROWS; j++) {
          const point = nodes[j];
          const parent = nodes[j - 1];
          const old = point.x;
          const velocity = (point.x - point.px) * Math.pow(0.86, dt);
          const spring = (parent.x - point.x) * 0.105;
          const draw = (target - point.x) * 0.026;
          point.x = clamp(point.x + velocity * dt + (spring + draw) * dt, 7, half + 30);
          point.px = old;
          const yGoal = height * j / (ROWS - 1);
          const oldY = point.y;
          point.y += (point.y - point.py) * 0.74 * dt
            + (yGoal - point.y) * 0.09 * dt
            + (parent.y + height / (ROWS - 1) - point.y) * 0.042 * dt
            + 0.23 * dt;
          point.py = oldY;
        }
      });
    }

    function edge(cloth: Cloth, band: number, row: number) {
      const u = band / STRIPS;
      const v = row / (ROWS - 1);
      const span = cloth.particles[row].x;
      const folded = 1 - clamp(span / half, 0, 1);
      const pleat = Math.sin(u * 48 + v * 2.1 + time * 0.24)
        * Math.min(11, Math.max(1, span / STRIPS * 0.31))
        * (1 + folded * 0.8) * Math.sin(u * Math.PI);
      const inertia = Math.sin(time * 4.4 + v * 4) * v * v * 6.5
        * driver.progress * (1 - driver.progress) * Math.sin(Math.PI * u);
      const distance = u * span + pleat + inertia;
      return cloth.side === "left" ? distance : width - distance;
    }

    function drawCloth(cloth: Cloth) {
      for (let band = 0; band < STRIPS; band++) {
        const n = Math.pow((Math.cos((band + .5) * 0.88) + 1) * .5, 1.6);
        const top = rgb(34 + 31 * n, 25 + 18 * n, 21 + 14 * n);
        const bottom = rgb(26 + 21 * n, 19 + 11 * n, 17 + 8 * n);
        const x = edge(cloth, band + .5, 0);
        const gradient = ctx!.createLinearGradient(x, 0, x + .001, height);
        gradient.addColorStop(0, top);
        gradient.addColorStop(1, bottom);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        for (let row = 0; row < ROWS; row++) {
          const xx = edge(cloth, band, row), yy = cloth.particles[row].y;
          if (row === 0) ctx!.moveTo(xx, yy - 4);
          else ctx!.lineTo(xx, yy);
        }
        for (let row = ROWS - 1; row >= 0; row--) {
          ctx!.lineTo(edge(cloth, band + 1, row), cloth.particles[row].y + (row === ROWS - 1 ? 24 : 0));
        }
        ctx!.closePath();
        ctx!.fill();
        if (band % 4 === 1) {
          ctx!.strokeStyle = "rgba(222,176,117,.06)";
          ctx!.lineWidth = .9;
          ctx!.beginPath();
          for (let row = 0; row < ROWS; row++) {
            const xx = edge(cloth, band + .5, row), yy = cloth.particles[row].y;
            if (row === 0) ctx!.moveTo(xx, yy);
            else ctx!.lineTo(xx, yy);
          }
          ctx!.stroke();
        }
      }
    }

    function render(now: number) {
      if (!active) return;
      const dt = clamp((now - previous) / 16.67, 0.45, 1.6);
      previous = now;
      time += dt / 60;
      step(dt * .5);
      step(dt * .5);
      ctx!.clearRect(0, 0, width, height);
      drawCloth(cloths[0]);
      drawCloth(cloths[1]);
      ctx!.fillStyle = "rgba(204,167,112,.66)";
      ctx!.fillRect(0, 0, width, 2);
      raf = window.requestAnimationFrame(render);
    }

    function finish() {
      if (done || !active) return;
      done = true;
      onFinished();
    }

    resize();
    render(performance.now());
    setFirstPaint(true);
    window.addEventListener("resize", resize);

    const hero = document.querySelector<HTMLImageElement>(".hero-photo img");
    const ready = hero?.complete
      ? Promise.resolve()
      : hero?.decode?.().catch(() => undefined) ?? Promise.resolve();
    void Promise.race([ready, new Promise<void>(resolve => window.setTimeout(resolve, 1250))])
      .then(() => {
        if (!active) return;
        tween = gsap.timeline({ onComplete: finish });
        tween.to(logo.current, { autoAlpha: 0, y: -19, duration: .45, ease: "power2.out" }, .45)
          .to(driver, { progress: 1, duration: 2.15, ease: "power2.inOut" }, .96)
          .to({}, { duration: .38 });
      });
    safety = window.setTimeout(finish, 6500);

    return () => {
      active = false;
      window.clearTimeout(safety);
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
      tween?.kill();
    };
  }, [onFinished]);

  return (
    <div className={"physics-curtain" + (firstPaint ? " physics-curtain--painted" : "")} role="status" aria-label="ورود به آتلیه میزونور">
      <div className="physics-curtain__fallback" aria-hidden="true" />
      <canvas ref={surface} aria-hidden="true" />
      <div className="physics-curtain__identity" ref={logo} aria-hidden="true">
        <span className="physics-curtain__emblem">M<span>✦</span>N</span>
        <span className="physics-curtain__brand">MAISON NOOR</span>
        <span className="physics-curtain__caption">INTERIOR ATELIER</span>
        <span className="physics-curtain__line"><i /></span>
      </div>
    </div>
  );
}
