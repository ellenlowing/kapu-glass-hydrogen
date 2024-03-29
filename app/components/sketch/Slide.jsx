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
            roughness: 1,
            strokeWidth: 1,
            fillStyle: 'solid',
            preserveVertices: true,
            disableMultiStroke: true,
            disableMultiStrokeFill: true
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
        this.caterpillarTouched = false;
        this.firstDrawn = false;
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
            waitForElm('#caterpillar-help-text'),
            waitForElm('#caterpillar-help-svg'),
        ]).then((values) => {
            this.slideInitialized = true;
            this.firstDrawn = false;

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

            if(isBrowser) {
                this.caterpillarIndicator.addEventListener('mousemove', (e) => {
                    this.setScrollProgress(e.clientX);
                })
            } else {
                this.caterpillarIndicator.addEventListener('touchstart', (e) => {
                    this.setScrollProgress(e.pageX);
                })
                this.caterpillarIndicator.addEventListener('touchmove', (e) => {
                    this.setScrollProgress(e.pageX);
                })
            }

            this.caterpillarHelpText = values[5];
            this.caterpillarHelpSvg = values[6];
            this.caterpillarHelpPath = this.caterpillarHelpSvg.firstChild;
            this.caterpillarHelpPathLength = this.caterpillarHelpPath.getTotalLength();
            this.caterpillarHelpAttrW = Number(this.caterpillarHelpSvg.getAttribute("width"));
            this.caterpillarHelpAttrH = Number(this.caterpillarHelpSvg.getAttribute("height"));
            this.resize();
            if(this.caterpillarTouched) {
                this.hideCaterpillarCTA()
                this.setOpacity(this.caterpillarHelpText, 0);
            } else {
                setTimeout(() => {
                    this.hideCaterpillarCTA()
                }, 10000);
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

                if(isBrowser) {
                    product.addEventListener('mouseover', (e) => {
                        if(!this.scrolling) this.mouseEnterHandler(e);
                        console.log('mouseenter product')
                    })
    
                    product.addEventListener('mouseleave', (e) => {
                        this.mouseLeaveHandler(e);
                        e.currentTarget.style.transform = 'scale(1)';
                        console.log('mouseleave');
                    })
                }

                if(isMobile) {
                    product.addEventListener('touchstart', (e) => {
                        // if(!this.scrolling) {
                            console.log('product touchstart')
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
                        // }
                        
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

            console.log('finished init slide');
        })
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
                const product = this.productsNodeList[i];
    
                if(product.classList.contains('active')) {                
                    let slidePoint = this.path.getPointAtLength(offsetScrollProgress);
                    const productOffset = this.p5.createVector(-product.clientWidth / 2, -product.clientHeight / 8 * 7); // controls anchor of product image
                    productOffset.add(this.displayOffset);
                    slidePoint = this.mapPoint(slidePoint, productOffset, this.targetWidth, this.targetHeight, this.attrW, this.attrH);
                    product.style.top = `${slidePoint.y}px`;
                    product.style.left = `${slidePoint.x}px`;
                    let pct = this.p5.sin(offsetScrollProgress / this.pathLength * this.p5.PI);
                    this.gradientCircles[i].style.bottom = `${pct * 24 * deviceMultiplier}px`;
                } else {
                    this.gradientCircles[i].style.bottom = `0px`;
                }
    
                if(this.name == 'magazine' ) {
                    for(let j = 0; j < this.magazineScrollRanges.length; j++) {
                        let range = this.magazineScrollRanges[j];
                        if( (offsetScrollProgress >= range[0] && offsetScrollProgress <= range[1]) && ((Date.now() - this.lastTriggerTime) > 70 ) ) 
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
        if(this.slideInitialized) {
            if(!this.firstDrawn) {
                this.firstDrawn = true;
                this.resize();
            }

            if(color) {
                this.roughStyle.stroke = color;
                this.roughBboxStyle.stroke = this.secondaryColor;
                this.roughBubbleStyle.stroke = color;
                this.p5.stroke(color);
            }
            this.rc.curve(this.points, this.roughStyle);
    
            // draw help text
            if(this.roughBboxStyle.strokeWidth > 0) {
                this.rc.curve(this.helpPoints, this.roughBboxStyle);
            }
        }
    }

    setOpacity(el, opacity) {
        el.style.opacity = `${opacity}`;
    }

    setScrollProgress(clientX) {
        let caterpillarHoverProgress = this.p5.constrain((clientX - this.caterpillarBbox.x) / this.caterpillarBbox.width, 0, 1);
        this.scrollProgress = caterpillarHoverProgress * this.pathLengthOffset * this.numProducts;
    }

    hideCaterpillarCTA() {
        if(!this.caterpillarTouched) {
            let opacity = 1;
            let caterpillarInterval = setInterval(() => {
                opacity -= 0.05;
                this.setOpacity(this.caterpillarHelpText, opacity);
                this.roughBboxStyle.strokeWidth = opacity;
                if(opacity <= 0) {
                    clearInterval(caterpillarInterval);
                    this.roughBboxStyle.strokeWidth = 0;
                }
            }, 20);
            this.caterpillarTouched = true;
        }
    }

    resize() {
        // resize slide things
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
            slidePoint = this.mapPoint(slidePoint, this.displayOffset, this.targetWidth, this.targetHeight, this.attrW, this.attrH);
            this.points.push([slidePoint.x, slidePoint.y]);
        }
        
        // resize caterpillar things
        this.caterpillarBbox = this.caterpillarIndicator.getBoundingClientRect();
        this.caterpillarHelpBbox = this.caterpillarHelpText.getBoundingClientRect(); // incorrect on load if page is loaded on other pages first
        this.caterpillarHelpDisplayOffset = this.p5.createVector(this.caterpillarHelpBbox.x, this.caterpillarHelpBbox.y);
        this.helpPoints = [];
        for(let i = 0; i <= slideSteps; i++) {
            let pt = this.caterpillarHelpPath.getPointAtLength(i * this.caterpillarHelpPathLength / slideSteps);
            pt = this.mapPoint(pt, this.caterpillarHelpDisplayOffset, this.caterpillarHelpBbox.width, this.caterpillarHelpBbox.height, this.caterpillarHelpAttrW, this.caterpillarHelpAttrH);
            this.helpPoints.push([pt.x, pt.y]);
        }
    }

    mapPoint(point, offset = this.p5.createVector(0,0), targetWidth, targetHeight, attrW, attrH) {
        point.x = point.x / attrW * targetWidth + offset.x;
        point.y = point.y / attrH * targetHeight + offset.y;
        return point;
    }

    inRange(progress, min, max) {
        return progress >= min && progress <= max;
    }

    mouseEnterHandler(e) {
        this.freezeScroll = true; 
        this.roughStyle.roughness = Math.random() * 5 + 4;

        e.currentTarget.style.transform = 'scale(2)';
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
        this.hideCaterpillarCTA();

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