export default class Slide {
    constructor(data, color, offset, p5) {
        this.p5 = p5;
        this.data = data;
        this.color = color;
        this.offset = offset;
        this.offsetData = []
        this.pt0 = this.p5.createVector(this.data[0]['x2'], this.data[0]['y2'] - 60);
        this.head = this.pt0.sub(this.offset);
        this.r = 20;
        this.active = true;
        this.curvePoints = [];
        this.startScroll = this.p5.createVector(790, 619.5);
        this.endScroll = this.p5.createVector(0, 1258);
        this.accelX = 0.0
        this.accelY = 0.0;
        this.deltaX = 0.0;
        this.deltaY = 0.0;
        this.springing = 0.0009;
        this.damping = 0.98;
        this.organicConstant = 1.0;
        this.centerX = this.p5.width / 2;
        this.centerY = this.p5.height / 2;
    }

    setup() {
        for(let i = 0; i < this.data.length; i++) {
            const offsetData = {};
            for(const pt in this.data[i]) {
                let axis = pt[0];
                if(axis == 'x') {
                    offsetData[pt] = this.data[i][pt] - this.head.x;
                } else {
                    offsetData[pt] = this.data[i][pt] - this.head.y;
                }
            }
            this.offsetData.push(offsetData);
            this.findCurvePoints(offsetData);
        }
    }

    draw() {
        // this.moveShape();
        this.p5.fill(this.color);
        this.curvePoints = [];
        for(let i = 0; i < this.offsetData.length; i++) {
            this.findCurvePoints(this.offsetData[i]);
        }
        for(let i = 0; i < this.curvePoints.length; i++) {
            const pt = this.curvePoints[i];
            this.drawGradientStep(pt.x, pt.y, this.r, this.color);
        }
        
    }

    findCurvePoints(data) {
        const steps = 20;
        let prevx = -1;
        let prevy = -1;
        // this.p5.curveTightness(this.organicConstant);
        for(let i = 0; i < steps; i++) {
            let t = i / steps;
            let x = this.p5.curvePoint(data.x1, data.x2, data.x3, data.x4, t);
            let y = this.p5.curvePoint(data.y1, data.y2, data.y3, data.y4, t);
            if( (prevx == -1 && prevy == -1) || this.p5.dist(x, y, prevx, prevy) > this.r*1.2) {
                let tx = this.p5.curveTangent(data.x1, data.x2, data.x3, data.x4, t);
                let ty = this.p5.curveTangent(data.y1, data.y2, data.y3, data.y4, t);
                let a = this.p5.atan2(ty, tx);
                a -= this.p5.PI / 2.0;
                const point = {x: x, y: y, tx: tx, ty: ty, a: a};
                this.curvePoints.push(point);
                prevx = x;
                prevy = y;
            }
        }
    }

    moveShape() {
        //move center point
        this.deltaX = this.p5.mouseX - this.centerX;
        this.deltaY = this.p5.mouseY - this.centerY;
      
        // create springing effect
        this.deltaX *= this.springing;
        this.deltaY *= this.springing;
        this.accelX += this.deltaX;
        this.accelY += this.deltaY;
      
        // move predator's center
        this.centerX += this.accelX;
        this.centerY += this.accelY;
      
        // slow down springing
        this.accelX *= this.damping;
        this.accelY *= this.damping;
      
        // change curve tightness
        this.organicConstant = 1 - ((this.p5.abs(this.accelX) + this.p5.abs(this.accelY)) * 0.1);
      
      }

    toggleActive() {
        this.active = !this.active;
    }

    setActive(active) {
        this.active = active;
    }

    drawGradientStep(x, y, radius, colorA, colorB=this.p5.color(255, 255, 255, 0)) {
        radius *= 1.5;
        for(let r = radius; r > 0; --r) {
            let t = r/radius;
            let gradientStep = this.lerpColor(colorA, colorB, t);
            this.p5.fill(gradientStep);
            this.p5.circle(x, y, r);
        }
    }

    lerpColor(colorA, colorB, t) {
        let r = this.p5.lerp(this.p5.red(colorA), this.p5.red(colorB), t);
        let g = this.p5.lerp(this.p5.green(colorA), this.p5.green(colorB), t);
        let b = this.p5.lerp(this.p5.blue(colorA), this.p5.blue(colorB), t);
        let a = this.p5.lerp(this.p5.alpha(colorA), this.p5.alpha(colorB), t)
        return this.p5.color(r, g, b, a);
    }
    
}