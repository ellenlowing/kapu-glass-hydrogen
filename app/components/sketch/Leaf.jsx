export default class Leaf {
    constructor(p5, rc, x, y, img) {
        this.p5 = p5;
        this.rc = rc;
        this.pos = p5.createVector(x, y); // head position of caterpillar
        this.pimg = img;
    }

    update() {
    }

    show() {
        this.pimg.resize(200, 0);
        this.p5.image(this.pimg, this.pos.x, this.pos.y);
    }
}