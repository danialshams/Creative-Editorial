/**
 * MAISON NOOR — independent lightweight 3D cloth model.
 * Physical concepts (Verlet integration, distance constraints, UV shading) are
 * general techniques; this implementation contains no Animorio source code.
 * The source sample was used as a visual/functionality reference only.
 */
export type VelvetScene = {
  setOpening(amount: number): void;
  dispose(): void;
  readonly available: boolean;
};

const X = 30;
const Y = 31;
const SIDE_COUNT = X * Y;
const CELL = 3;
const LOOP = 1 / 60;
const DIM = SIDE_COUNT * CELL;

const VERTEX = `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 texcoord;
uniform vec2 screen;
varying vec3 surfN;
varying vec2 tex;
void main() {
  surfN = normal;
  tex = texcoord;
  vec2 clip = vec2(position.x / screen.x * 2.0 - 1.0, 1.0 - position.y / screen.y * 2.0);
  gl_Position = vec4(clip, clamp(-position.z / 1800.0, -0.95, 0.95), 1.0);
}
`;

const PIXEL = `
precision mediump float;
varying vec3 surfN;
varying vec2 tex;
uniform vec3 clothColor;
uniform vec3 foldColor;
uniform vec3 glowColor;
uniform vec3 trimColor;
float noise(vec2 v) {
  return fract(sin(dot(v, vec2(17.371, 131.27))) * 35214.129);
}
void main() {
  vec3 N = normalize(surfN);
  if (N.z < 0.0) N = -N;
  vec3 light = normalize(vec3(-0.47, 0.62, 0.74));
  float lit = max(0.0, dot(light, N));
  float sheen = pow(1.0 - abs(N.z), 1.5) * (0.48 + 0.52 * lit);
  float spec = pow(max(dot(N, normalize(light + vec3(0.0,0.0,1.0))), 0.0), 24.0);
  float longitudinal = sin(tex.x * 0.38 + tex.y * 0.018) * 0.03;
  vec3 pigment = mix(foldColor, clothColor, 0.23 + lit * 0.81);
  pigment += glowColor * (sheen * 0.62 + spec * 0.12);
  pigment *= 0.92 + noise(gl_FragCoord.xy) * 0.075 + longitudinal;
  float braid = smoothstep(0.960, 0.968, tex.y);
  float strand = 0.78 + 0.22 * cos(tex.x * 118.0 + sin(tex.y * 190.0));
  vec3 borderColor = trimColor * (0.45 + 0.65 * lit) * strand;
  pigment = mix(pigment, borderColor, braid);
  float ragged = tex.y > 0.99 ? step(0.18, noise(vec2(floor(tex.x * 170.0), 8.0))) : 1.0;
  gl_FragColor = vec4(pigment, ragged);
}
`;

type Cloth = {
  side: -1 | 1;
  current: Float32Array;
  previous: Float32Array;
  normals: Float32Array;
  uv: Float32Array;
  vertex: WebGLBuffer;
  normalBuffer: WebGLBuffer;
  uvBuffer: WebGLBuffer;
  element: WebGLBuffer;
};

type Edge = [number, number, number, number];

const limit = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const point = (row: number, col: number) => (row * X + col) * CELL;

function shader(gl: WebGLRenderingContext, kind: number, source: string): WebGLShader {
  const value = gl.createShader(kind);
  if (!value) throw new Error('WebGL shader unavailable');
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(value);
    gl.deleteShader(value);
    throw new Error(`WebGL compilation: ${error}`);
  }
  return value;
}

function buffer(gl: WebGLRenderingContext): WebGLBuffer {
  const item = gl.createBuffer();
  if (!item) throw new Error('WebGL buffer unavailable');
  return item;
}

function buildIndices(): Uint16Array {
  const faces = new Uint16Array((X - 1) * (Y - 1) * 6);
  let w = 0;
  for (let y = 0; y < Y - 1; y++) {
    for (let x = 0; x < X - 1; x++) {
      const a = y * X + x;
      const b = a + X;
      faces[w++] = a; faces[w++] = b; faces[w++] = a + 1;
      faces[w++] = a + 1; faces[w++] = b; faces[w++] = b + 1;
    }
  }
  return faces;
}

export function createVelvetScene(canvas: HTMLCanvasElement): VelvetScene {
  let gl: WebGLRenderingContext | null = null;
  let animation = 0;
  let opening = 0;
  let target = 0;
  let width = 0;
  let height = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let remainder = 0;
  let discarded = false;
  const pointer = { x: -5000, y: -5000, dx: 0, dy: 0, on: false };
  const pointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const bounds = canvas.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    pointer.dx = pointer.on ? limit(x - pointer.x, -30, 30) : 0;
    pointer.dy = pointer.on ? limit(y - pointer.y, -30, 30) : 0;
    pointer.x = x; pointer.y = y;
    pointer.on = true;
  };
  const pointerExit = () => { pointer.on = false; pointer.dx = pointer.dy = 0; };
  canvas.parentElement?.addEventListener("pointermove", pointerMove);
  canvas.parentElement?.addEventListener("pointerleave", pointerExit);
  let program: WebGLProgram | null = null;
  let vertices: Cloth[] = [];
  const breaks: Edge[] = [];
  const faces = buildIndices();
  const folds = Float32Array.from({ length: X }, (_, n) => {
    const t = n * Math.PI * 2 / 5.6;
    return Math.sin(t) * (0.82 + 0.18 * Math.cos(n * 1.77));
  });

  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }); }
  catch { gl = null; }
  if (!gl) return { available: false, setOpening() {}, dispose() {} };
  const ctx = gl;

  try {
    const vs = shader(ctx, ctx.VERTEX_SHADER, VERTEX);
    const fs = shader(ctx, ctx.FRAGMENT_SHADER, PIXEL);
    program = ctx.createProgram();
    if (!program) throw new Error('WebGL program unavailable');
    ctx.attachShader(program, vs);
    ctx.attachShader(program, fs);
    ctx.linkProgram(program);
    ctx.deleteShader(vs); ctx.deleteShader(fs);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) throw new Error('WebGL link error');
    ctx.useProgram(program);
  } catch {
    if (program) ctx.deleteProgram(program);
    return { available: false, setOpening() {}, dispose() {} };
  }

  const positionLoc = ctx.getAttribLocation(program, 'position');
  const normalLoc = ctx.getAttribLocation(program, 'normal');
  const uvLoc = ctx.getAttribLocation(program, 'texcoord');
  const screenLoc = ctx.getUniformLocation(program, 'screen');
  const colors: Array<[string, number[]]> = [
    ['clothColor', [0.158, 0.125, 0.107]],
    ['foldColor', [0.035, 0.033, 0.031]],
    ['glowColor', [0.24, 0.185, 0.132]],
    ['trimColor', [0.68, 0.53, 0.32]],
  ];
  colors.forEach(([name, color]) => ctx.uniform3fv(ctx.getUniformLocation(program, name), new Float32Array(color)));
  ctx.disable(ctx.CULL_FACE);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.enable(ctx.BLEND);
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
  ctx.clearColor(0, 0, 0, 0);

  function makeCloth(side: -1 | 1): Cloth {
    const current = new Float32Array(DIM);
    const previous = new Float32Array(DIM);
    const normals = new Float32Array(DIM);
    const uv = new Float32Array(SIDE_COUNT * 2);
    const part: Cloth = {
      side, current, previous, normals, uv,
      vertex: buffer(ctx), normalBuffer: buffer(ctx), uvBuffer: buffer(ctx), element: buffer(ctx),
    };
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, part.element);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, faces, ctx.STATIC_DRAW);
    return part;
  }

  vertices = [makeCloth(-1), makeCloth(1)];

  function measure() {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    const dpr = limit(window.devicePixelRatio || 1, 1, 1.8);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.viewport(0, 0, canvas.width, canvas.height);
    breaks.length = 0;
    const colLength = width * 0.52 / (X - 1);
    const rowLength = height * 0.975 / (Y - 1);

    for (let y = 0; y < Y; y++) {
      for (let x = 0; x < X; x++) {
        const a = point(y, x) / 3;
        if (y < Y - 1) breaks.push([a, a + X, rowLength, 1]);
        if (x < X - 1) breaks.push([a, a + 1, colLength * 1.42, 0.82]);
        if (y < Y - 1 && x < X - 1) breaks.push([a, a + X + 1, Math.hypot(rowLength, colLength * 1.42), 0.22]);
      }
    }

    for (const part of vertices) {
      const sign = part.side === -1 ? 1 : -1;
      const start = part.side === -1 ? 0 : width;
      for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
        const i = point(y, x);
        const k = (y * X + x) * 2;
        const t = x / (X - 1);
        const s = y / (Y - 1);
        const wave = 0.72 + 0.28 * Math.cos(s * Math.PI * 0.5);
        part.current[i] = start + sign * t * width * 0.515;
        part.current[i + 1] = s * height * 0.99 - 3;
        part.current[i + 2] = folds[x] * colLength * 2.5 * wave + Math.sin(s * 9 + x * 0.43) * 2;
        part.uv[k] = t;
        part.uv[k + 1] = s;
      }
      part.previous.set(part.current);
      ctx.bindBuffer(ctx.ARRAY_BUFFER, part.uvBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, part.uv, ctx.STATIC_DRAW);
    }
    // Give fabric a brief gravitational settling pass before it is first shown.
    for (let i = 0; i < 20; i++) physics(LOOP, false);
  }

  function physics(dt: number, breeze = true) {
    elapsed += dt;
    const gather = ease(limit(opening / 0.93, 0, 1));
    const tie = ease(limit((opening - 0.17) / 0.82, 0, 1));
    const colLength = width * 0.52 / (X - 1);
    const foldHeight = colLength * 2.5;

    for (const piece of vertices) {
      const { current: a, previous: b } = piece;
      const sign = piece.side === -1 ? 1 : -1;
      const wall = piece.side === -1 ? 0 : width;
      const spread = width * 0.515 * (1 - gather * 0.80);
      const freeEdge = piece.side === -1 ? width * 0.105 : width * 0.895;

      for (let y = 1; y < Y; y++) for (let x = 0; x < X; x++) {
        const p = point(y, x);
        const ox = a[p], oy = a[p + 1], oz = a[p + 2];
        const inertia = 0.984;
        const low = y / (Y - 1);
        const drift = breeze ? Math.sin(elapsed * 1.46 + low * 5 + x * 0.13) * 0.018 * low : 0;
        const distance = pointer.on ? Math.hypot(ox - pointer.x, oy - pointer.y) : 99999;
        const influence = pointer.on && distance < width * 0.18
          ? (1 - distance / (width * 0.18)) ** 2 * low
          : 0;
        a[p] += (ox - b[p]) * inertia + drift
          + influence * (pointer.dx * 0.016 + Math.sin(elapsed * 6 + y * 0.36) * 0.18);
        a[p + 1] += (oy - b[p + 1]) * inertia + 1400 * dt * dt;
        a[p + 2] += (oz - b[p + 2]) * inertia
          + (breeze ? Math.sin(elapsed * 1.1 + x * 0.27) * 0.024 * low : 0)
          + influence * (0.18 + Math.abs(pointer.dx) * 0.008);
        b[p] = ox; b[p + 1] = oy; b[p + 2] = oz;
      }

      const clampRail = () => {
        for (let x = 0; x < X; x++) {
          const n = x * 3;
          const t = x / (X - 1);
          const sx = wall + sign * t * spread;
          const sz = folds[x] * foldHeight * (0.9 + gather * 1.5);
          a[n] = b[n] = sx;
          a[n + 1] = b[n + 1] = -4;
          a[n + 2] = b[n + 2] = sz;
        }
      };
      clampRail();

      for (let pass = 0; pass < 5; pass++) {
        for (const [u, v, length, stiffness] of breaks) {
          const i = u * 3, j = v * 3;
          let dx = a[j] - a[i];
          let dy = a[j + 1] - a[i + 1];
          let dz = a[j + 2] - a[i + 2];
          const dist = Math.hypot(dx, dy, dz) || 1;
          const tension = (dist - length) / dist * stiffness;
          // Resist pulling, yield when compressed so folds can collapse naturally.
          const factor = tension < 0 ? 0.05 : 0.8;
          dx *= tension * factor; dy *= tension * factor; dz *= tension * factor;
          if (u >= X) {
            a[i] += dx * 0.5; a[i + 1] += dy * 0.5; a[i + 2] += dz * 0.5;
          }
          a[j] -= dx * (u >= X ? 0.5 : 1);
          a[j + 1] -= dy * (u >= X ? 0.5 : 1);
          a[j + 2] -= dz * (u >= X ? 0.5 : 1);
        }
        if (tie > 0) {
          // A velvet tie gathers the middle of the fabric but lets the hem hang.
          const y = Math.floor(Y * 0.54);
          const knotX = wall + sign * width * 0.095;
          const knotY = height * 0.53;
          for (let x = 0; x < X; x++) {
            const p = point(y, x);
            const crease = (x / (X - 1) - 0.5) * width * 0.025;
            const drive = 0.065 * tie;
            a[p] += (knotX + crease * sign - a[p]) * drive;
            a[p + 1] += (knotY + Math.abs(crease) * 0.6 - a[p + 1]) * drive;
          }
        }
        // Bottom hem rests on the floor instead of escaping below the viewport.
        for (let x = 0; x < X; x++) {
          const p = point(Y - 1, x);
          if (a[p + 1] > height - 2) {
            a[p + 1] = height - 2;
            b[p + 1] = a[p + 1];
          }
        }
        clampRail();
      }
      // Keep the free inner edge from floating across the entire set.
      for (let y = 1; y < Y; y++) {
        const p = point(y, X - 1);
        if (gather > 0.97) {
          a[p] += (freeEdge - a[p]) * 0.03 * (1 - y / Y);
        }
      }
    }
  }

  function normals(piece: Cloth) {
    const { current: a, normals: n } = piece;
    for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
      const i = point(y, x);
      const l = point(y, Math.max(0, x - 1));
      const r = point(y, Math.min(X - 1, x + 1));
      const t = point(Math.max(0, y - 1), x);
      const b = point(Math.min(Y - 1, y + 1), x);
      const ux = a[r] - a[l], uy = a[r + 1] - a[l + 1], uz = a[r + 2] - a[l + 2];
      const vx = a[b] - a[t], vy = a[b + 1] - a[t + 1], vz = a[b + 2] - a[t + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const d = Math.hypot(nx, ny, nz) || 1;
      const sign = piece.side === -1 ? 1 : -1;
      n[i] = nx / d * sign; n[i + 1] = ny / d * sign; n[i + 2] = nz / d * sign;
    }
  }

  function draw() {
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
    ctx.uniform2f(screenLoc, width, height);
    for (const part of vertices) {
      normals(part);
      const streams: Array<[WebGLBuffer, Float32Array, number, number]> = [
        [part.vertex, part.current, positionLoc, 3],
        [part.normalBuffer, part.normals, normalLoc, 3],
        [part.uvBuffer, part.uv, uvLoc, 2],
      ];
      for (const [buf, arr, loc, size] of streams) {
        if (loc < 0) continue;
        ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
        if (buf !== part.uvBuffer) ctx.bufferData(ctx.ARRAY_BUFFER, arr, ctx.DYNAMIC_DRAW);
        ctx.enableVertexAttribArray(loc);
        ctx.vertexAttribPointer(loc, size, ctx.FLOAT, false, 0, 0);
      }
      ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, part.element);
      ctx.drawElements(ctx.TRIANGLES, faces.length, ctx.UNSIGNED_SHORT, 0);
    }
  }

  const onResize = () => {
    if (!discarded) { measure(); draw(); }
  };
  measure();
  draw();
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
  observer?.observe(canvas);

  function frame(now: number) {
    if (discarded) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.04) : LOOP;
    lastFrame = now;
    remainder += dt;
    let loops = 0;
    while (remainder >= LOOP && loops < 3) {
      opening += (target - opening) * Math.min(1, LOOP * 14);
      physics(LOOP);
      remainder -= LOOP;
      loops++;
    }
    if (loops === 3) remainder = 0;
    draw();
    animation = requestAnimationFrame(frame);
  }
  animation = requestAnimationFrame(frame);

  return {
    available: true,
    setOpening(amount: number) { target = limit(amount, 0, 1); },
    dispose() {
      discarded = true;
      cancelAnimationFrame(animation);
      observer?.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", pointerMove);
      canvas.parentElement?.removeEventListener("pointerleave", pointerExit);
      for (const part of vertices) {
        ctx.deleteBuffer(part.vertex);
        ctx.deleteBuffer(part.normalBuffer);
        ctx.deleteBuffer(part.uvBuffer);
        ctx.deleteBuffer(part.element);
      }
      if (program) ctx.deleteProgram(program);
      vertices = [];
    },
  };
}