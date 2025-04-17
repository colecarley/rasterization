import { Vec3 } from "./matMath.mjs";

export class Cube {
    constructor() {
        this.vertices = [
            new Vec3([1.0, -1.0, -1.0]),
            new Vec3([1.0, -1.0, 1.0]),
            new Vec3([-1.0, -1.0, 1.0]),
            new Vec3([-1.0, -1.0, -1.0]),
            new Vec3([1.0, 1.0, -1.0]),
            new Vec3([1.0, 1.0, 1.0]),
            new Vec3([-1.0, 1.0, 1.0]),
            new Vec3([-1.0, 1.0, -1.0])
        ]

        this.indices = [1, 3, 0, 7, 5, 4, 4, 1, 0, 5, 2, 1, 2, 7, 3, 0, 7, 4, 1, 2, 3, 7, 6, 5, 4, 5, 1, 5, 6, 2, 2, 6, 7, 0, 3, 7];

        this.colors = [
            new Vec3([0, 0, 1]), new Vec3([0, 1, 0]),
            new Vec3([0, 1, 1]), new Vec3([1, 1, 1]),
            new Vec3([1, 0, 1]), new Vec3([1, 1, 0])];
    }
};

export class Pyramid {
    constructor() {
        this.vertices = [
            new Vec3([1.0, 0.0, -1.0]),
            new Vec3([1.0, 0.0, 1.0]),
            new Vec3([-1.0, 0.0, 1.0]),
            new Vec3([-1.0, 0.0, -1.0]),
            new Vec3([0.0, 2.0, 0.0])
        ];

        this.indices = [0, 1, 2, 2, 3, 0, 0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4];
    }
};

export class Sphere {
    constructor() {
        this.vertices = [];
        const prec = 10;
        for (let i = 0; i <= prec; i++) {
            for (let j = 0; j <= prec; j++) {
                let y = Math.cos(((180 - i * 180 / prec) * Math.PI) / 180);
                let x = -Math.cos(((j * 360 / prec) * Math.PI) / 180) * Math.abs(Math.cos(Math.asin(y)));
                let z = Math.sin(((j * 360 / prec) * Math.PI) / 180) * Math.abs(Math.cos(Math.asin(y)));
                this.vertices.push(new Vec3([x, y, z]));
            }
        }

        this.indices = [];

        for (let i = 0; i < prec; i++) {
            for (let j = 0; j < prec; j++) {
                this.indices.push(i * (prec + 1) + j);
                this.indices.push(i * (prec + 1) + j + 1);
                this.indices.push((i + 1) * (prec + 1) + j);
                this.indices.push(i * (prec + 1) + j + 1);
                this.indices.push((i + 1) * (prec + 1) + j + 1);
                this.indices.push((i + 1) * (prec + 1) + j);
            }
        }

        this.colors = this.vertices;
    }
};
