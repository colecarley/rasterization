import { Mat3 } from "./modules/matMath.mjs";
import { Vec3 } from "./modules/matMath.mjs";

const sWidth = 400;
const sHeight = 300;

// Transform a given vertex in clip-space [-w,w] to raster-space [0, {w|h}]
function toRaster(v) {
    return new Vec3((sWidth * (v.x + 1.0) / 2), (sHeight * (v.y + 1) / 2), 1.0);
}

let triangle = [new Vec3(-0.5, 0.5, 1), new Vec3(0.5, 0.5, 1), new Vec3(0, -0.5, 1)];
triangle = triangle.map((v) => toRaster(v))

const canvas = document.createElement("canvas");


function render(mat, frameBuffer) {
    const inv = mat.invert();
    const e0 = new Vec3(...(inv.crossVec(new Vec3(1, 0, 0)).matrix.map(x => x[0])));
    const e1 = new Vec3(...(inv.crossVec(new Vec3(0, 1, 0)).matrix.map(x => x[1])));
    const e2 = new Vec3(...(inv.crossVec(new Vec3(0, 0, 1)).matrix.map(x => x[2])));

    for (let i = 0; i < sHeight; i++) {
        for (let j = 0; j < sWidth; j++) {
            let sample = new Vec3(j + 0.5, i + 0.5, 1.0);

            let alpha = e0.dot(sample);
            let beta = e1.dot(sample);
            let gamma = e2.dot(sample);

            if ((alpha >= 0.0) && (beta >= 0.0) && (gamma >= 0.0)) {
                frameBuffer[j + i * sWidth] = new Vec3(Math.floor(alpha * 0xff), Math.floor(beta * 0xff), Math.floor(gamma * 0xff));
            }
        }
    }

}

function outputFrame(frameBuffer, container) {
    canvas.width = sWidth;
    canvas.height = sHeight;
    const ctx = canvas.getContext('2d');
    var data = ctx.createImageData(canvas.width, canvas.height);
    var buf = new Uint32Array(data.data.buffer);

    for (let i = 0; i < frameBuffer.length; i++) {
        if (frameBuffer[i]) {
            buf[i] = frameBuffer[i].x;
            buf[i] |= frameBuffer[i].y << 8;
            buf[i] |= frameBuffer[i].z << 16;
            buf[i] |= 0xff << 24;
        } else {
            buf[i] = 0x00000000;
        }
    }
    ctx.putImageData(data, 0, 0); // x and y are the coordinates
    container.append(canvas);
}

function render_triangle(container, mat) {
    const frameBuffer = new Array(sHeight * sWidth);
    frameBuffer.map((v) => new Vec3(0, 0, 0));
    render(mat, frameBuffer);
    outputFrame(frameBuffer, container);
}

let mat = new Mat3([triangle.map(v => v.x), triangle.map(v => v.y), triangle.map(v => v.z)]);
window.onload = () => {
    const container = document.getElementById("canvas-container");
    render_triangle(container, mat);
};
