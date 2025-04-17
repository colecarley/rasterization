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