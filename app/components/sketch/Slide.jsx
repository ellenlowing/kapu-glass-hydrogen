import {hide, show} from './Utility';

export default class Slide {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.maxNumProductsDisplayed = 3;

    }

    setup(collectionName) {
        this.svgSlides = document.getElementsByClassName('svg-slide');
        this.selectedProductInfo = document.getElementById('selected-product-info');
        this.selectedProductTitle = document.getElementById('selected-product-title');
        this.selectedProductPrice = document.getElementById('selected-product-price');
        this.svg = document.getElementById(`slide-${collectionName}`);
        if(!this.svg) {
            this.svg = document.getElementById('slide-vessels');
        }
        this.path = this.svg.firstChild;
        for(let svgSlide of this.svgSlides) {
            if(svgSlide !== this.svg) {
                hide(svgSlide);
            } else {
                show(svgSlide);
            }
        }
        this.attrW = Number(this.svg.getAttribute("width"));
        this.attrH = Number(this.svg.getAttribute("height"));
        this.productsContainer = document.getElementById('products-container');
        this.numProducts = Number(this.productsContainer.getAttribute("data-collection-length"));
        if(this.numProducts < this.maxNumProductsDisplayed) {
            this.maxNumProductsDisplayed = this.numProducts;
        }
        this.pathLength = this.path.getTotalLength();
        this.pathLengthOffset = this.pathLength / this.maxNumProductsDisplayed;
        this.scrollProgress = this.pathLength / this.maxNumProductsDisplayed * (this.maxNumProductsDisplayed - 1) + 10;
        this.totalToMaxNumDisplayRatio = this.numProducts / this.maxNumProductsDisplayed;
        this.leadingProductIndex = 0;
        this.lastProductIndex = (this.leadingProductIndex + this.maxNumProductsDisplayed - 1) % this.numProducts;
        this.productsNodeList = [];
        this.productsDisplayCountList = [];
        for(let i = 0; i < this.numProducts; i++) {
            const product = document.getElementById(`product-${i}`);
            product.style.position = 'absolute';
            this.productsNodeList.push(product);
            this.productsDisplayCountList.push(0);

            product.addEventListener('mouseenter', (e) => {
                // slide.freezeScroll = true; // TODO
                for(let node of this.productsNodeList) {
                    if(node != e.target) {
                        node.classList.add('product-blur');
                    } else {
                        this.selectedProductTitle.innerHTML = e.target.querySelector('#product-title').innerHTML;
                        this.selectedProductPrice.innerHTML = e.target.querySelector('#product-price').innerHTML;

                        if(Number(e.target.querySelector('#product-price').getAttribute('data-price')) == 0) {
                            hide(this.selectedProductPrice);
                        } else {
                            show(this.selectedProductPrice);
                        }
                    }
                }
                show(this.selectedProductInfo);
            })

            product.addEventListener('mouseleave', (e) => {
                // slide.freezeScroll = false; // TODO
                for(let node of this.productsNodeList) {
                    node.classList.remove('product-blur');
                }
                hide(this.selectedProductInfo);
            })

            if(i >= this.leadingProductIndex && i < (this.leadingProductIndex + this.maxNumProductsDisplayed)) {
                show(product);
            } else {
                hide(product);
            }
        }
        this.resize();
    }

    update() {
        for(let i = 0; i < this.productsNodeList.length; i++) {
            let offsetScrollProgress = (this.scrollProgress - i * this.pathLengthOffset - this.productsDisplayCountList[i] * this.totalToMaxNumDisplayRatio * this.pathLength);
            let slidePoint = this.path.getPointAtLength(offsetScrollProgress);
            const product = this.productsNodeList[i];
            const productOffset = this.p5.createVector(-product.clientWidth / 2, -product.clientHeight / 2);
            slidePoint = this.mapPoint(slidePoint, productOffset);
            product.style.top = `${slidePoint.y}px`;
            product.style.left = `${slidePoint.x}px`;
        }

        const scrollThreshold = (this.pathLength * (1 + this.totalToMaxNumDisplayRatio * this.productsDisplayCountList[this.leadingProductIndex]) + this.leadingProductIndex * this.pathLengthOffset);
        const reverseScrollThreshold = this.pathLength * (1 + this.totalToMaxNumDisplayRatio * this.productsDisplayCountList[this.lastProductIndex]) + this.pathLengthOffset * (this.lastProductIndex - this.maxNumProductsDisplayed);

        if( this.scrollProgress >= scrollThreshold) {
            hide(this.productsNodeList[this.leadingProductIndex]);
            this.productsDisplayCountList[this.leadingProductIndex] += 1;
            this.lastProductIndex = (this.leadingProductIndex + this.maxNumProductsDisplayed) % this.productsNodeList.length;
            show(this.productsNodeList[this.lastProductIndex]);
            this.leadingProductIndex = (this.leadingProductIndex + 1) % this.productsNodeList.length;
        } 
        if ( this.scrollProgress < reverseScrollThreshold + 1) {
            hide(this.productsNodeList[this.lastProductIndex]);
            this.lastProductIndex = (this.lastProductIndex - 1) % this.productsNodeList.length;
            if(this.lastProductIndex < 0) this.lastProductIndex = this.productsNodeList.length + this.lastProductIndex;
            this.leadingProductIndex = (this.leadingProductIndex - 1) % this.productsNodeList.length < 0 ? this.productsNodeList.length + (this.leadingProductIndex - 1) % this.productsNodeList.length : (this.leadingProductIndex - 1) % this.productsNodeList.length;
            this.productsDisplayCountList[this.leadingProductIndex] -= 1;
            show(this.productsNodeList[this.leadingProductIndex]);
        }
    }

    show() {
        this.rc.curve(this.points, {
            stroke: '#000000',
            strokeWidth: 1,
            roughness: 2.5,
            strokeLineDash: [15, 15],
            simplification: 0.1
        });
    }

    resize() {
        this.points = [];
        let slideSteps = 40;
        for(let i = 0; i < slideSteps; i++) {
            let slidePoint = this.path.getPointAtLength(i * this.pathLength / slideSteps);
            slidePoint = this.mapPoint(slidePoint);
            this.points.push([slidePoint.x, slidePoint.y]);
        }
    }

    mapPoint(point, offset = this.p5.createVector(0,0)) {
        point.x = point.x / this.attrW * this.svg.clientWidth + offset.x + (this.p5.width - this.svg.clientWidth) / 2;
        point.y = point.y / this.attrH * this.svg.clientHeight + offset.y + (this.p5.height - this.svg.clientHeight) / 2;
        return point;
    }
}