    // Basic objects library
        // almost primitive-like

// Rect
    // dim
    // pos
    // x
    // y
    // width
    // height
class Rect {
    constructor(width, height) {
        this.pos = vec(0, 0);
        this.dim = vec(width, height);
    }

    get x() {
        return this.pos.x;
    }

    set x(v) {
        this.pos.x = v;
    }

    get y() {
        return this.pos.y;
    }

    set y(v) {
        this.pos.y = v;
    }

    get width() {
        return this.dim.x;
    }

    set width(v) {
        this.dim.x = v;
    }

    get height() {
        return this.dim.y;
    }

    set height(v) {
        this.dim.y = v;
    }
}


function plasmRect(w, h) {
    return new Rect(w, h);
}