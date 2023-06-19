import { colors, secondaryColors, roughFillStyles } from "./Utility";

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
        this.vel.mult(this.p5.random(10, 20));
        this.acc = this.p5.createVector(0, 0);
        this.d = this.p5.random(10, 100);
        this.lifetime = this.p5.random(100, 300);
        this.speed = this.p5.random(10, 20);        
        this.roughStyle.fillStyle = roughFillStyles[Math.floor(this.p5.random(roughFillStyles.length))];
        this.roughStyle.fillWeight = this.p5.random(0.3, 1);
        this.roughStyle.strokeWidth = this.roughStyle.fillWeight;
        this.roughStyle.hachureGap = this.p5.random(2, 8);
        this.roughStyle.hachureAngle = this.p5.random(-180, 180);

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