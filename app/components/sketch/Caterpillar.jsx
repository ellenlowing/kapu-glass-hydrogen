import {hide, show, colors} from './Utility';

export default class Caterpillar {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 2.5,
            fillStyle: 'hachure', 
            hachureGap: 2,
            // fillWeight: 0.2,
            // stroke: '#ff0000',
            // fill: '#ff0000',
        };
        this.resize();
        for(let i = 0; i < this.points.length; i++) {
            this.pointsTapped.push(false);
        }
    }

    update() {
        
    }

    show() {
        for(let i = 0; i < this.points.length; i++) {
            this.rc.circle(this.points[i].x, this.points[i].y, this.points[i].r, this.roughStyle);
        }
        this.rc.line(this.points[5].x + this.points[5].r * 0.1, this.points[5].y - this.points[5].r * 0.5, this.points[6].x - this.points[6].r * 0.1, this.points[6].y + this.points[6].r * 0.5, this.roughStyle);
        this.rc.line(this.points[5].x - this.points[5].r * 0.2, this.points[5].y - this.points[5].r * 0.5, this.points[7].x + this.points[7].r * 0.1, this.points[7].y + this.points[7].r * 0.5, this.roughStyle);
    }

    pressed() {
        for(let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if(this.p5.sqrt(this.p5.pow(this.p5.mouseX - point.x, 2) + this.p5.pow(this.p5.mouseY - point.y, 2)) < point.r) {
                this.pointsTapped[i] = true;
                console.log(i); // TODO compare circles and get the circle with the shortest distance
            }
        }
    }

    resize() {
        this.radius = this.p5.constrain(this.p5.width > this.p5.height ? this.p5.width * 0.12 : this.p5.height * 0.12, 0, 144);
        this.center = {x: this.p5.width / 2, y: this.p5.height / 2 - this.radius / 2};
        this.points = [];
        this.pointsTapped = [];
        this.points.push({x: this.center.x + 2 * this.radius, y: this.center.y + 2 * this.radius, r: this.radius});
        this.points.push({x: this.center.x + 1.5 * this.radius, y: this.center.y + 1.1 * this.radius, r: this.radius});
        this.points.push({x: this.center.x + 0.55 * this.radius, y: this.center.y + 0.6 * this.radius, r: this.radius});
        this.points.push({x: this.center.x + 0.3 * this.radius, y: this.center.y - 0.4 * this.radius, r: this.radius});
        this.points.push({x: this.center.x - 0.72 * this.radius, y: this.center.y - 0.3 * this.radius, r: this.radius});
        this.points.push({x: this.center.x - 1.72 * this.radius, y: this.center.y - 0.1 * this.radius, r: this.radius});
        this.points.push({x: this.center.x - 1.5 * this.radius, y: this.center.y - 1.5 * this.radius, r: this.radius * 0.4});
        this.points.push({x: this.center.x - 2.2 * this.radius, y: this.center.y - 1.5 * this.radius, r: this.radius * 0.4});

    }
}