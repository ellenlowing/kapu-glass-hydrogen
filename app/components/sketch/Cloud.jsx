import { roughFillStyles, secondaryColors } from './Utility';

export default class Cloud {
    constructor(p5, rc, center) {
        this.p5 = p5;
        this.rc = rc;
        this.center = center;
        this.roughStyle = {
            stroke: secondaryColors[4],
            strokeWidth: 1,
            fill: secondaryColors[4],
            roughness: 2,
            disableMultiStroke: true,
            disableMultiStrokeFill: true,
        };
        this.roughStyle.roughness = this.p5.random(1, 2.5);
        this.roughStyle.fillStyle = roughFillStyles[Math.floor(Math.random() * roughFillStyles.length)];
    }

    setup() {
        this.cloudPoints = [];
        this.points = [];
        this.noiseMax = 2;
        this.phase = this.p5.random(0, this.p5.TWO_PI);
        this.zoff = this.p5.random(0, 200);
        this.speed = this.p5.random(1, 6);
        this.drad = this.p5.random(5, 20);
        this.rxMax = this.p5.random(80, 400);
        this.ryMax = this.p5.random(this.rxMax/4, this.rxMax/1.5);
        for (let a = 0; a < this.p5.TWO_PI; a += this.p5.radians(this.drad)) {
            let xoff = this.p5.map(this.p5.cos(a + this.phase), -1, 1, 0, this.noiseMax);
            let yoff = this.p5.map(this.p5.sin(a + this.phase), -1, 1, 0, this.noiseMax);
            let rx = this.p5.map(this.p5.noise(xoff, yoff, this.zoff), 0, 1, 20, this.rxMax);
            let ry = this.p5.map(this.p5.noise(xoff, yoff, this.zoff), 0, 1, 10, this.ryMax);
            let x = rx * this.p5.cos(a);
            let y = ry * this.p5.sin(a);
            this.cloudPoints.push([x, y]);
        }        
    }

    update() {
        this.points = [];
        for(let pt of this.cloudPoints) {
            let xx = pt[0] + this.center.x - this.rxMax;
            let yy = pt[1] + this.center.y;
            this.points.push([xx, yy]);
        }
        this.center.x += this.speed;
        this.center.x = this.center.x % (this.p5.width*2);
    }

    show() {
        this.rc.curve(this.points, this.roughStyle);
    }
}