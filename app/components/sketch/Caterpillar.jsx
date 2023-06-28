export default class Caterpillar {
    constructor(p5, rc, x, y, index) {
        this.p5 = p5;
        this.rc = rc;
        this.pos = p5.createVector(x, y); // head position of caterpillar
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);
        this.maxSpeed = 4;
        this.maxForce = 0.25;
        this.numCircles = p5.random(10, 30);
        this.size = 20;
        this.c = '#0000ff';
        this.roughStyle = {
            strokeWidth: 1,
            roughness: 0.5,
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
        this.posOffsets = [];
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
        this.xoff -= 0.01;
    }

    show() {
        for(let i = 0; i < this.posOffsets.length; i++) {
            let pos = this.posOffsets[i].copy();
            // pos.y = pos.y + Math.abs(this.p5.sin(i * this.xoff)) * this.size * 0.25; // 1) make it so that there's no negative number, 2) need to transform to direction's normal
            this.rc.circle(pos.x, pos.y, this.size, this.roughStyle);
        }
    }
}