import {hide, show, colors} from './Utility';

export default class Slide {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.numProductsDisplayed = 3;
        this.maxNumProductsDisplayed = 3;
        this.roughStyle = {
            stroke: '#4f8fe6',
            strokeWidth: 0.8,
            roughness: 2,
            // disableMultiStroke: true
        };
        this.roughBboxStyle = {
            stroke: '#00000000',
            fill: '#FFF',
            roughness: 8,
            strokeWidth: 0.8,
            fillStyle: 'solid'
        };
        this.roughBubbleStyle = {
            stroke: '#00000000',
            fill: '#FFF',
            roughness: 4,
            strokeWidth: 0.8,
            fillStyle: 'solid'
        };
    }

    setup(collectionName) {
        this.freezeScroll = false;
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
        // this.selectedProductInfoBbox = null;
        for(let i = 0; i < this.numProducts; i++) {
            const product = document.getElementById(`product-${i}`);
            product.style.position = 'absolute';
            this.productsNodeList.push(product);
            this.productsDisplayCountList.push(0);

            product.addEventListener('mouseenter', (e) => {
                this.freezeScroll = true; 
                this.roughStyle.roughness = Math.random() * 5 + 4;

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

                // let productBbox = e.target.getBoundingClientRect();
                // this.selectedProductBbox = productBbox;
                // let infoOffset = {x: 0, y: 0};
                // if((productBbox.x + productBbox.width) < this.p5.width / 2) {
                //     infoOffset.x = this.p5.random(productBbox.x + productBbox.width + this.selectedProductInfo.getBoundingClientRect().width/2, this.p5.width * 0.95 - 160 * 2);
                // } else {
                //     infoOffset.x = this.p5.random(160, productBbox.x);
                // }
                // if((productBbox.y + productBbox.height) < this.p5.height / 2) {
                //     infoOffset.y = this.p5.random(productBbox.y + productBbox.height + this.selectedProductInfo.getBoundingClientRect().height/2, this.p5.height - 160);
                // } else {
                //     infoOffset.y = this.p5.random(160, productBbox.y);
                // }

                // infoOffset.x -= this.selectedProductInfo.getBoundingClientRect().width/2;
                // infoOffset.y -= this.selectedProductInfo.getBoundingClientRect().height/2;

                // this.selectedProductInfo.style.top = `${infoOffset.y}px`;
                // this.selectedProductInfo.style.left = `${infoOffset.x}px`;
                // this.selectedProductInfoBbox = this.selectedProductInfo.getBoundingClientRect();

                // this.p1 = {x: this.p5.random(0, infoOffset.x), y: this.p5.random(0, infoOffset.y)};
                // this.p4 = {x: this.p5.random(infoOffset.x, this.p5.width), y: this.p5.random(infoOffset.y, this.p5.height)};

                // this.p5.curveTightness(this.p5.map(infoOffset.y, 0, this.p5.height, -2, 2));

                // let curveSteps = 12;
                // this.productToInfoPoints = [];
                // for(let i = 0; i <= curveSteps; i++) {
                //     let t = i / curveSteps;
                //     let x = this.p5.curvePoint(this.p1.x, 
                //                 this.selectedProductInfoBbox.x + this.selectedProductInfoBbox.width/2,
                //                 this.selectedProductBbox.x, 
                //                 this.p4.x, t);
                //     let y = this.p5.curvePoint(this.p1.y, 
                //                 this.selectedProductInfoBbox.y + this.selectedProductInfoBbox.height/2,
                //                 this.selectedProductBbox.y, 
                //                 this.p4.y, t);
                //     this.productToInfoPoints.push({x: x, y: y});
                // }
            })

            product.addEventListener('mouseleave', (e) => {
                this.freezeScroll = false; 
                this.roughStyle.roughness = 2;
                // this.selectedProductInfoBbox = null;
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
            productOffset.add(this.displayOffset);
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
            this.roughBubbleStyle.stroke = color;
            this.p5.stroke(color);
        }
        this.rc.curve(this.points, this.roughStyle);
        // if(this.selectedProductInfoBbox) {
        //     let w = this.selectedProductInfoBbox.width * 1.2;
        //     let h = this.selectedProductInfoBbox.height * 2;
        //     let x = this.selectedProductInfoBbox.x + this.selectedProductInfoBbox.width/2;
        //     let y = this.selectedProductInfoBbox.y + this.selectedProductInfoBbox.height/2;
        //     for(let i = this.productToInfoPoints.length - 1; i >= 0 ; i--) {
        //         let pt = this.productToInfoPoints[i];
        //         let r = this.p5.map(this.productToInfoPoints.length - i, 0, this.productToInfoPoints.length, 4, 30);
        //         this.rc.circle(pt.x, pt.y, r, this.roughBubbleStyle);
        //     }
        //     this.rc.ellipse(x, y, w, h, this.roughBboxStyle);            
        // }
    }

    resize() {
        this.points = [];
        let slideSteps = 40;
        this.displayOffset = this.p5.createVector(this.p5.width/2 - this.svg.clientWidth/2);
        for(let i = 0; i < slideSteps; i++) {
            let slidePoint = this.path.getPointAtLength(i * this.pathLength / slideSteps);
            slidePoint = this.mapPoint(slidePoint, this.displayOffset);
            this.points.push([slidePoint.x, slidePoint.y]);
        }
    }

    mapPoint(point, offset = this.p5.createVector(0,0)) {
        point.x = point.x / this.attrW * this.svg.clientWidth + offset.x;
        point.y = point.y / this.attrH * this.svg.clientHeight + offset.y + (this.p5.height - this.svg.clientHeight) / 2;
        return point;
    }
}