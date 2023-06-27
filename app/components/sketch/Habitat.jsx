import Caterpillar from "./Caterpillar";

export default class Habitat {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.mainImage = p5.createImage(p5.width, p5.height);
        this.maskPg = p5.createGraphics(p5.width, p5.height);
        this.caterpillars = [];
        this.images = [];
        this.imagesCount = 0;
    }

    setup() {

    }

    addImage(img) {
        this.images.push(img);
        img.resize(this.p5.width * 0.2, 0);

        let x = this.p5.width * 0.4 * (this.imagesCount % 3);
        let y = this.p5.height * 0.3 * Math.floor(this.imagesCount / 3);

        let w = img.width;
        let h = img.height;
        this.mainImage.copy(img, 0, 0, w, h, x, y, w, h);
        this.imagesCount++;
    }

    update() {
        this.maskPg.background(255);
        this.maskPg.fill(0);
        for(let c of this.caterpillars) {
            c.update();
            this.maskPg.circle(c.pos.x, c.pos.y, c.size);
        }
        this.maskPImageWithPG(this.mainImage, this.maskPg);
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
}