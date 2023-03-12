export default class Path {
    constructor(p5) {
        this.points = [];
        this.angles = [];
        this.stepSize = 20;
        this.p5 = p5;
    }

    get lastPt() {
        return this.points[this.points.length-1];
    }

    addPoint(x, y) {
        if(this.points.length < 1) {
            this.points.push(this.p5.createVector(x, y));
            return;
        }

        const nextPt = this.p5.createVector(x, y);
        let d = nextPt.dist(this.lastPt);
        while(d > this.stepSize) {
            const nextPtCopy = nextPt.copy();
            const lastPtCopy = this.lastPt.copy();
            const diff = nextPtCopy.sub(this.lastPt);
            diff.normalize();
            diff.mult(this.stepSize);
            this.points.push(lastPtCopy.add(diff));
            this.angles.push(diff.heading());
            d -= this.stepSize;
        }
    }


    
}