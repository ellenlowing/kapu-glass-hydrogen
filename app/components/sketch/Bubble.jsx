import { magazineScrollRanges, colors, secondaryColors } from "./Utility";

export default class Bubble {
    constructor(p5, rc, center) {
        this.p5 = p5;
        this.rc = rc;
        this.center = center;
        this.roughStyle = {
            stroke: secondaryColors[2],
            strokeWidth: 1,
            // fill: secondaryColors[2],
            roughness: 0,
            disableMultiStroke: true,
            disableMultiStrokeFill: true,
            preserveVertices: true
        };
        this.roughStyle.roughness = this.p5.random(1.2, 4);
        this.d = p5.random(5, 120);
        this.xoff = p5.random(0, 100);
        this.yoff = p5.random(0, 100);
        this.zoff = 0;
    }

    update() {
        this.center.x += this.p5.map(this.p5.noise(this.center.x, this.yoff, this.zoff), 0, 1, -30, 30);
        this.center.y += this.p5.map(this.p5.noise(this.xoff, this.center.y, this.zoff), 0, 1, -30, 30);
        this.zoff += 0.01;
        // this.xoff += 0.1;
        // this.yoff += 0.2;
    }

    show() {
        this.rc.circle(this.center.x, this.center.y, this.d, this.roughStyle);
    }
}