import { colors, secondaryColors } from "./Utility";

export default class Flower {
    constructor(center, p5, rc) {
        this.center = center;
        this.p5 = p5;
        this.rc = rc;
        this.roughStyle = {
            stroke: secondaryColors[3],
            strokeWidth: 1,
            disableMultiStroke: true,
            preserveVertices:true
        };
        this.n = this.p5.floor(this.p5.random(2, 8));
        this.d = this.p5.floor(this.p5.random(1, this.n - 1));
        this.k = this.n/this.d;
        this.minR = 4;
        this.maxR = 60;
        this.rx = this.p5.random(this.minR, this.maxR);
        this.ry = this.p5.random(this.minR, this.maxR);
        while(this.rx/this.ry > 5 || this.ry/this.rx > 5) {
            this.rx = this.p5.random(this.minR, this.maxR);
            this.ry = this.p5.random(this.minR, this.maxR);
        }
        this.angleStep = this.p5.random(0.1, 0.5);
        this.roughStyle.roughness = this.p5.map(this.rx, this.minR, this.maxR, 0, 3);
        this.startAngle = this.p5.random(0, this.p5.TWO_PI);
        this.speed = this.p5.random(-0.1, 0.1);
        this.ogW = this.p5.width;
        this.ogH = this.p5.height;
        // this.growRate = 1;
        // this.growSpeed = this.p5.random(0.001, 0.05);
        this.roughStyle.fillWeight = this.p5.random(0.1, 1);
        this.roughStyle.strokeWidth = this.roughStyle.fillWeight;
    }

    setup() {
        this.flowerPoints = [];
        this.points = [];
        for(let a = 0; a <= this.p5.TWO_PI * this.d; a += this.angleStep) {
            let rx = this.rx * this.p5.cos(this.k * a);
            let ry = this.ry * this.p5.cos(this.k * a);
            let x = rx * this.p5.cos(a);
            let y = ry * this.p5.sin(a);
            this.flowerPoints.push([x, y]);
        }
        this.transform();
    }

    update() {
        this.startAngle += this.speed;
        this.transform();
    }

    show() {
        this.rc.curve(this.points, this.roughStyle);
    }

    // rotate around (0,0) and translate to center
    transform() {
        this.points = [];
        for(let point of this.flowerPoints) {
            let x = point[0];
            let y = point[1];
            let xx = x * this.p5.cos(this.startAngle) - y * this.p5.sin(this.startAngle);
            let yy = x * this.p5.sin(this.startAngle) + y * this.p5.cos(this.startAngle);
            // xx *= this.growRate;
            // yy *= this.growRate;
            xx += this.center.x;
            yy += this.center.y;
            this.points.push([xx, yy]);
        }
        // if(this.growRate <= 3) this.growRate += this.growSpeed;
    }
    
    resize() {
        this.center.x = this.center.x / this.ogW * this.p5.width;
        this.center.y = this.center.y / this.ogH * this.p5.height;
        this.ogW = this.p5.width;
        this.ogH = this.p5.height;
    }
}