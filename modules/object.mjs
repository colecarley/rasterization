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
    }
};
