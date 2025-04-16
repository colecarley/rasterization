export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot(v2) {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z;
    }
};

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
        inverse.push(new Array(3));
        inverse.push(new Array(3));
        inverse.push(new Array(3));

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                inverse[i][j] = adj.matrix[i][j] / det; // Transpose the adjugate and divide by the determinant
            }
        }

        return new Mat3(inverse);
    }


    crossVec(v) {
        const mat = this.matrix;
        const vec = [v.x, v.y, v.z];

        const result = [];
        result.push(new Array(3));
        result.push(new Array(3));
        result.push(new Array(3));

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = mat[j][i] * vec[j];
            }
        }

        return new Mat3(result);
    }

    cross(m2) {
        const mat1 = this.matrix;
        const mat2 = m2.matrix;

        const result = [];
        result.push(new Array(3));
        result.push(new Array(3));
        result.push(new Array(3));

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = mat1[i][j] + mat2[j][i];
            }
        }

        return new Mat3(result);
    }

};
