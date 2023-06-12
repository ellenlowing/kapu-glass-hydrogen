import { colors, secondaryColors } from "./Utility";

export default class Bubble {
    constructor(p5, rc, center) {
        this.p5 = p5;
        this.rc = rc;
        this.center = center;
        this.roughStyle = {
            stroke: secondaryColors[2],
            strokeWidth: 1,
            roughness: 0,
            disableMultiStroke: true,
            disableMultiStrokeFill: true,
            preserveVertices: true
        };
        this.roughStyle.roughness = this.p5.random(1.2, 4);
        this.vel = this.p5.createVector(this.p5.random(-1, 1), this.p5.random(-1, 1));
        this.vel.mult(this.p5.random(0.5, 5));
        this.acc = this.p5.createVector(0, 0);
        this.d = this.p5.random(10, 100);
        this.lifetime = this.p5.random(100, 200);
        this.speed = this.p5.random(4, 20);
    }

    finished() {
        return this.lifetime < 0;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.center.add(this.vel);
        this.acc.set(0, 0);
        this.lifetime -= this.speed;
    }

    show() {
        this.rc.circle(this.center.x, this.center.y, this.d, this.roughStyle);
    }
}