import {hide, show, colors, secondaryColors, inLine, deviceMultiplier, magazineScrollRanges, waitForElm} from './Utility';
import {isBrowser, isMobile} from 'react-device-detect';

export default class Slide {
    constructor(p5, rc, canvas) {
        this.p5 = p5;
        this.rc = rc;
        this.canvas = canvas;
        this.numProductsDisplayed = 3;
        this.maxNumProductsDisplayed = 3;
        this.roughStyle = {
            stroke: '#4f8fe6',
            strokeWidth: 0.8,
            roughness: 2,
            preserveVertices: true
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
        this.scrollPerPage = {
            "vessels": 0,
            "accessories": 0,
            "magazine": 0,
            "workshops": 0,
            "archive": 0
        };
        this.magazineScrollRanges = magazineScrollRanges;
        this.bubbleTriggers = [false, false, false, false];
    }

    async setup(collectionName) {
        this.slideInitialized = false;
        this.name = collectionName;
        this.freezeScroll = false;
        this.lastTriggerTime = 0;
        this.roughStyle.roughness = 2;

        // test promise.all
        Promise.all([
            waitForElm(`#slide-${collectionName}`),
            waitForElm(`#products-container`),
            waitForElm('#selected-product-info'),
            waitForElm('#selected-product-title'),
            waitForElm('#selected-product-price'),
        ]).then((values) => {
            this.slideInitialized = true;

            // svg stuff
            this.svg = values[0];
            this.path = this.svg.firstChild; // this.svg is null when i go back on page
            this.attrW = Number(this.svg.getAttribute("width"));
            this.attrH = Number(this.svg.getAttribute("height"));
            this.hwRatio = this.attrH / this.attrW;
            this.whRatio = this.attrW / this.attrH;
            if(this.whRatio > 2) {
                this.whRatio = 2;
            }
            show(this.svg);
            this.pathLength = this.path.getTotalLength();
    
            // products container stuff
            this.productsContainer = values[1];
            this.numProducts = Number(this.productsContainer.getAttribute("data-collection-length"));
            if(this.numProducts < this.maxNumProductsDisplayed) {
                this.numProductsDisplayed = this.numProducts;
            } else {
                this.numProductsDisplayed = this.maxNumProductsDisplayed;
            }
            this.pathLengthOffset = this.pathLength / this.numProductsDisplayed;
            this.scrollProgress = this.scrollPerPage[this.name];
            this.totalToMaxNumDisplayRatio = this.numProducts / this.numProductsDisplayed;
            this.leadingProductIndex = 0;
            this.lastProductIndex = (this.leadingProductIndex + this.numProductsDisplayed - 1) % this.numProducts;
            this.resize();

            // selected product info
            this.selectedProductInfo = values[2];
            this.selectedProductTitle = values[3];
            this.selectedProductPrice = values[4];
            hide(this.selectedProductInfo);

            // caterpillar indicator
            this.caterpillarIndicatorHovered = false;
            this.caterpillarIndicatorChanged = false;
            this.gradientCircles = document.getElementsByClassName('gradient-circle');
            this.caterpillarIndices = document.getElementsByClassName('caterpillar-index');
            this.caterpillarIndicator = document.getElementById('caterpillar-indicator');
            this.caterpillarBbox = this.caterpillarIndicator.getBoundingClientRect();

            if(isBrowser) {
                this.caterpillarIndicator.addEventListener('mousemove', (e) => {
                    let caterpillarHoverProgress = this.p5.constrain((e.clientX - this.caterpillarBbox.x) / this.caterpillarBbox.width, 0, 1);
                    this.scrollProgress = caterpillarHoverProgress * this.pathLengthOffset * this.numProducts;
                    console.log(caterpillarHoverProgress);
                })
            }

            // set up individual product 
            this.productsNodeList = [];
            this.productsDisplayCountList = [];
            this.activeIndex = null;
            for(let i = 0; i < this.numProducts; i++) {
                const product = document.getElementById(`product-${i}`);
                product.style.position = 'absolute';
                this.productsNodeList.push(product);
                this.productsDisplayCountList.push(0);

                product.addEventListener('mouseenter', (e) => {
                    this.mouseEnterHandler(e);
                    console.log('mouseenter product')
                })

                product.addEventListener('mouseleave', (e) => {
                    this.mouseLeaveHandler(e);
                    console.log('mouseleave');
                })

                if(isMobile) {
                    product.addEventListener('touchstart', (e) => {
                        if(this.activeIndex == null) {
                            // when product image is not highlighted and clicked
                            e.preventDefault();
                            this.activeIndex = i;
                            this.mouseEnterHandler(e);
                        } else if (i == this.activeIndex) {
                            // when product image is highlighted and clicked again
                            this.activeIndex = null;
                        } else if (i != this.activeIndex) {
                            // when another product image that's not highlighted is clicked
                            e.preventDefault();
                            this.activeIndex = i;
                        }
                    })
                }

                if(i >= this.leadingProductIndex && i < (this.leadingProductIndex + this.numProductsDisplayed)) {
                    show(product);
                    product.classList.add('active');
                    this.setOpacity(this.caterpillarIndices[i], 1);
                } else {
                    hide(product);
                    product.classList.remove('active');
                    this.setOpacity(this.caterpillarIndices[i], 0);
                }
            }
        })

        if(isMobile) {
            const mainContent = document.getElementById('mainContent');
            mainContent.addEventListener('touchstart', (e) => {
                if(this.activeIndex != null && !e.target.classList.contains('product-image')) {
                    this.mouseLeaveHandler();
                }
            })
        }
    }

    update() {

        if(this.slideInitialized) {
            if(this.caterpillarIndicatorHovered) {
                this.scrollProgress += 10;
            }
    
            const scrollThreshold = (this.pathLength * (1 + this.totalToMaxNumDisplayRatio * this.productsDisplayCountList[this.leadingProductIndex]) + this.leadingProductIndex * this.pathLengthOffset);
            const reverseScrollThreshold = this.pathLength * (1 + this.totalToMaxNumDisplayRatio * this.productsDisplayCountList[this.lastProductIndex]) + this.pathLengthOffset * (this.lastProductIndex - this.numProductsDisplayed);
    
            if( this.scrollProgress >= scrollThreshold) {
                hide(this.productsNodeList[this.leadingProductIndex]);
                this.setOpacity(this.caterpillarIndices[this.leadingProductIndex], 0);
                this.productsNodeList[this.leadingProductIndex].classList.remove('active');
                this.productsDisplayCountList[this.leadingProductIndex] += 1;
                this.lastProductIndex = (this.leadingProductIndex + this.numProductsDisplayed) % this.productsNodeList.length;
                show(this.productsNodeList[this.lastProductIndex]);
                this.setOpacity(this.caterpillarIndices[this.lastProductIndex], 1);
                this.productsNodeList[this.lastProductIndex].classList.add('active');
                this.leadingProductIndex = (this.leadingProductIndex + 1) % this.productsNodeList.length;
            } 
            if ( this.scrollProgress < reverseScrollThreshold-1) {
                hide(this.productsNodeList[this.lastProductIndex]);
                this.setOpacity(this.caterpillarIndices[this.lastProductIndex], 0);
                this.productsNodeList[this.lastProductIndex].classList.remove('active');
                this.lastProductIndex = (this.lastProductIndex - 1) % this.productsNodeList.length;
                if(this.lastProductIndex < 0) this.lastProductIndex = this.productsNodeList.length + this.lastProductIndex;
                this.leadingProductIndex = (this.leadingProductIndex - 1) % this.productsNodeList.length < 0 ? this.productsNodeList.length + (this.leadingProductIndex - 1) % this.productsNodeList.length : (this.leadingProductIndex - 1) % this.productsNodeList.length;
                this.productsDisplayCountList[this.leadingProductIndex] -= 1;
                show(this.productsNodeList[this.leadingProductIndex]);
                this.setOpacity(this.caterpillarIndices[this.leadingProductIndex], 1);
                this.productsNodeList[this.leadingProductIndex].classList.add('active');
            }
    
            for(let i = 0; i < this.productsNodeList.length; i++) {
                let offsetScrollProgress = (this.scrollProgress - i * this.pathLengthOffset - this.productsDisplayCountList[i] * this.totalToMaxNumDisplayRatio * this.pathLength);
                let slidePoint = this.path.getPointAtLength(offsetScrollProgress);
                const product = this.productsNodeList[i];
                const productOffset = this.p5.createVector(-product.clientWidth / 2, -product.clientHeight / 8 * 7); // controls anchor of product image
                productOffset.add(this.displayOffset);
                slidePoint = this.mapPoint(slidePoint, productOffset, this.targetWidth, this.targetHeight);
                product.style.top = `${slidePoint.y}px`;
                product.style.left = `${slidePoint.x}px`;
    
                if(product.classList.contains('active')) {
                    let pct = this.p5.sin(offsetScrollProgress / this.pathLength * this.p5.PI);
                    this.gradientCircles[i].style.bottom = `${pct * 24}px`;
                } else {
                    this.gradientCircles[i].style.bottom = `0px`;
                }
    
                if(this.name == 'magazine' ) {
                    for(let j = 0; j < this.magazineScrollRanges.length; j++) {
                        let range = this.magazineScrollRanges[j];
                        if( (Math.abs(offsetScrollProgress - range[0]) < 70 || Math.abs(offsetScrollProgress - range[1]) < 70) && ((Date.now() - this.lastTriggerTime) > 10 && this.lastScrollProgress != this.scrollProgress) ||
                            ( (Math.abs(offsetScrollProgress - range[0]) < 30 || Math.abs(offsetScrollProgress - range[1]) < 30) && ((Date.now() - this.lastTriggerTime) > 70 && this.lastScrollProgress == this.scrollProgress)  ) ) 
                        {
                            const createNewBubble = new CustomEvent("create-bubble", {
                                detail: {bubbleIndex: j},
                                bubbles: true,
                                cancelable: true,
                                composed: false
                            });
                            this.canvas.dispatchEvent(createNewBubble);
                            this.lastTriggerTime = Date.now();
                        }
                    }
                }
                this.lastScrollProgress = this.scrollProgress;
            }

            this.scrollPerPage[this.name] = this.scrollProgress;
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
    }

    setOpacity(el, opacity) {
        el.style.opacity = `${opacity}`;
    }

    setScrollProgress(circle) {
        let classPrefix = 'gradient-circle-';
        let index = Number(circle.id.slice(classPrefix.length));
        // let currProgress = this.scrollProgress % this.pathLength;
        // let finalProgress = index * this.pathLengthOffset;
        // if(currProgress != finalProgress) {
        //     this.interpolateProgressInterval = setInterval(() => {
        //         if(currProgress < finalProgress) {
        //             this.scrollProgress += 10;
        //         }
        //     }, 50)
        // }
        this.scrollProgress = index * this.pathLengthOffset;
    }

    resize() {
        this.points = [];
        let slideSteps = 40;
        if(isBrowser) {
            this.targetHeight = this.p5.height * 0.7;
            this.targetWidth = this.p5.constrain(this.p5.width * 0.7, 0, this.targetHeight * this.whRatio);    
        }
        if(isMobile) {
            this.targetHeight = this.p5.height * 0.75;
            this.targetWidth = this.p5.constrain(this.p5.width * 0.9, 0, this.targetHeight * this.whRatio);    
        }
        this.displayOffset = this.p5.createVector((this.p5.width - this.targetWidth)/2, (this.p5.height - this.targetHeight) / 2 );
        for(let i = 0; i <= slideSteps; i++) {
            let slidePoint = this.path.getPointAtLength(i * this.pathLength / slideSteps);
            slidePoint = this.mapPoint(slidePoint, this.displayOffset, this.targetWidth, this.targetHeight);
            this.points.push([slidePoint.x, slidePoint.y]);
        }
    }

    mapPoint(point, offset = this.p5.createVector(0,0), targetWidth, targetHeight) {
        point.x = point.x / this.attrW * targetWidth + offset.x;
        point.y = point.y / this.attrH * targetHeight + offset.y;
        return point;
    }

    inRange(progress, min, max) {
        return progress >= min && progress <= max;
    }

    mouseEnterHandler(e) {
        this.freezeScroll = true; 
        this.roughStyle.roughness = Math.random() * 5 + 4;

        for(let node of this.productsNodeList) {
            if(node != e.currentTarget && node.classList.contains('active')) {
                hide(node);
            }
        }
        this.selectedProductTitle.innerHTML = e.currentTarget.querySelector('#product-title').innerHTML;
        this.selectedProductPrice.innerHTML = e.currentTarget.querySelector('#product-price').innerHTML;

        if(Number(e.currentTarget.querySelector('#product-price').getAttribute('data-price')) == 0) {
            hide(this.selectedProductPrice);
        } else {
            show(this.selectedProductPrice);
        }

        show(this.selectedProductInfo);
        hide(this.caterpillarIndicator);

        if(this.name == 'accessories') {
            const createNewSpiral = new CustomEvent("create-spiral", {
                bubbles: true,
                cancelable: true,
                composed: false
            });
            this.canvas.dispatchEvent(createNewSpiral);
        }
    }

    mouseLeaveHandler(e) {
        this.freezeScroll = false; 
        this.activeIndex = null;
        this.roughStyle.roughness = 2;
        for(let node of this.productsNodeList) {
            if(node.classList.contains('active')) {
                show(node);
            }
        }
        hide(this.selectedProductInfo);
        show(this.caterpillarIndicator);
    }
}