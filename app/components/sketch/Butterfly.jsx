import { randomHex, deviceMultiplier } from "./Utility";
import {isMobile} from 'react-device-detect';

export default class Butterfly {
    constructor(center, dx, p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.shapePoints = [];
        this.points = [];
        this.da = this.p5.PI / 120 * deviceMultiplier;
        this.dx = dx;
        this.center = center;
        this.xoff = 0;
        this.yoff = 0;
        this.t = 0;
        this.heading = 0;
        this.antenna0 = [];
        this.antenna1 = [];
        this.rMultiplier = isMobile ? 0.75 : 1;
        this.roughStyle = {
            strokeWidth: 1 * deviceMultiplier,
            roughness: 1,
            fillWeight: 0.5,
            hachureGap: 3,
            disableMultiStroke: true,
            disableMultiStrokeFill: true
        };
        this.roughAntennaStyle = {
            strokeWidth: 0.5,
            roughness: 0.5,
            simplification: 0.1,
            disableMultiStroke: true
        };
        this.colorA = this.p5.color(randomHex());
        this.colorB = this.p5.color(randomHex());
        this.updateColor();
    }

    updateColor() {
        let lerped = this.lerpColor(this.colorA, this.colorB, this.t);
        let lerpedString = lerped.toString();
        this.roughStyle.fill = lerpedString;

        let reversed = this.lerpColor(this.colorB, this.colorA, this.t);
        let reversedString = reversed.toString();
        this.roughStyle.stroke = reversedString;
        this.roughAntennaStyle.stroke = reversedString;
        this.t += (0.001 / deviceMultiplier);
        if(this.t >= 1) {
            this.t = 0;
            this.colorA = this.colorB;
            this.colorB = this.p5.color(randomHex());
        }
        return reversedString;
    }

    update(offset, heading) {
        this.points = [];
        this.antenna0 = [];
        this.antenna1 = [];
        this.center = offset;
        this.heading = heading;
        this.roughStyle.hachureAngle = (heading) / this.p5.PI * 180;
        for(let a = 0; a <= this.p5.TWO_PI; a += this.da) {
            let n = this.p5.noise(this.xoff, this.yoff);
            let r = this.p5.sin(2 * a) * this.p5.map(n, 0, 1, 20, 100) * this.rMultiplier;
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
        this.rc.curve(this.antenna0, this.roughAntennaStyle);
        this.rc.curve(this.antenna1, this.roughAntennaStyle);
        this.rc.curve(this.points, this.roughStyle);

        // debug colors
        // this.rc.rectangle(10, 100, 100, 100, {
        //     strokeWidth: 1,
        //     roughness: 1.3,
        //     fillWeight: 1,
        //     hachureGap: 3,
        //     fill: this.colorA.toString()
        // });
        // this.rc.rectangle(140, 100, 100, 100, {
        //     strokeWidth: 1,
        //     roughness: 1.3,
        //     fillWeight: 1,
        //     hachureGap: 3,
        //     fill: this.colorB.toString()
        // });
    }

    lerpColor(colorA, colorB, t) {
        let r = this.p5.lerp(this.p5.red(colorA), this.p5.red(colorB), t);
        let g = this.p5.lerp(this.p5.green(colorA), this.p5.green(colorB), t);
        let b = this.p5.lerp(this.p5.blue(colorA), this.p5.blue(colorB), t);
        let a = this.p5.lerp(this.p5.alpha(colorA), this.p5.alpha(colorB), t)
        return this.p5.color(r, g, b, a);
    }
}