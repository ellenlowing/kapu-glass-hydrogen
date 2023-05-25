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
            stroke: '#fff',
            fill: '#fff',
        };
        this.roughRippleStyle = {
            strokeWidth: 0,
            roughness: 1.2,
            hachureGap: 1.5,
            stroke: '#00000000',
            // fillWeight: 0.2,
            fillStyle: 'hachure',
            fill: '#fff',
        };
        this.resize();
        this.ripples = [];
    }

    update() {
        if(this.ripples.length > 10) {
            this.ripples.shift();
        }
        for(let i = 0; i < this.ripples.length; i++) {
            let ripple = this.ripples[i];
            if(ripple.r < 200) {
                ripple.r *= 1.44;
            } 
            // else {
            //     this.ripples.s
            // }
        }
    }

    show() {
        // for(let i = 0; i < this.ripples.length; i++) {
        //     let ripple = this.ripples[i];
        //     this.rc.circle(ripple.x, ripple.y, ripple.r, this.roughRippleStyle);
        // }
        for(let i = 0; i < this.points.length; i++) {
            this.rc.circle(this.points[i].x, this.points[i].y, this.points[i].r, this.roughStyle);
        }
        this.rc.line(this.points[5].x + this.points[5].r * 0.1, this.points[5].y - this.points[5].r * 0.5, this.points[6].x - this.points[6].r * 0.1, this.points[6].y + this.points[6].r * 0.5, this.roughStyle);
        this.rc.line(this.points[5].x - this.points[5].r * 0.2, this.points[5].y - this.points[5].r * 0.5, this.points[7].x + this.points[7].r * 0.1, this.points[7].y + this.points[7].r * 0.5, this.roughStyle);
    }

    pressed() {
        let minIndex = -1;
        let minDist = 999999;
        for(let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            let dist = this.p5.sqrt(this.p5.pow(this.p5.mouseX - point.x, 2) + this.p5.pow(this.p5.mouseY - point.y, 2));
            if(dist < point.r && dist < minDist) {
                minDist = dist;
                minIndex = i;
            }
        }
        if(minIndex != -1) {
            this.pointsTapped[minIndex] = true;
            this.ripples.push({x: this.p5.random(0, this.p5.width), y: this.p5.random(0, this.p5.height), r: 20, fromIndex: minIndex});
        }
        console.log(minIndex);
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
        
        for(let i = 0; i < this.points.length; i++) {
            this.pointsTapped.push(false);
        }
    }
}