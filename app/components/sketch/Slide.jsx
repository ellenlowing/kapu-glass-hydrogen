import {hide, show, colors} from './Utility';

export default class Slide {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.numProductsDisplayed = 3;
        this.maxNumProductsDisplayed = 3;
        this.roughStyle = {
            stroke: '#4f8fe6',
            strokeWidth: 1.5,
            roughness: 2,
        };
        this.roughBboxStyle = {
            stroke: '#00000000',
            fill: '#FFF',
            roughness: 3,
            // fillWeight: 1.2,
            fillStyle: 'solid'
        };
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
            this.numProductsDisplayed = this.numProducts;
        } else {
            this.numProductsDisplayed = this.maxNumProductsDisplayed;
        }
        this.pathLength = this.path.getTotalLength();
        this.pathLengthOffset = this.pathLength / this.numProductsDisplayed;
        this.scrollProgress = this.pathLength / this.numProductsDisplayed * (this.numProductsDisplayed - 1) + 10;
        this.totalToMaxNumDisplayRatio = this.numProducts / this.numProductsDisplayed;
        this.leadingProductIndex = 0;
        this.lastProductIndex = (this.leadingProductIndex + this.numProductsDisplayed - 1) % this.numProducts;
        this.productsNodeList = [];
        this.productsDisplayCountList = [];
        this.selectedProductBbox = null;
        for(let i = 0; i < this.numProducts; i++) {
            const product = document.getElementById(`product-${i}`);
            product.style.position = 'absolute';
            this.productsNodeList.push(product);
            this.productsDisplayCountList.push(0);

            product.addEventListener('mouseenter', (e) => {
                this.freezeScroll = true; 

                for(let node of this.productsNodeList) {
                    if(node != e.target && node.classList.contains('active')) {
                        hide(node);
                    }
                }

                this.selectedProductTitle.innerHTML = e.target.querySelector('#product-title').innerHTML;
                this.selectedProductPrice.innerHTML = e.target.querySelector('#product-price').innerHTML;

                if(Number(e.target.querySelector('#product-price').getAttribute('data-price')) == 0) {
                    hide(this.selectedProductPrice);
                } else {
                    show(this.selectedProductPrice);
                }

                show(this.selectedProductInfo);

                let productBbox = e.target.getBoundingClientRect();

                console.log(productBbox);

                let infoOffset = {x: 0, y: 0};
                if((productBbox.x + productBbox.width) < this.p5.width / 2) {
                    infoOffset.x = this.p5.random(productBbox.x + productBbox.width, this.p5.width * 0.95 - 160 * 2);
                    console.log('< width')
                } else {
                    infoOffset.x = this.p5.random(160, productBbox.x);
                    console.log('> width');
                }
                if((productBbox.y + productBbox.height) < this.p5.height / 2) {
                    infoOffset.y = this.p5.random(productBbox.y + productBbox.height, this.p5.height - 160);
                } else {
                    infoOffset.y = this.p5.random(160, productBbox.y);
                }

                infoOffset.x -= this.selectedProductInfo.getBoundingClientRect().width/2;
                infoOffset.y -= this.selectedProductInfo.getBoundingClientRect().height/2;

                this.selectedProductInfo.style.top = `${infoOffset.y}px`;
                this.selectedProductInfo.style.left = `${infoOffset.x}px`;
                this.selectedProductBbox = this.selectedProductInfo.getBoundingClientRect();

            })

            product.addEventListener('mouseleave', (e) => {
                this.freezeScroll = false; 
                this.selectedProductBbox = null;
                for(let node of this.productsNodeList) {
                    if(node.classList.contains('active')) {
                        show(node);
                    }
                }
                hide(this.selectedProductInfo);
            })

            if(i >= this.leadingProductIndex && i < (this.leadingProductIndex + this.numProductsDisplayed)) {
                show(product);
                product.classList.add('active');
            } else {
                hide(product);
                product.classList.remove('active');
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
        const reverseScrollThreshold = this.pathLength * (1 + this.totalToMaxNumDisplayRatio * this.productsDisplayCountList[this.lastProductIndex]) + this.pathLengthOffset * (this.lastProductIndex - this.numProductsDisplayed);

        if( this.scrollProgress >= scrollThreshold) {
            hide(this.productsNodeList[this.leadingProductIndex]);
            this.productsNodeList[this.leadingProductIndex].classList.remove('active');
            this.productsDisplayCountList[this.leadingProductIndex] += 1;
            this.lastProductIndex = (this.leadingProductIndex + this.numProductsDisplayed) % this.productsNodeList.length;
            show(this.productsNodeList[this.lastProductIndex]);
            this.productsNodeList[this.lastProductIndex].classList.add('active');
            this.leadingProductIndex = (this.leadingProductIndex + 1) % this.productsNodeList.length;
        } 
        if ( this.scrollProgress < reverseScrollThreshold + 1) {
            hide(this.productsNodeList[this.lastProductIndex]);
            this.productsNodeList[this.lastProductIndex].classList.remove('active');
            this.lastProductIndex = (this.lastProductIndex - 1) % this.productsNodeList.length;
            if(this.lastProductIndex < 0) this.lastProductIndex = this.productsNodeList.length + this.lastProductIndex;
            this.leadingProductIndex = (this.leadingProductIndex - 1) % this.productsNodeList.length < 0 ? this.productsNodeList.length + (this.leadingProductIndex - 1) % this.productsNodeList.length : (this.leadingProductIndex - 1) % this.productsNodeList.length;
            this.productsDisplayCountList[this.leadingProductIndex] -= 1;
            show(this.productsNodeList[this.leadingProductIndex]);
            this.productsNodeList[this.leadingProductIndex].classList.add('active');
        }
    }

    show(color) {
        if(color) {
            this.roughStyle.stroke = color;
            this.roughBboxStyle.stroke = color;
        }
        this.rc.curve(this.points, this.roughStyle);
        if(this.selectedProductBbox) {
            let w = this.selectedProductBbox.width * 1.2;
            let h = this.selectedProductBbox.height * 2;
            let x = this.selectedProductBbox.x + this.selectedProductBbox.width/2;
            let y = this.selectedProductBbox.y + this.selectedProductBbox.height/2;
            this.rc.ellipse(x, y, w, h, this.roughBboxStyle);
        }
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
        point.x = point.x / this.attrW * this.svg.clientWidth + offset.x + 80;
        point.y = point.y / this.attrH * this.svg.clientHeight + offset.y + (this.p5.height - this.svg.clientHeight) / 2;
        return point;
    }
}