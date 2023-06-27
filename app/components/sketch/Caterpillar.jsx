export default class Caterpillar {
    constructor(p5, rc, x, y) {
        this.p5 = p5;
        this.rc = rc;
        this.pos = p5.createVector(x, y); // head position of caterpillar
        this.numCircles = p5.random(5, 10);
        this.size = 40;
        this.c = '#0000ff';
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 3,
            fillStyle: 'hachure', 
            hachureGap: 2,
            stroke: this.c,
            fill: this.c,
            disableMultiStroke: true,
            disableMultiStrokeFill: true
        };
    }

    update() {
        this.pos.x = (this.pos.x + 10) % this.p5.width;
    }

    show() {
        for(let i = 0; i < this.numCircles; i++) {
            this.rc.circle(this.pos.x - this.size / 2 * i, this.pos.y, this.size, this.roughStyle);
        }
    }
}