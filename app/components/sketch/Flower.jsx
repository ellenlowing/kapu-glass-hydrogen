export default class Flower {
    constructor(center, roughStyle, p5, rc) {
        this.center = center;
        this.p5 = p5;
        this.rc = rc;
        this.roughStyle = roughStyle;
        this.n = this.p5.floor(this.p5.random(2, 8));
        this.d = this.p5.floor(this.p5.random(1, this.n - 1));
        this.k = this.n/this.d;
        this.points = [];
        for(let a = 0; a < this.p5.TWO_PI * this.d; a += 0.02) {
            let r = 50 * this.p5.cos(this.k * a);
            let x = r * this.p5.cos(a);
            let y = r * this.p5.sin(a);
            this.points.push([x+center.x, y+center.y]);
        }
    }

    show () {
        this.rc.curve(this.points, this.roughStyle);
    }
}