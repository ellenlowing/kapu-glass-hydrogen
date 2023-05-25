export default class FallingStar {
    constructor(p5, rc, x, y, radius1, radius2, npoints) {
        this.p5 = p5;
        this.rc = rc;
        this.x = x;
        this.y = y;
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.npoints = npoints;
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 2,
            fillStyle: 'hachure', 
            hachureGap: 2,
            fillWeight: 1,
            // stroke: '#fff',
            fill: '#0000ff',
        };

        this.rx = this.x - this.p5.width/2;
        this.ry = this.y - this.p5.height/2;
        this.angle = this.p5.atan2(this.ry, this.rx);
        this.rmag = this.p5.constrain(Math.sqrt(Math.pow(this.rx, 2) + Math.pow(this.ry, 2)), 0, 600);
        this.speed = this.p5.map(this.rmag, 100, 600, 0, 0.015) * Math.sign(this.rx);
    }

    setup() {
        this.fixedStarPoints = [];
        this.star(this.radius1, this.radius2, this.npoints);
    }

    update() {
        this.x = this.rx * this.p5.sin(this.angle) + this.p5.width/2;
        this.y = this.ry * this.p5.cos(this.angle) + this.p5.height/2;
        this.angle += this.speed;
        this.points = [];
        for(let pt of this.fixedStarPoints) {
            let x = this.x + pt[0];
            let y = this.y + pt[1];
            this.points.push([x, y]);
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