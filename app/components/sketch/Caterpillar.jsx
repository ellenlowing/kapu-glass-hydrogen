import {hide, show, colors} from './Utility';

export default class Caterpillar {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.roughStyle = {
            // stroke: '#ff0000',
            strokeWidth: 1,
            roughness: 2.5,
            // fill: '#ff0000',
            fillStyle: 'hachure', 
            hachureGap: 2,
            // fillWeight: 0.2,
        };
        this.radius = 120;
        this.points = [];
        this.pointsTapped = [];
        for(let i = -2; i < 3; i++) {
            this.points.push({x: this.p5.width / 2, y: this.p5.height / 2 + i * this.radius});
            this.pointsTapped.push(false);
        }
    }

    update() {
        
    }

    show() {
        for(let i = 0; i < this.points.length; i++) {
            this.rc.circle(this.points[i].x, this.points[i].y, this.radius, this.roughStyle);
        }
    }
}