    // Basic vector library

// My kind of documentation:

// nothing

// possible split between 2D and 3D vector behind the scenes for performance but who cares
// ops like add affect the z-coord even when intended for 2D which is annoying
// it also throws off mag()!
// we'll disable not z, but single-value shortcuts for now

// multidimensional update: rework functions to take up to 4 args in lieu of constructing a vector first, and allow more args than that via extension
// vectors can have as many dimensions as you want, all methods extrapolated to work for > 4 args


// Now works in 4 dimensions! Includes some color utilities.

class Vector {
    constructor(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;

        this.dimension = (x != undefined) + (y != undefined) + (z != undefined) + (w != undefined);    // + arguments.length - 4 for further dimensions | temporary till proper dimension support is added (not a unique key for every dimension)
    }

    get r() {
        return this.x;
    }

    get g() {
        return this.y;
    }

    get b() {
        return this.z;
    }

    get a() {
        return this.w;
    }

    set r(v) {
        this.x = v;
    }

    set g(v) {
        this.y = v;
    }

    set b(v) {
        this.z = v;
    }

    set a(v) {
        this.w = v;
    }


    toString() {
        return vecString(this);
    }

    copy() {
        return vcopy(this);
    }

    set(x, y, z, w) {
        if (x.constructor == Vector) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
            return this;
        }

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
        return this;
    }

    norm() {
        return this.div(this.mag());
    }

    mag() {
        return vmag(this);
    }

    setmag(l) {
        return this.mult(l / this.mag());
    }

    heading() {
        return vheading(this);
    }

    setheading(r) {
        return vecFrom(this.mag(), r);
    }

        // points in v
    align(v) {
        return vecFrom(this.mag(), v.heading());
    }

    rotate(r) {
        let c = Math.cos(r);
        let s = Math.sin(r);
        return this.set(c * this.x - s * this.y, s * this.x + c * this.y);
    }

    rotate3D(r, p, y) {
        let c1 = Math.cos(r);
        let s1 = Math.sin(r);
        let c2 = Math.cos(p);
        let s2 = Math.sin(p);
        let c3 = Math.cos(y);
        let s3 = Math.sin(y);
        return this.set(c1 * this.x - s1 * this.z, c2 * this.y - s2 * (s1 * this.x + c1 * this.z), s2 * this.y + c2 * s1 * this.x + c1 * this.z);
    }

    add(v) {
        if (v.constructor == Vector) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += v.w;
            return this;
        }
        // this.x += v;
        // this.y += v;
        // this.z += v;
        return this;
    }

    sub(v) {
        if (v.constructor == Vector) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            this.w -= v.w;
            return this;
        }
        // this.x -= v;
        // this.y -= v;
        // this.z -= v;
        return this;
    }

    mult(v) {
        if (v.constructor == Vector) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            this.w *= v.w;
            return this;
        }
        this.x *= v;
        this.y *= v;
        this.z *= v;
        this.w *= v;
        return this;
    }

    div(v) {
        if (v.constructor == Vector) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
            this.w /= v.w;
            return this;
        }
        v = 1 / v;
        this.x *= v;
        this.y *= v;
        this.z *= v;
        this.w *= v;
        return this;
    }

    dot(v) {
        return vdot(this, v);
    }

    cross(v) {
        return vcross(this, v);
    }
        // returns only the z-component
    cross2(v) {
        return vcross2(this, v);
    }
}

function vec(x, y, z, w) {
    return new Vector(x, y, z, w);
}

function vecNorm(r) {
    return new Vector(Math.cos(r), Math.sin(r));
}

function vecFrom(m, d) {
    return vmult(vecNorm(d), m);
}

function vecString(u) {
    switch (u.dimension) {
        case 3:
            return `<${u.x}, ${u.y}, ${u.z}>`;
        case 4:
            return `<${u.x}, ${u.y}, ${u.z}, ${u.w}>`;
        default:
            return `<${u.x}, ${u.y}>`;
    }
}

function vcopy(u) {
    return new Vector(u.x, u.y, u.z, u.w);
}

function vnorm(u) {
    return vdiv(u, vmag(u));
}

function vmag(u) {
    return Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z + u.w * u.w);
}

function vsetmag(u, l) {
    return vmult(u, l / vmag(u));
}

function vheading(u) {
    return Math.atan2(u.y, u.x);
}

function vsetheading(u, r) {
    return vecFrom(vmag(u), r);
}

    // u points in v
function valign(u, v) {
    return vecFrom(vmag(u), vheading(v));
}

function vrotate(u, r) {
    let c = Math.cos(r);
    let s = Math.sin(r);
    return new Vector(c * u.x - s * u.y, s * u.x + c * u.y);
}

function vadd(u, v) {
    if (v.constructor == Vector)   return new Vector(u.x + v.x, u.y + v.y, u.z + v.z, u.w + v.w);
    // return new Vector(u.x + v, u.y + v, 0);
}

function vsub(u, v) {
    if (v.constructor == Vector)   return new Vector(u.x - v.x, u.y - v.y, u.z - v.z, u.w - v.w);
    // return new Vector(u.x - v, u.y - v, 0);
}

function vmult(u, v) {
    if (v.constructor == Vector)   return new Vector(u.x * v.x, u.y * v.y, u.z * v.z, u.w * v.w);
    return new Vector(u.x * v, u.y * v, u.z * v, u.w * v);
}

function vdiv(u, v) {
    if (v.constructor == Vector)   return new Vector(u.x / v.x, u.y / v.y, u.z / v.z, u.w / v.w);
    v = 1 / v;
    return new Vector(u.x * v, u.y * v, u.z * v, u.w * v);
}

function vdot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z + u.w * v.w;
}

function vcross(u, v) {
    return new Vector(u.y * v.z - u.z * v.y, u.z * v.x - u.x * v.z, u.x * v.y - u.y * v.x);
}

    // returns only the z-component
function vcross2(u, v) {
    return u.x * v.y - u.y * v.x;
}

function mod(x, n) {
    return x - n * Math.floor(x / n);
}
