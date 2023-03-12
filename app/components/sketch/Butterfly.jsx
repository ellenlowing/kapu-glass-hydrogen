export default class Butterfly {
    constructor(center, dx, roughStyle, p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.shapePoints = [];
        this.points = [];
        this.da = this.p5.PI / 120;
        this.dx = dx;
        this.center = center;
        this.xoff = 0;
        this.yoff = 0;
        this.roughStyle = roughStyle;
    }

    update() {
        this.points = [];
        for(let a = 0; a <= this.p5.TWO_PI; a += this.da) {
            let n = this.p5.noise(this.xoff, this.yoff);
            let r = this.p5.sin(2 * a) * this.p5.map(n, 0, 1, 20, 120);
            let x = this.p5.sin(this.yoff * 5) * r * this.p5.cos(a);
            let y = r * this.p5.sin(a);
            if (a < this.p5.PI) {
                this.xoff += this.dx;
            } else {
                this.xoff -= this.dx;
            }
            this.points.push([x + this.center.x, y + this.center.y]);
        }
        this.yoff += 0.05;
    }

    show() {
        this.rc.curve(this.points, this.roughStyle);
    }
}