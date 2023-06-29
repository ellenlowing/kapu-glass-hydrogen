export default class Habitat {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.mainImage = p5.createImage(p5.width, p5.height);
        this.maskPg = p5.createGraphics(p5.width, p5.height);
        this.caterpillars = [];
        this.images = [];
        this.imagesIndex = 0;
        // this.imagesCount = 0;
    }

    setup() {

    }

    addImage(img) {
        this.images.push(img);
        if(img.width > img.height) {
            img.resize(this.p5.width / 2 * 0.8 * 0.5, 0);
            console.log(img.width);
        } else {
            img.resize(0, this.p5.height / 2 * 0.5);
            console.log(img.height);
        }

        let w = img.width;
        let h = img.height;
        let rx = this.p5.width / 2 * 0.8;
        let ry = this.p5.height / 2 * 0.7;
        let x = rx * Math.cos(Math.PI * 2 / (this.imagesCount) * this.imagesIndex) + (this.p5.width - w) / 2;
        let y = ry * Math.sin(Math.PI * 2/ (this.imagesCount) * this.imagesIndex) + (this.p5.height - h) / 2;

        this.mainImage.copy(img, 0, 0, w, h, x, y, w, h);
        this.imagesIndex++;
    }

    update() {
        this.maskPg.background(255);
        this.maskPg.fill(0);

        for(let i = this.caterpillars.length-1; i >= 0; i--) {
            let c = this.caterpillars[i];
            if(c.edges()) {
                let target = this.findClosestPixel(c.pos);
                c.seek(target);
                c.update();
                this.maskPg.circle(c.pos.x, c.pos.y, c.size);    
            } else {
                this.caterpillars.splice(i, 1);
                console.log('popping ', i, 'off')
            }
        }
        if(this.caterpillars.length > 0) this.maskPImageWithPG(this.mainImage, this.maskPg);
    }

    show() {
        this.p5.image(this.mainImage, 0, 0);
        for(let c of this.caterpillars) {
            c.show();
        }
    }
    
    maskPImageWithPG(pimg, pg) {
        let maskImage = this.p5.createImage(pg.width, pg.height);
        maskImage.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
        maskImage.loadPixels();
        for(let i = 0; i < maskImage.pixels.length; i += 4) {
            let v = maskImage.pixels[i];
            maskImage.pixels[i] = 0;
            maskImage.pixels[i+1] = 0;
            maskImage.pixels[i+2] = 0;
            maskImage.pixels[i+3] = v;
        }
        maskImage.updatePixels();
        pimg.mask(maskImage);
        return pimg;
    }

    // input: pos (caterpillar head)
    findClosestPixel(pos) {

        for(let d = 0; d < 10; d++) {
            let w = (pos.x - d) ;
            let e = (pos.x + d) ;
            let n = (pos.y - d) ;
            let s = (pos.y + d) ;

            for(let x = pos.x-d; x <= pos.x+d; x++) {
                let isColoredN = this.checkPixelColor(x, n);
                if(isColoredN) {
                    return this.p5.createVector(x, n);
                }

                let isColoredS = this.checkPixelColor(x, s);
                if(isColoredS) {
                    return this.p5.createVector(x, s);
                }
                
            }
            for(let y = pos.y-d; y <= pos.y+d; y++) {
                let isColoredE = this.checkPixelColor(e, y);
                if(isColoredE) {
                    return this.p5.createVector(e, y);
                }

                let isColoredW = this.checkPixelColor(w, y);
                if(isColoredW) {
                    return this.p5.createVector(w, y);
                }
            }
        }
        
        let randompos = this.p5.createVector(this.p5.random(pos.x - 100, pos.x + 100), this.p5.random(pos.y - 100, pos.y + 100));
        return randompos;
    }

    checkPixelColor(x, y) {
        let c = this.mainImage.get(x, y);
        return this.p5.alpha(c) != 0;
    }
}