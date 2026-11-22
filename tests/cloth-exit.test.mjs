import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("components/velvet-simulation.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 }
}).outputText;
const moduleShim = { exports: {} };
new Function("module", "exports", compiled)(moduleShim, moduleShim.exports);
const createVelvetScene = moduleShim.exports.createVelvetScene;

function fakeWebGL() {
  const gl = {};
  let next = 0;
  for (const method of [
    "shaderSource", "compileShader", "attachShader", "linkProgram", "deleteShader",
    "useProgram", "uniform3fv", "disable", "enable", "blendFunc", "clearColor",
    "bindBuffer", "bufferData", "viewport", "clear", "uniform2f",
    "enableVertexAttribArray", "vertexAttribPointer", "drawElements",
    "deleteBuffer", "deleteProgram"
  ]) gl[method] = () => {};
  for (const constant of [
    "VERTEX_SHADER", "FRAGMENT_SHADER", "COMPILE_STATUS", "LINK_STATUS",
    "ELEMENT_ARRAY_BUFFER", "ARRAY_BUFFER", "STATIC_DRAW", "DYNAMIC_DRAW",
    "DEPTH_TEST", "BLEND", "SRC_ALPHA", "ONE_MINUS_SRC_ALPHA",
    "COLOR_BUFFER_BIT", "DEPTH_BUFFER_BIT", "FLOAT", "TRIANGLES", "UNSIGNED_SHORT"
  ]) gl[constant] = ++next;
  for (const method of ["createShader", "createProgram", "createBuffer"])
    gl[method] = () => ({});
  gl.getShaderParameter = () => true;
  gl.getProgramParameter = () => true;
  gl.getAttribLocation = () => 0;
  gl.getUniformLocation = () => ({});
  return gl;
}

for (const width of [320, 390, 768, 1440]) {
  test("velvet leaves both viewport edges fully at " + width + "px", () => {
    const callbacks = [];
    const canceled = new Set();
    let id = 0;
    globalThis.window = { devicePixelRatio: 1 };
    globalThis.ResizeObserver = class { observe() {} disconnect() {} };
    globalThis.requestAnimationFrame = callback => { callbacks.push([++id, callback]); return id; };
    globalThis.cancelAnimationFrame = value => canceled.add(value);
    const parent = { addEventListener() {}, removeEventListener() {} };
    const canvas = {
      clientWidth: width, clientHeight: 900, parentElement: parent,
      getContext: () => fakeWebGL()
    };
    const scene = createVelvetScene(canvas);
    assert.equal(scene.available, true);
    assert.equal(scene.isOffscreen(), false, "curtains initially cover the screen");

    let exited = false;
    for (let frame = 0; frame < 360; frame++) {
      const elapsed = frame / 60;
      const position = Math.min(1, Math.max(0, (elapsed - 0.5) / 2.5));
      scene.setOpening(position * position * (3 - 2 * position));
      const current = callbacks.splice(0);
      for (const [key, callback] of current)
        if (!canceled.has(key)) callback(elapsed * 1000);
      if (scene.isOffscreen()) { exited = true; break; }
    }
    assert.equal(exited, true, "no curtain vertex may remain inside the viewport when the loader unmounts");
    scene.dispose();
  });
}
