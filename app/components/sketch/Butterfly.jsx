export default class Butterfly {
    constructor(center, dx, p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.shapePoints = [];
        this.points = [];
        this.da = this.p5.PI / 120;
        this.dx = dx;
        this.center = center;
        this.xoff = 0;
        this.yoff = 0;
        this.roughStyle = {
            stroke: '#ff0000',
            strokeWidth: 1,
            roughness: 0.5,
            fill: '#ff0000',
            fillStyle: 'hachure', 
            hachureGap: 2,
            // fillWeight: 0.2,
            simplification: 0.1
        };
        this.heading = 0;
        this.antenna0 = [];
        this.antenna1 = [];
    }

    update(offset, heading) {
        this.points = [];
        this.antenna0 = [];
        this.antenna1 = [];
        this.center = offset;
        this.heading = heading;
        for(let a = 0; a <= this.p5.TWO_PI; a += this.da) {
            let n = this.p5.noise(this.xoff, this.yoff);
            let r = this.p5.sin(2 * a) * this.p5.map(n, 0, 1, 20, 120);
            let x = this.p5.sin(this.yoff * 5) * r * this.p5.cos(a);
            let y = r * this.p5.sin(a);
            let v = this.p5.createVector(x, y);
            v.rotate(heading - this.p5.PI/2);
            v.add(offset);
            if (a < this.p5.PI) {
                this.xoff += this.dx;
            } else {
                this.xoff -= this.dx;
            }
            this.points.push([v.x, v.y]);
        }
        for(let a = -this.p5.PI/2; a <= -this.p5.PI/2+0.27; a += this.da) {
            let n = this.p5.noise(this.xoff, this.yoff);
            let r = this.p5.sin(2 * a) * this.p5.map(n, 0, 1, 120, 200);
            let x = r * this.p5.cos(a);
            let y = r * this.p5.sin(a);
            let v = this.p5.createVector(x, y);
            v.rotate(heading - this.p5.PI/2);
            v.add(offset);
            this.antenna0.push([v.x, v.y]);
            x = -x;
            v = this.p5.createVector(x, y);
            v.rotate(heading - this.p5.PI/2);
            v.add(offset);
            this.antenna1.push([v.x, v.y]);
        }
        this.yoff += 0.05;
    }

    show() {
        this.rc.curve(this.points, this.roughStyle);
        this.rc.curve(this.antenna0, {
            stroke: '#EC1E24',
            strokeWidth: 0.3,
            roughness: 0.5,
            simplification: 0.1
        });
        this.rc.curve(this.antenna1, {
            stroke: '#EC1E24',
            strokeWidth: 0.3,
            roughness: 0.5,
            simplification: 0.1
        });
    }
}