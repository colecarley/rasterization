export class Vec3 {
    constructor(v) {
        this.vec = v;
    }

    get x() {
        return this.vec[0];
    }

    get y() {
        return this.vec[1];
    }

    get z() {
        return this.vec[2];
    }

    dot(v2) {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z;
    }

    cross(v2) {
        return new Vec3([
            this.y * v2.z - this.z * v2.y,
            -(this.x * v2.z - this.z * v2.x),
            this.x * v2.y - this.y * v2.x
        ]);
    }

    normalize() {
        const magnitude = Math.sqrt(this.vec.reduce(((acc, curr) => acc + Math.pow(curr, 2)), 0));
        return new Vec3(this.vec.map(x => x / magnitude));
    }

    minus(v2) {
        return new Vec3([this.x - v2.x, this.y - v2.y, this.z - v2.z]);
    }
};

export class Vec4 {
    constructor(v) {
        this.vec = v;
    }

    get x() {
        return this.vec[0];
    }

    get y() {
        return this.vec[1];
    }

    get z() {
        return this.vec[2];
    }

    get w() {
        return this.vec[3];
    }

    static from_vec3(vec3, w) {
        return new Vec4([vec3.x, vec3.y, vec3.z, w]);
    }
}

export class Mat3 {
    constructor(m) {
        this.matrix = m;
    }

    adjugate() {
        const adj = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        adj[0][0] = (this.matrix[1][1] * this.matrix[2][2] - this.matrix[1][2] * this.matrix[2][1]);
        adj[0][1] = -(this.matrix[0][1] * this.matrix[2][2] - this.matrix[0][2] * this.matrix[2][1]);
        adj[0][2] = (this.matrix[0][1] * this.matrix[1][2] - this.matrix[0][2] * this.matrix[1][1]);
        adj[1][0] = -(this.matrix[1][0] * this.matrix[2][2] - this.matrix[1][2] * this.matrix[2][0]);
        adj[1][1] = (this.matrix[0][0] * this.matrix[2][2] - this.matrix[0][2] * this.matrix[2][0]);
        adj[1][2] = -(this.matrix[0][0] * this.matrix[1][2] - this.matrix[0][2] * this.matrix[1][0]);
        adj[2][0] = (this.matrix[1][0] * this.matrix[2][1] - this.matrix[1][1] * this.matrix[2][0]);
        adj[2][1] = -(this.matrix[0][0] * this.matrix[2][1] - this.matrix[0][1] * this.matrix[2][0]);
        adj[2][2] = (this.matrix[0][0] * this.matrix[1][1] - this.matrix[0][1] * this.matrix[1][0]);

        return new Mat3(adj);
    }

    determinant() {
        return this.matrix[0][0] * (this.matrix[1][1] * this.matrix[2][2] - this.matrix[1][2] * this.matrix[2][1]) -
            this.matrix[0][1] * (this.matrix[1][0] * this.matrix[2][2] - this.matrix[1][2] * this.matrix[2][0]) +
            this.matrix[0][2] * (this.matrix[1][0] * this.matrix[2][1] - this.matrix[1][1] * this.matrix[2][0]);
    }

    invert() {
        const det = this.determinant();
        if (det == 0) {
            return 0; // Matrix is singular, cannot be inverted
        }

        const adj = this.adjugate();
        const inverse = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                inverse[i][j] = adj.matrix[i][j] / det; // Transpose the adjugate and divide by the determinant
            }
        }

        return new Mat3(inverse);
    }


    mulVec(v) {
        const result = [0, 0, 0];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i] += this.matrix[j][i] * v.vec[j];
            }
        }

        return new Vec3(result);
    }

    mul(m2) {
        const result = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[i][j] += this.matrix[i][k] * m2.matrix[k][j];
                }
            }
        }

        return new Mat3(result);
    }

};

export class Mat4 {
    constructor(m) {
        this.matrix = m;
    }

    static lookAt(eye, center, up) {
        const result = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        const f = (center.minus(eye)).normalize();
        let u = up.normalize();
        const s = f.cross(u).normalize();
        u = s.cross(f);

        result[0][0] = s.x;
        result[1][0] = s.y;
        result[2][0] = s.z;
        result[0][1] = u.x;
        result[1][1] = u.y;
        result[2][1] = u.z;
        result[0][2] = -f.x;
        result[1][2] = -f.y;
        result[2][2] = -f.z;
        result[3][0] = -s.dot(eye);
        result[3][1] = -u.dot(eye);
        result[3][2] = f.dot(eye);

        return new Mat4(result);
    }

    static perspective(fovy, aspect, near, far) {
        const result = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        const angleRad = (fovy * Math.PI) / 180;

        const tanHalfFovy = Math.tan(angleRad / 2);
        result[0][0] = 1 / (aspect * tanHalfFovy);
        result[1][1] = 1 / tanHalfFovy;
        result[2][2] = - (far + near) / (far - near);
        result[2][3] = -1;
        result[3][2] = - (2 * far * near) / (far - near);

        return new Mat4(result);
    }

    mulVec(v) {
        const result = [0, 0, 0, 0];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i] += this.matrix[j][i] * v.vec[j];
            }
        }

        return new Vec4(result);
    }

    mul(m2) {
        const result = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i][j] += this.matrix[i][k] * m2.matrix[k][j];
                }
            }
        }

        return new Mat4(result);
    }

    translate(v) {
        const transMat = new Mat4([
            [1, 0, 0, v.x],
            [0, 1, 0, v.y],
            [0, 0, 1, v.z],
            [0, 0, 0, 1]]);

        return this.mul(transMat.T());
    }

    rotate(angle, vaxis) {
        const angleRad = (angle * Math.PI) / 180;
        const result = new Mat4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);

        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        if (vaxis.x > 0 || vaxis.x < 0) {
            result.matrix[1][1] = cos;
            result.matrix[1][2] = -sin;
            result.matrix[2][1] = sin;
            result.matrix[2][2] = cos;
        }

        if (vaxis.y > 0 || vaxis < 0) {
            result.matrix[0][0] = cos;
            result.matrix[0][2] = -sin;
            result.matrix[2][0] = sin;
            result.matrix[2][2] = cos;
        }

        if (vaxis.z > 0 || vaxis.z < 0) {
            result.matrix[0][0] = cos;
            result.matrix[0][1] = -sin;
            result.matrix[1][0] = sin;
            result.matrix[1][1] = cos;
        }

        return result.mul(this);
    }

    T() {
        return new Mat4(this.matrix[0].map((_, colIndex) => this.matrix.map(row => row[colIndex])));
    }
};


