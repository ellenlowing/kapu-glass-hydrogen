import { randomHex } from "./Utility";

export default class Caterpillar {
    constructor(p5, rc, x, y, index) {
        this.p5 = p5;
        this.rc = rc;
        this.pos = p5.createVector(x, y); // head position of caterpillar
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.maxSpeed = this.p5.random(2, 6);
        this.maxForce = this.p5.random(0.1, 0.5);
        this.size = Math.floor(p5.random(10, 30));
        this.numCircles = Math.floor(p5.random(this.p5.map(this.size, 10, 30, 20, 40), 50));
        this.c = randomHex();
        this.roughStyle = {
            strokeWidth: 0.5,
            roughness: 1.2,
            fillStyle: 'solid', 
            fillWidth: 0.5,
            hachureGap: 5,
            stroke: this.c,
            fill: this.c,
            disableMultiStroke: true,
            disableMultiStrokeFill: true
        };
        this.xoff = 0;
        this.index = index;
        this.posOffsets = [this.pos];

        console.log(this.numCircles);
    }

    seek(target) {
        let force = target.copy();
        force.sub(this.pos);
        force.setMag(this.maxSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        // Push position to offsets so that body can take previous position of caterpillar head
        this.posOffsets.push(this.pos.copy());
        if(this.posOffsets.length >= this.numCircles) {
            this.posOffsets.shift();
        }
    }

    edges() {
        for(let offset of this.posOffsets) {
            if(offset.x >= -this.size && offset.x <= (this.p5.width + this.size) && offset.y >= -this.size && offset.y <= (this.p5.height + this.size)) {
                return true;
            } 
        }
        return false;
    }

    show() {
        for(let i = 0; i < this.posOffsets.length; i++) {
            let pos = this.posOffsets[i].copy();
            // pos.y = pos.y + Math.abs(this.p5.sin(i * this.xoff)) * this.size * 0.25; // 1) make it so that there's no negative number, 2) need to transform to direction's normal
            this.rc.circle(pos.x, pos.y, this.size, this.roughStyle);
        }
    }
}