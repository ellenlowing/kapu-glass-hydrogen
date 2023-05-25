import {hide, show, colors} from './Utility';

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

        // calculate the radius of orbit (distance from center of star to its own)
        // use circular equation (ellipse equation) to update position 
        // x = rx * sin(angle)
        // y = ry * cos(angle)

        this.rx = this.x - this.p5.width/2;
        this.ry = this.y - this.p5.height/2;
        this.angle = this.p5.atan2(this.ry, this.rx);
    }

    setup() {
        this.points = [];
        this.star(this.x, this.y, this.radius1, this.radius2, this.npoints);
    }

    update() {
        // TODO orbit around
        this.x = this.rx * this.p5.sin(this.angle) + this.p5.width/2;
        this.y = this.ry * this.p5.cos(this.angle) + this.p5.height/2;
        this.angle += 0.05;
        for(let pt of this.points) {
            pt.x += this.x;
            pt.y += this.y;
        }
        this.p5.circle(this.x, this.y, 50);
    }
    
    show() {
        this.rc.polygon(this.points, this.roughStyle);
        this.p5.text(`${this.angle}`, this.x, this.y);
    }
    
    star(x, y, radius1, radius2, npoints) {
        let angle = this.p5.TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        for (let a = 0; a < this.p5.TWO_PI; a += angle) {
            let sx = x + this.p5.cos(a) * radius2;
            let sy = y + this.p5.sin(a) * radius2;
            let pt1 = [sx, sy];
            sx = x + this.p5.cos(a + halfAngle) * radius1;
            sy = y + this.p5.sin(a + halfAngle) * radius1;
            let pt2 = [sx, sy];
            this.points.push(pt1);
            this.points.push(pt2);
        }
    }
  
}