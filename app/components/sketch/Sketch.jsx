import {useEffect, useState, lazy, Suspense} from "react";
const ReactP5Wrapper = lazy(() => 
  import('react-p5-wrapper').then(module => ({
    default: module.ReactP5Wrapper
  }))
);
import Slide from "./Slide";

export default function Sketch() {

    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    })

    return (
        <>
            {
                !isSSR && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ReactP5Wrapper sketch={sketch}></ReactP5Wrapper>
                    </Suspense>
                )
            }
            
        </>
    );
}

function sketch(p5) {
    let page;

    // collections/$ page variables
    let productsContainer;
    let productsNodeList = [];
    let productsDisplayCountList = [];
    let freezeScroll = false;
    let scrollProgress = 0;
    let leadingProductIndex, lastProductIndex;
    let maxNumProductsDisplayed = 3;
    let totalToMaxNumDisplayRatio;
    let slideMarginLeft;

    // caterpillar qt menu
    let caterpillarRadius = 30;
    let caterpillarHeadPos;
    let caterpillarActiveIndex = 0;
    let numCaterpillar = 7; 
    let debounceTimeout;
    let debounceTime = 50;

    // rough 
    let rc;
    let roughFPS = 5;

    // touch
    let startTouch;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight); // before: p5.createCanvas(p5.windowWidth, p5.windowHeight - 64px)
        p5.pixelDensity(2);
        p5.noStroke();

        const urlPath = p5.getURLPath();

        rc = rough.canvas(document.getElementById('defaultCanvas0'));

        setupRoughLadder();

        if(urlPath.length == 0) {
            // homepage
            page = 'home';

        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            // other pages
            page = 'collections';
 
            const body = document.getElementsByTagName('body')[0];
            body.style.overflow = 'hidden';

            // slide layout things
            const collectionName = urlPath[1];
            const svgs = document.getElementsByClassName('svg-slide');
            slide.svg = document.getElementById(`slide-${collectionName}`);
            if(!slide.svg) {
                slide.svg = document.getElementById(`slide-vessels`);
            }
            slide.path = slide.svg.firstChild;
            for(let svg of svgs) {
                if(svg !== slide.svg) {
                    svg.style.display = 'none';
                } else {
                    svg.style.display = 'block';
                }
            }
            slide.attrW = Number(slide.svg.getAttribute("width"));
            slide.attrH = Number(slide.svg.getAttribute("height"));
            let slideViewbox = slide.svg.getAttribute('viewBox');
            slideViewbox = slideViewbox.split(/\s+|,/);
            slide.ogH = Number(slideViewbox[3]);
            productsContainer = document.getElementById('products-container');
            const numProducts = Number(productsContainer.getAttribute("data-collection-length"));
            if(numProducts < maxNumProductsDisplayed) {
                maxNumProductsDisplayed = numProducts;
            }
            slide.pathLength = slide.path.getTotalLength();
            slide.pathLengthOffset = slide.pathLength / maxNumProductsDisplayed;
            scrollProgress = slide.pathLength / maxNumProductsDisplayed * (maxNumProductsDisplayed - 1) + 10;
            totalToMaxNumDisplayRatio = numProducts / maxNumProductsDisplayed;
            leadingProductIndex = 0;
            lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed - 1) % numProducts;

            const selectedProductInfo = document.getElementById('selected-product-info');
            const selectedProductTitle = document.getElementById('selected-product-title');
            const selectedProductPrice = document.getElementById('selected-product-price');
            for(let i = 0; i < numProducts; i++) {
                const product = document.getElementById(`product-${i}`);
                product.style.position = 'absolute';
                productsNodeList.push(product);
                productsDisplayCountList.push(0);

                product.addEventListener('mouseenter', (e) => {
                    freezeScroll = true;
                    for(let product of productsNodeList) {
                        if(product != e.target) {
                            product.classList.add('product-blur');
                        } else {
                            selectedProductTitle.innerHTML = e.target.querySelector('#product-title').innerHTML;
                            selectedProductPrice.innerHTML = e.target.querySelector('#product-price').innerHTML;

                            if(Number(e.target.querySelector('#product-price').getAttribute('data-price')) == 0) {
                                hide(selectedProductPrice);
                            } else {
                                show(selectedProductPrice);
                            }
                        }
                    }
                    show(selectedProductInfo);
                })

                product.addEventListener('mouseleave', (e) => {
                    freezeScroll = false;
                    for(let product of productsNodeList) {
                        product.classList.remove('product-blur');
                    }
                    hide(selectedProductInfo);
                })
                
                if(i >= leadingProductIndex && i < (leadingProductIndex + maxNumProductsDisplayed)) {
                    show(product);
                } else {
                    hide(product);
                }
            }
            slide.marginLeft = productsNodeList[0].clientWidth / 2;
        } else if (urlPath.indexOf('products') != -1 && urlPath.length > 1) {
            page = 'products';
        }
    }

    p5.draw = () => {

        if(p5.frameCount < 5) {
            roughFPS = p5.constrain(p5.round(p5.frameRate() / 6), 0, 10);
        }

        if(page == 'home') {

            // rough: caterpillar body
            if(p5.frameCount % roughFPS == 0) {
                p5.background(255, 255, 255, 255);
                drawRoughCaterpillar();
            }

        } else if (page == 'collections') {

            // slide layout things
            for(let i = 0; i < productsNodeList.length; i++) {
                let offsetScrollProgress = (scrollProgress - i * slide.pathLengthOffset - productsDisplayCountList[i] * totalToMaxNumDisplayRatio * slide.pathLength);
                let slidePoint = slide.path.getPointAtLength(offsetScrollProgress);
                const product = productsNodeList[i];
                const productOffset = p5.createVector(-product.clientWidth / 2, -product.clientHeight / 2);
                slidePoint = mapSlidePoint(slidePoint, productOffset);
                product.style.top = `${slidePoint.y}px`;
                product.style.left = `${slidePoint.x}px`;
            }

            const scrollThreshold = (slide.pathLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[leadingProductIndex]) + leadingProductIndex * slide.pathLengthOffset);
            const reverseScrollThreshold = slide.pathLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[lastProductIndex]) + slide.pathLengthOffset * (lastProductIndex - maxNumProductsDisplayed);

            if( scrollProgress >= scrollThreshold) {
                hide(productsNodeList[leadingProductIndex]);
                productsDisplayCountList[leadingProductIndex] += 1;
                lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed) % productsNodeList.length;
                show(productsNodeList[lastProductIndex]);
                leadingProductIndex = (leadingProductIndex + 1) % productsNodeList.length;
            } 
            if ( scrollProgress < reverseScrollThreshold + 1) {
                hide(productsNodeList[lastProductIndex]);
                lastProductIndex = (lastProductIndex - 1) % productsNodeList.length;
                if(lastProductIndex < 0) lastProductIndex = productsNodeList.length + lastProductIndex;
                leadingProductIndex = (leadingProductIndex - 1) % productsNodeList.length < 0 ? productsNodeList.length + (leadingProductIndex - 1) % productsNodeList.length : (leadingProductIndex - 1) % productsNodeList.length;
                productsDisplayCountList[leadingProductIndex] -= 1;
                show(productsNodeList[leadingProductIndex]);
            }

            // draw slide w/ rough
            if(p5.frameCount % roughFPS == 0) {
                p5.background(255, 255, 255, 255);
                drawRoughSlide();
                // p5.noLoop();

                // frame rate debug
                p5.stroke(0);
                p5.noFill();
                p5.text(p5.round(p5.frameRate()), 100, 200);
            }
        } else if(page == 'products') {

        } 

        if(p5.frameCount % roughFPS == 0) {
            drawRoughLadder();
        }
    }

    p5.mouseWheel = (e) => {
        if(!freezeScroll) {
            p5.loop();
            scrollProgress += p5.constrain(e.delta, -30, 30);
        }

        if(!debounceTimeout) {
            caterpillarActiveIndex = (caterpillarActiveIndex + Math.sign(e.delta)) % numCaterpillar;
            if(caterpillarActiveIndex < 0) caterpillarActiveIndex = caterpillarActiveIndex + numCaterpillar;
            debounceTimeout = setTimeout(() => {
                clearTimeout(debounceTimeout);
                debounceTimeout = null;
            }, debounceTime);
        }
    }

    p5.touchStarted = (e) => {
        if(e.touches) {
            p5.loop();
            startTouch = p5.createVector(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    p5.touchMoved = (e) => {
        if(e.touches) {
            p5.loop();
            let movedTouch = p5.createVector(startTouch.x - e.touches[0].clientX, startTouch.y - e.touches[0].clientY);
            scrollProgress += p5.constrain(movedTouch.y, -10, 10);
        }
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight - 64);
        if(page == 'home') {
            drawRoughCaterpillar();
        } else {
            drawRoughSlide();
        }
        resizeRoughLadder();
        drawRoughLadder();
    }

    function setupRoughLadder() {
        ladder.marginRight = p5.width * 0.05;
        ladder.endX = p5.width - ladder.marginRight;
        ladder.startX = ladder.endX - ladder.width;
        ladder.height = ladder.stepHeight * (ladder.numSteps + 1);
        for(let i = 0; i < ladder.numSteps; i++) {
            const navLink = document.getElementById(`nav-link-${i}`);
            navLink.addEventListener('mouseover', (e) => {
                ladder.activeIndex.push(i);
                p5.loop();
            })
            navLink.addEventListener('mouseleave', (e) => {
                let index = ladder.activeIndex.indexOf(i);
                ladder.activeIndex.splice(index, 1);
                p5.loop();
            })
        }
        ladder.startY = -ladder.stepHeight * ladder.numSteps;
        ladder.menuLength = -ladder.stepHeight * ladder.numSteps;
        ladder.menuSpeed = 20;

        // menu
        const menuSwitch = document.getElementById('menu-switch');
        const nav = document.getElementById('nav');
        menuSwitch.addEventListener('mouseover', (e) => {
            if(!menuSwitch.menuActive) {
                menuSwitch.innerHTML = 'open';
            }
        })
        menuSwitch.addEventListener('click', (e) => {
            if(!menuSwitch.menuActive) {
                menuSwitch.menuActive = true;
                menuSwitch.innerHTML = 'close';
                hide(nav);
                ladder.interval = setInterval(() => {
                    if(ladder.startY < 0) {
                        ladder.startY += 10;
                        nav.style.transform = `translateY(${ladder.startY}px)`;
                    } else {
                        clearInterval(ladder.interval);
                        show(nav);
                    }
                }, ladder.menuSpeed);
            } else {
                menuSwitch.menuActive = false;
                menuSwitch.innerHTML = 'open';
                hide(nav);
                ladder.interval = setInterval(() => {
                    if(ladder.startY > ladder.menuLength) {
                        ladder.startY -= 10;
                        nav.style.transform = `translateY(${ladder.startY}px)`;
                    } else {
                        clearInterval(ladder.interval);
                        show(nav);
                    }
                }, ladder.menuSpeed);
            }
        })
        menuSwitch.addEventListener('mouseleave', (e) => {
            if(!menuSwitch.menuActive) {
                menuSwitch.innerHTML = 'menu';
            }
        })
    }

    function drawRoughLadder() {
        rc.line(ladder.startX, ladder.startY, ladder.startX, ladder.height + ladder.startY, ladder.lineStyle );
        rc.line(ladder.endX, ladder.startY, ladder.endX, ladder.height + ladder.startY, ladder.lineStyle );
        for(let i = 0; i < ladder.numSteps; i++) {
            let y = i * ladder.stepHeight + ladder.startY;
            if(ladder.activeIndex.indexOf(i) < 0) {
                ladder.hoverStyle.fill = `${colors.orange}00`;
            } else {
                ladder.hoverStyle.fill = colors.orange;
            }
            rc.rectangle(ladder.startX, y, ladder.width, ladder.stepHeight, ladder.hoverStyle);
        }
    }

    function resizeRoughLadder() {
        ladder.marginRight = p5.width * 0.05;
        ladder.endX = p5.width - ladder.marginRight;
        ladder.startX = ladder.endX - ladder.width;
    }

    function drawRoughCaterpillar() {
        for(let i = -2; i < 3; i++) {
            rc.circle(p5.width / 2 + i * caterpillar.bodyRadius, p5.height / 2, caterpillar.bodyRadius, 
                { fill: 'red', fillStyle: 'hachure', roughness: 2.4, fillWeight: 1 }
            );
        }
        rc.circle(p5.width / 2 , p5.height / 2 + caterpillarRadius * 3, 30);

    }

    function mapSlidePoint(point, offset=p5.createVector(0, 0)) {
        point.x = point.x / slide.attrW * slide.svg.clientWidth + offset.x + (p5.width - slide.svg.clientWidth) / 2;
        point.y = point.y / slide.attrH * slide.svg.clientHeight + offset.y + (p5.height - slide.svg.clientHeight) / 2;
        // if(slide.ogH != slide.attrH) {
        //     point.y += p5.height/2 - slide.svg.clientHeight/2 + (slide.attrH - slide.ogH) / 2;
        // }
        return point;
    }

    function drawRoughSlide() {
        let slideCurvepoints = [];
        let slideSteps = 40;
        for(let i = 0; i < slideSteps; i++) {
            let slidePoint = slide.path.getPointAtLength(i * slide.pathLength / slideSteps);
            slidePoint = mapSlidePoint(slidePoint);
            slideCurvepoints.push([slidePoint.x, slidePoint.y]);
        }
        rc.curve(slideCurvepoints, {
            stroke: colors.blue,
            strokeWidth: 1,
            roughness: 2.5,
            strokeLineDash: [15, 15],
            simplification: 0.1
        });
    }

    function show (el, delay=50) {
        if(delay == 0) {
            el.style.display = 'block';
        } else {
            setTimeout(() => {
                el.style.display = 'block';
            }, delay);
        }
    }

    function hide (el) {
        el.style.display = 'none';
    }

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    function drawGradientStep(x, y, radius, colorA, colorB=p5.color(255, 255, 255, 0)) {
        radius *= 1.5;
        for(let r = radius; r > 0; --r) {
            let t = r/radius;
            let gradientStep = lerpColor(colorA, colorB, t);
            p5.fill(gradientStep);
            p5.circle(x, y, r);
        }
    }

    function lerpColor(colorA, colorB, t) {
        let r = p5.lerp(p5.red(colorA), p5.red(colorB), t);
        let g = p5.lerp(p5.green(colorA), p5.green(colorB), t);
        let b = p5.lerp(p5.blue(colorA), p5.blue(colorB), t);
        let a = p5.lerp(p5.alpha(colorA), p5.alpha(colorB), t)
        return p5.color(r, g, b, a);
    }
}

const colors = {
    red: '#EC1E24',
    orange: '#FF8C00',
    green: '#23C17C',
    blue: '#3300FF',
    lightblue: '#4F8FE6',
    lightgreen: '#A6D40D'
};

const caterpillar = {
    bodyRadius: 120,
};

const ladder = {
    activeIndex: [],
    width: 160,
    stepHeight: 40,
    numSteps: 7,
    lineStyle: {fill: 'black', roughness: 1.5, strokeWidth: 0.5 },
    hoverStyle: {fill: 'rgba(255, 0, 0, 0)', strokeWidth: 0.25, fillStyle: 'cross-hatch', roughness: 1.4, fillWeight: 0.3 },
    menuActive: false
};

const slide = {
    svg: null,
    path: null,
    pathLength: null,
    pathLengthOffset: null,
    attrW: null,
    attrH: null,
    ogH: null,
    marginLeft: null
}