import { randomHex, secondaryColors } from "./Utility";

export default class FallingStar {
    constructor(p5, rc, x, y, radius1, radius2, npoints) {
        this.p5 = p5;
        this.rc = rc;
        this.x = x;
        this.y = y;
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.npoints = npoints;
        this.c = secondaryColors[0];
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 2,
            fillStyle: 'hachure', 
            hachureGap: 2,
            stroke: this.c,
            fill: this.c,
            disableMultiStroke: true,
            disableMultiStrokeFill: true
        };

        this.rx = this.x - this.p5.width/2;
        this.ry = this.y - this.p5.height/2;
        this.angle = this.p5.atan2(this.ry, this.rx); // angle relative to center of universe
        this.rmag = this.p5.constrain(Math.sqrt(Math.pow(this.rx, 2) + Math.pow(this.ry, 2)), 0, 600);
        this.speed = this.p5.map(this.rmag, 100, 600, 0.005, 0.015) * Math.sign(this.rx);
        this.localRotation = this.p5.random(0, this.p5.TWO_PI); // angle relative to self
        this.angularSpeed = this.p5.random(-0.1, 0.1); // self spinning speed
    }

    setup() {
        this.fixedStarPoints = [];
        this.star(this.radius1, this.radius2, this.npoints);
    }

    update() {
        this.x = this.rx * this.p5.sin(this.angle) + this.p5.width/2;
        this.y = this.ry * this.p5.cos(this.angle) + this.p5.height/2;
        this.angle += this.speed;
        this.localRotation += this.angularSpeed;
        this.points = [];
        for(let point of this.fixedStarPoints) {
            let x = point[0];
            let y = point[1];
            let xx = x * this.p5.cos(this.localRotation) - y * this.p5.sin(this.localRotation);
            let yy = x * this.p5.sin(this.localRotation) + y * this.p5.cos(this.localRotation);
            xx += this.x;
            yy += this.y;
            this.points.push([xx, yy]);
        }
    }
    
    show() {
        this.rc.polygon(this.points, this.roughStyle);
    }
    
    star(radius1, radius2, npoints) {
        let angle = this.p5.TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        for (let a = 0; a < this.p5.TWO_PI; a += angle) {
            let sx = this.p5.cos(a) * radius2;
            let sy = this.p5.sin(a) * radius2;
            let pt1 = [sx, sy];
            sx = this.p5.cos(a + halfAngle) * radius1;
            sy = this.p5.sin(a + halfAngle) * radius1;
            let pt2 = [sx, sy];
            this.fixedStarPoints.push(pt1);
            this.fixedStarPoints.push(pt2);
        }
    }
  
}