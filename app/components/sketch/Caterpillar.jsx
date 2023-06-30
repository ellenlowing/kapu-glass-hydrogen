import { randomHex, deviceMultiplier } from "./Utility";

export default class Caterpillar {
    constructor(p5, rc, x, y, index) {
        this.p5 = p5;
        this.rc = rc;
        this.pos = p5.createVector(x, y); // head position of caterpillar
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.maxSpeed = this.p5.random(2, 5);
        this.maxForce = this.p5.random(0.1, 0.5);
        this.size = Math.floor(p5.random(10, 30)) * deviceMultiplier;
        this.numCircles = Math.floor(p5.random(this.p5.map(this.size, 10, 30, 20, 40), 50));
        this.c = randomHex();
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 1.2,
            fillStyle: 'solid', 
            fillWeight: 0.2,
            hachureGap: 5,
            stroke: this.c,
            fill: this.c,
            disableMultiStroke: true,
            disableMultiStrokeFill: true
        };
        this.xoff = 0;
        this.index = index;
        this.posOffsets = [this.pos];
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
            this.rc.circle(pos.x, pos.y, this.size, this.roughStyle);
            if(i == this.posOffsets.length-1) {
                // this.rc.circle(pos.x - 5, pos.y - 5, this.size);
                let head = pos.copy();
                let first = this.posOffsets[i-1].copy();
                head.sub(first);
                let heading = head.heading();
                let leftArcX = pos.x - this.size * 0.6 * this.p5.cos(heading + Math.PI/2);
                let leftArcY = pos.y - this.size * this.p5.sin(heading + Math.PI/2);
                let rightArcX = pos.x + this.size * 0.6 * this.p5.cos(heading + Math.PI/2);
                let rightArcY = pos.y + this.size * this.p5.sin(heading + Math.PI/2);
                this.rc.arc(leftArcX, leftArcY, this.size, this.size * 3, heading, heading + Math.PI/2, false, this.roughStyle);
                this.rc.arc(rightArcX, rightArcY, this.size, this.size * 3, heading - Math.PI/2, heading, false, this.roughStyle);
            }
        }
    }
}