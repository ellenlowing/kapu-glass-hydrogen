export default class Habitat {
    constructor() {
        this.caterpillars = [];
        this.images = [];
        this.imagesIndex = 0;
        this.pixelDensity = 2;
    }

    setup(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.maskPg = p5.createGraphics(p5.width, p5.height);
        this.resize();
        console.log("setup");
    }

    resize() {
        this.mainImage = this.p5.createImage(this.p5.width, this.p5.height);
        this.imagesIndex = 0;
        for(let img of this.images) {
            this.addImage(img);
        }
        this.maskPg = this.p5.createGraphics(this.p5.width, this.p5.height);
    }

    loadImages() {
        for(let link of this.links) {
            this.p5.loadImage(link, img => {
                this.images.push(img);
                this.addImage(img);
            });
        }
    }

    addImage(img) {
        let tempImage = this.p5.createImage(img.width, img.height);
        tempImage.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        if(this.p5.width > this.p5.height) {
            tempImage.resize(0, this.p5.height / 2 * 0.5 * this.pixelDensity);
        } else {
            tempImage.resize(this.p5.width / 2 * 0.5 * this.pixelDensity, 0);
        }

        let w = tempImage.width;
        let h = tempImage.height;
        let rx = this.p5.width / 2 * 0.8;
        let ry = this.p5.height / 2 * 0.7;
        let x = rx * Math.cos(Math.PI * 2 / (this.imagesCount) * this.imagesIndex) + (this.p5.width - w / this.pixelDensity) / 2;
        let y = ry * Math.sin(Math.PI * 2/ (this.imagesCount) * this.imagesIndex) + (this.p5.height - h / this.pixelDensity) / 2;

        this.mainImage.copy(tempImage, 0, 0, w, h, x, y, w / this.pixelDensity, h / this.pixelDensity);
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
        
        // let randompos = this.p5.createVector(this.p5.random(pos.x - 100, pos.x + 100), this.p5.random(pos.y - 100, pos.y + 100));
        let randompos = this.p5.createVector(this.p5.noise(pos.x * 0.1, this.p5.millis() * 0.01) * 20 - 10 + pos.x, this.p5.noise(pos.y * 0.1, this.p5.millis() * 0.01) * 20 - 10 + pos.y);

        return randompos;
    }

    checkPixelColor(x, y) {
        let c = this.mainImage.get(x, y);
        return this.p5.alpha(c) != 0;
    }
}