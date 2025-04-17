import { Mat3 } from "./modules/matMath.mjs";
import { Mat4 } from "./modules/matMath.mjs";
import { Vec3 } from "./modules/matMath.mjs";
import { Vec4 } from "./modules/matMath.mjs";
import { Cube } from "./modules/object.mjs";

const sWidth = 400;
const sHeight = 300;

// Transform a given vertex in clip-space [-w,w] to raster-space [0, {w|h}]
function toRaster(v) {
    return new Vec4([(sWidth * (v.x + v.w) / 2), (sHeight * (v.w - v.y) / 2), v.z, v.w]);
}


function raster(mat, frameBuffer, depthBuffer) {
    const inv = mat.invert();
    const e0 = inv.crossVec(new Vec3([1, 0, 0]));
    const e1 = inv.crossVec(new Vec3([0, 1, 0]));
    const e2 = inv.crossVec(new Vec3([0, 0, 1]));

    const c = inv.crossVec(new Vec3([1, 1, 1]));

    for (let i = 0; i < sHeight; i++) {
        for (let j = 0; j < sWidth; j++) {
            let sample = new Vec3([j + 0.5, i + 0.5, 1.0]);

            let alpha = e0.dot(sample);
            let beta = e1.dot(sample);
            let gamma = e2.dot(sample);


            if ((alpha >= 0.0) && (beta >= 0.0) && (gamma >= 0.0)) {
                const test = (c.x * sample.x) + (c.y * sample.y) + c.z;

                if (test >= depthBuffer[j + i * sWidth]) {
                    depthBuffer[j + i * sWidth] = test;
                    frameBuffer[j + i * sWidth] = new Vec3([Math.floor(alpha * 0xff), Math.floor(beta * 0xff), Math.floor(gamma * 0xff)]);
                }
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

let view = Mat4.lookAt(new Vec3([0, 3.75, 6.5]), new Vec3([0, 0, 0]), new Vec3([0, 1, 0]));
let proj = Mat4.perspective(60, sWidth / sHeight, 0.1, 100);
const container = document.getElementById("canvas-container");
const canvas = document.createElement("canvas");
document.onkeydown = (e) => {
    if (e.key == "ArrowRight") {
        view = view.rotate(5, new Vec3([0, 1, 0]));
    } else if (e.key == "ArrowLeft") {
        view = view.rotate(-5, new Vec3([0, 1, 0]));
    } else if (e.key == "ArrowUp") {
        view = view.rotate(5, new Vec3([1, 0, 0]));
    } else if (e.key == "ArrowDown") {
        view = view.rotate(-5, new Vec3([1, 0, 0]));
    }
};

function main() {

    const eye4 = new Mat4([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]);

    let objects = [];
    let model0 = eye4.translate(new Vec3([0, 0, 2]));
    model0 = model0.rotate(45, new Vec3([0, 1, 0]))
    objects.push(model0);

    let model1 = eye4.translate(new Vec3([-3.75, 0, 0]));
    objects.push(model1.rotate(30, new Vec3([1, 0, 0])));

    let model2 = eye4.translate(new Vec3([3.75, 0, 0]));
    objects.push(model2.rotate(60, new Vec3([0, 1, 0])));

    let model3 = eye4.translate(new Vec3([0, 0, -2]));
    objects.push(model3.rotate(90, new Vec3([0, 0, 1])));
    const cube = new Cube();

    setInterval(() => {
        const frameBuffer = new Array(sHeight * sWidth);
        frameBuffer.map((v) => new Vec3([0, 0, 0]));
        const depthBuffer = new Array(sHeight * sWidth).fill(0);

        for (const obj of objects) {
            for (let i = 0; i < Math.floor(cube.indices.length / 3); i++) {
                const v0 = cube.vertices[cube.indices[i * 3]];
                const v1 = cube.vertices[cube.indices[i * 3 + 1]];
                const v2 = cube.vertices[cube.indices[i * 3 + 2]];


                const v0clip = proj.crossVec(view.crossVec(obj.crossVec(Vec4.from_vec3(v0, 1))));
                const v1clip = proj.crossVec(view.crossVec(obj.crossVec(Vec4.from_vec3(v1, 1))));
                const v2clip = proj.crossVec(view.crossVec(obj.crossVec(Vec4.from_vec3(v2, 1))));

                const v0Homo = toRaster(v0clip);
                const v1Homo = toRaster(v1clip);
                const v2Homo = toRaster(v2clip);

                const M = new Mat3([
                    [v0Homo.x, v1Homo.x, v2Homo.x],
                    [v0Homo.y, v1Homo.y, v2Homo.y],
                    [v0Homo.w, v1Homo.w, v2Homo.w]
                ]);

                const det = M.determinant();
                if (det >= 0) continue;

                raster(M, frameBuffer, depthBuffer);
            }
        }

        outputFrame(frameBuffer, container);
        objects = objects.map(obj => obj.rotate(5, new Vec3([1, 0, 0])));
    }, 10);
}


window.onload = main;