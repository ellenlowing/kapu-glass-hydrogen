import {colors, deviceMultiplier} from './Utility';

export default class Sparkle {
    constructor(p5, rc, color, pos) {
        this.p5 = p5;
        this.rc = rc;
        this.pos = pos;
        this.roughStyle = 
            {   
                stroke: color,
                roughness: 2, 
                disableMultiStrokeFill: true, 
                disableMultiStroke: true 
            };
        this.roughStyle.roughness = this.p5.random(0.2, 2);
        this.roughStyle.strokeWidth = this.p5.random(0.01, 0.8);
        this.minSize = 4;
        this.maxSize = 15 * deviceMultiplier;
        this.rx = this.p5.random(this.minSize, this.maxSize);
        this.ry = this.p5.random(this.minSize, this.maxSize);
        this.w = this.rx * 2;
        this.h = this.ry * 2;
    }

    setup() {

    }

    update() {

    }

    show() {
        for(let i = 0; i < 4; i++) {
            let xoff = i % 2 == 0 ? -this.rx : this.rx;
            let yoff = i < 2 ? -this.ry : this.ry;
            let a0, a1;
            switch(i) {
                case 0:
                    a0 = 0;
                    a1 = 0.5;
                    break;
                case 1:
                    a0 = 0.5;
                    a1 = 1;
                    break;
                case 2:
                    a0 = -0.5;
                    a1 = 0;
                    break;
                case 3: 
                    a0 = 1;
                    a1 = 1.5;
                    break;
            }
            this.rc.arc(this.pos.x + xoff, this.pos.y + yoff, this.w, this.h, a0 * Math.PI, a1 * Math.PI, false, this.roughStyle);
        }
    }
}