import { randomHex, secondaryColors } from "./Utility";

export default class Spiral {
    constructor(p5, rc, x, y, stepSize, stepCount) {
        this.p5 = p5;
        this.rc = rc;
        this.c = secondaryColors[1];
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 3,
            hachureGap: 2,
            stroke: this.c,
        };
        this.x = x;
        this.y = y;
        this.points = [[x, y]];
        this.stepSize = stepSize;
        this.stepCount = stepCount;
        this.upperbound = 1.8;
        this.lowerbound = 0.2;
        this.angleDiv = this.p5.random(this.lowerbound, this.upperbound);
        this.speed = this.p5.random(0.001, 0.01);
        this.halfspeed = this.speed / 2;
        this.countUp = true;
    }

    setup() {
        this.spiral();
        this.roughStyle.roughness = this.p5.random(1, 10);
    }

    update() {
        if(this.countUp) this.angleDiv += this.speed;
        else this.angleDiv -= this.speed;

        if(this.angleDiv > (this.upperbound + this.halfspeed)) {
            this.countUp = false;
        }
        if(this.angleDiv < (this.lowerbound - this.halfspeed)) {
            this.countUp = true;
        }
        this.spiral();
    }

    show() {
        this.rc.linearPath(this.points, this.roughStyle);
    }

    spiral() {
        this.points = [[this.x, this.y]];
        for(let t = 1; t < this.stepCount; t++) {
            let xt = this.points[t-1][0] + this.p5.cos(this.p5.PI*this.angleDiv * t) * this.stepSize * t;
            let yt = this.points[t-1][1] + this.p5.sin(this.p5.PI*this.angleDiv * t) * this.stepSize * t;
            this.points.push([xt, yt]);
        }
    }
}