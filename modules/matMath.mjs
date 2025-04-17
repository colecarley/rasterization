export class Vec3 {
    constructor(v) {
        this.vec = v;
    }

    get x() {
        return this.vec[0];
    }

    set x(val) {
        this.vec[0] = val;
    }

    get y() {
        return this.vec[1];
    }

    set y(val) {
        this.vec[1] = val;
    }

    get z() {
        return this.vec[2];
    }

    set z(val) {
        this.vec[2] = val;
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

    set x(val) {
        this.vec[0] = val;
    }

    get y() {
        return this.vec[1];
    }

    set y(val) {
        this.vec[1] = val;
    }

    get z() {
        return this.vec[2];
    }

    set z(val) {
        this.vec[2] = val;
    }

    get w() {
        return this.vec[3];
    }

    set w(val) {
        this.vec[3] = val;
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
        const adj = [];
        adj.push(new Array(3));
        adj.push(new Array(3));
        adj.push(new Array(3));

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

        const inverse = [];
        inverse.push(new Array(3).fill(0));
        inverse.push(new Array(3).fill(0));
        inverse.push(new Array(3).fill(0));

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                inverse[i][j] = adj.matrix[i][j] / det; // Transpose the adjugate and divide by the determinant
            }
        }

        return new Mat3(inverse);
    }


    crossVec(v) {
        const mat = this.matrix;
        const vec = v.vec;

        const result = new Array(3).fill(0);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i] += mat[j][i] * vec[j];
            }
        }

        return new Vec3(result);
    }

    cross(m2) {
        const mat1 = this.matrix;
        const mat2 = m2.matrix;

        const result = [];
        result.push(new Array(3).fill(0));
        result.push(new Array(3).fill(0));
        result.push(new Array(3).fill(0));

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[i][j] += mat1[i][k] * mat2[k][j];
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
        const result = [];
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));

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
        const result = [];
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));

        const angleRad = (fovy * Math.PI) / 180;

        const tanHalfFovy = Math.tan(angleRad / 2);
        result[0][0] = 1 / (aspect * tanHalfFovy);
        result[1][1] = 1 / tanHalfFovy;
        result[2][2] = - (far + near) / (far - near);
        result[2][3] = -1;
        result[3][2] = - (2 * far * near) / (far - near);

        return new Mat4(result);
    }

    crossVec(v) {
        const mat = this.matrix;
        const vec = v.vec;

        const result = new Array(4).fill(0);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i] += mat[j][i] * vec[j];
            }
        }

        return new Vec4(result);
    }

    cross(m2) {
        const mat1 = this.matrix;
        const mat2 = m2.matrix;

        const result = [];
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));
        result.push(new Array(4).fill(0));

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i][j] += mat1[i][k] * mat2[k][j];
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
        return this.cross(transMat.T());
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

        return result.cross(this);
    }

    T() {
        return new Mat4(this.matrix[0].map((_, colIndex) => this.matrix.map(row => row[colIndex])));
    }
};


