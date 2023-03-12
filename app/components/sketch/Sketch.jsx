import {useEffect, useState, lazy, Suspense} from "react";
const ReactP5Wrapper = lazy(() => 
  import('react-p5-wrapper').then(module => ({
    default: module.ReactP5Wrapper
  }))
);
import Butterfly from './Butterfly';
import Ladder from './Ladder';
import {hide, show} from './Utility';
import Path from './Path';

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
    let leadingProductIndex, lastProductIndex;
    let maxNumProductsDisplayed = 3;
    let totalToMaxNumDisplayRatio;
    let selectedProductInfo;

    // caterpillar qt menu
    let caterpillarRadius = 30;

    // butterfly
    let butterfly;

    let mousePath;

    // ladder
    let ladder;

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

        ladder = new Ladder(p5, rc);

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
            productsContainer = document.getElementById('products-container');
            const numProducts = Number(productsContainer.getAttribute("data-collection-length"));
            if(numProducts < maxNumProductsDisplayed) {
                maxNumProductsDisplayed = numProducts;
            }
            slide.pathLength = slide.path.getTotalLength();
            slide.pathLengthOffset = slide.pathLength / maxNumProductsDisplayed;
            slide.scrollProgress = slide.pathLength / maxNumProductsDisplayed * (maxNumProductsDisplayed - 1) + 10;
            totalToMaxNumDisplayRatio = numProducts / maxNumProductsDisplayed;
            leadingProductIndex = 0;
            lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed - 1) % numProducts;

            selectedProductInfo = document.getElementById('selected-product-info');
            const selectedProductTitle = document.getElementById('selected-product-title');
            const selectedProductPrice = document.getElementById('selected-product-price');
            for(let i = 0; i < numProducts; i++) {
                const product = document.getElementById(`product-${i}`);
                product.style.position = 'absolute';
                productsNodeList.push(product);
                productsDisplayCountList.push(0);

                product.addEventListener('mouseenter', (e) => {
                    slide.freezeScroll = true;
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
                    slide.freezeScroll = false;
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

                butterfly = new Butterfly(
                    p5.createVector(p5.width/2, p5.height/2),
                    p5.random(0.01, 0.1),
                    {
                        stroke: colors.red,
                        strokeWidth: 1,
                        roughness: 0.5,
                        fill: colors.red,
                        fillStyle: 'dots',
                        fillWeight: 0.2,
                        simplification: 0.1
                    },
                    p5,
                    rc
                );

                mousePath = new Path(p5);
            }
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
                let offsetScrollProgress = (slide.scrollProgress - i * slide.pathLengthOffset - productsDisplayCountList[i] * totalToMaxNumDisplayRatio * slide.pathLength);
                let slidePoint = slide.path.getPointAtLength(offsetScrollProgress);
                const product = productsNodeList[i];
                const productOffset = p5.createVector(-product.clientWidth / 2, -product.clientHeight / 2);
                slidePoint = mapSlidePoint(slidePoint, productOffset);
                product.style.top = `${slidePoint.y}px`;
                product.style.left = `${slidePoint.x}px`;
            }

            const scrollThreshold = (slide.pathLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[leadingProductIndex]) + leadingProductIndex * slide.pathLengthOffset);
            const reverseScrollThreshold = slide.pathLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[lastProductIndex]) + slide.pathLengthOffset * (lastProductIndex - maxNumProductsDisplayed);

            if( slide.scrollProgress >= scrollThreshold) {
                hide(productsNodeList[leadingProductIndex]);
                productsDisplayCountList[leadingProductIndex] += 1;
                lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed) % productsNodeList.length;
                show(productsNodeList[lastProductIndex]);
                leadingProductIndex = (leadingProductIndex + 1) % productsNodeList.length;
            } 
            if ( slide.scrollProgress < reverseScrollThreshold + 1) {
                hide(productsNodeList[lastProductIndex]);
                lastProductIndex = (lastProductIndex - 1) % productsNodeList.length;
                if(lastProductIndex < 0) lastProductIndex = productsNodeList.length + lastProductIndex;
                leadingProductIndex = (leadingProductIndex - 1) % productsNodeList.length < 0 ? productsNodeList.length + (leadingProductIndex - 1) % productsNodeList.length : (leadingProductIndex - 1) % productsNodeList.length;
                productsDisplayCountList[leadingProductIndex] -= 1;
                show(productsNodeList[leadingProductIndex]);
            }

            // draw slide w/ rough
            if(p5.frameCount % roughFPS == 0) {
                p5.background(colors.palekingblue);
                drawRoughSlide();
                // for(let i = 0; i < flower.positions.length; i++) {
                //     drawRoughFlower(i);
                // }
                if(mousePath.points.length > 2) {
                    butterfly.update(mousePath.points[0], mousePath.angles[0]);
                    butterfly.show();
                }

                // *uncomment if want to freeze after scrolling stop
                // p5.noLoop();

                // frame rate debug
                p5.stroke(0);
                p5.noFill();
                p5.text(p5.round(p5.frameRate()), 100, 200);
            }

        } else if(page == 'products') {

        } 

        if(p5.frameCount % roughFPS == 0) {
            ladder.show();
        }
    }

    p5.mouseMoved = (e) => {
        mousePath.addPoint(p5.mouseX, p5.mouseY);
        if(mousePath.points.length > 20) {
            mousePath.points.shift();
            mousePath.angles.shift();
        }
    }

    p5.mousePressed = (e) => {
        setupRoughFlower();
    }

    p5.mouseWheel = (e) => {
        if(!slide.freezeScroll) {
            p5.loop();
            slide.scrollProgress += p5.constrain(e.delta, -30, 30);
            hide(selectedProductInfo);
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
            slide.scrollProgress += p5.constrain(movedTouch.y, -10, 10);
        }
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        if(page == 'home') {
            drawRoughCaterpillar();
        } else {
            drawRoughSlide();
        }
        ladder.resize();
        ladder.show();
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

    function setupRoughFlower() {
        flower.positions.push(p5.createVector(p5.mouseX, p5.mouseY));
        let n = p5.floor(p5.random(2, 8));
        let d = p5.floor(p5.random(1, n-1));
        flower.ns.push(n);
        flower.ds.push(d);
    }

    function drawRoughFlower(index) {
        let flowerPoints = [];
        let d = flower.ds[index];
        let n = flower.ns[index];
        let center = flower.positions[index];
        let k = n/d;
        for(let a = 0; a < p5.TWO_PI * d; a += 0.02) {
            let r = 50 * p5.cos(k * a);
            let x = r * p5.cos(a);
            let y = r * p5.sin(a);
            flowerPoints.push([x + center.x, y + center.y]);
        }
        rc.curve(flowerPoints, {
            stroke: colors.orange,
            strokeWidth: 1,
            roughness: 0.3,
            fill: colors.orange,
            fillStyle: 'cross-hatch'
        });
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
    lightgreen: '#A6D40D',
    palekingblue: '#abf5ed'
};

const caterpillar = {
    bodyRadius: 120,
};

const slide = {
    svg: null,
    path: null,
    pathLength: null,
    pathLengthOffset: null,
    attrW: null,
    attrH: null,
    freezeScroll: false,
    scrollProgress: -1
}

const flower = {
    positions: [],
    ns: [],
    ds: []
}