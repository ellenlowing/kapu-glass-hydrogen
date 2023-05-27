export default class RoughContainer {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
    }

    setup(el, roughStyle) {
        this.el = el;
        this.bbox = el.getBoundingClientRect();
        this.roughStyle = roughStyle;
    }

    update() {
        this.bbox = this.el.getBoundingClientRect();

    }

    show() {
        this.rc.rectangle(this.bbox.x, this.bbox.y, this.bbox.width, this.bbox.height, this.roughStyle);
    }
}