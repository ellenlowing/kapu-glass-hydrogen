import Bubble from './Bubble';

export default class BubbleEmitter {
    constructor(p5, rc, center) {
        this.p5 = p5;
        this.rc = rc;
        this.center = center;
        this.bubbles = [];
        this.forceMag = 16;
    }

    emit(num) {
        for(let i = 0; i < num; i++) {
            this.bubbles.push(new Bubble(this.p5, this.rc, this.center.copy()));
        }
    }

    update() {
        for(let bubble of this.bubbles) {
            let bubbleForce = this.p5.createVector(this.p5.random(-this.forceMag, this.forceMag), this.p5.random(-this.forceMag, this.forceMag));
            bubble.applyForce(bubbleForce);
            bubble.update();
        }

        for(let i = this.bubbles.length - 1; i >= 0; i--) {
            if(this.bubbles[i].finished()) {
                this.bubbles.splice(i, 1);
            }
        }
    }

    show() {
        for(let bubble of this.bubbles) {
            bubble.show();
        }
    }
}