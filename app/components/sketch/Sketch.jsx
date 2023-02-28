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
    let slide2;
    let page;

    // collections/$ page variables
    let slide, slidePath, slideLength;
    let productsContainer;
    let productsNodeList = [];
    let productsDisplayCountList = [];
    let scrollProgress = 0;
    let leadingProductIndex, lastProductIndex;
    let pathLengthOffset;
    let maxNumProductsDisplayed = 4;
    let totalToMaxNumDisplayRatio;
    let scrollSpeed = 0;
    let collectionBlurFilter;

    // caterpillar qt menu
    let caterpillarRadius = 30;
    let caterpillarHeadPos;
    let caterpillarActiveIndex = 0;
    let numCaterpillar = 7; 
    let debounceTimeout;
    let debounceTime = 50;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight-64); // 64px is header height
        p5.pixelDensity(2);
        p5.noStroke();
        // p5.blendMode(p5.LIGHTEST);

        const urlPath = p5.getURLPath();
        const collectionName = urlPath[1];

        if(urlPath.length == 0) {
            // homepage
            page = 'home';

            // init slides
            slide2 = new Slide(caterpillar.slide2Data, colors.blue, p5.createVector(p5.width / 2 - caterpillar.bodyRadius, p5.height/2), p5);
            slide2.setup();

        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            // other pages
            page = 'collections';

            const body = document.getElementsByTagName('body')[0];
            body.style.overflow = 'hidden';
            collectionBlurFilter = document.getElementById('collection-blur-filter');

            // slide layout things
            const collectionName = urlPath[1];
            const svgs = document.getElementsByClassName('svg-slide');
            slide = document.getElementById(`slide-${collectionName}`);
            for(let svg of svgs) {
                if(svg !== slide) {
                    svg.style.display = 'none';
                } else {
                    svg.style.display = 'block';
                }
            }
            slidePath = document.getElementById(`slide-path-${collectionName}`);
            slideLength = slidePath.getTotalLength();
            pathLengthOffset = slideLength / 4;
            scrollProgress = slideLength / maxNumProductsDisplayed * (maxNumProductsDisplayed - 1) + 10;
            productsContainer = document.getElementById('products-container');
            const numProducts = Number(productsContainer.getAttribute("data-collection-length"));
            totalToMaxNumDisplayRatio = numProducts / maxNumProductsDisplayed;
            leadingProductIndex = 0;
            lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed - 1) % numProducts;
            for(let i = 0; i < numProducts; i++) {
                const product = document.getElementById(`product-${i}`);
                product.style.position = 'absolute';
                productsNodeList.push(product);
                productsDisplayCountList.push(0);

                product.addEventListener('mouseover', (e) => {
                    show(collectionBlurFilter, 0);
                })

                product.addEventListener('mouseleave', (e) => {
                    hide(collectionBlurFilter);
                })
                
                if(i >= leadingProductIndex && i < (leadingProductIndex + maxNumProductsDisplayed)) {
                    show(product);
                } else {
                    hide(product);
                }
            }

            // caterpillar menu
            caterpillarHeadPos = p5.createVector(p5.width - caterpillarRadius * numCaterpillar, p5.height - caterpillarRadius);
            caterpillarActiveIndex = 0;

        }
    }

    p5.draw = () => {

        if(page == 'home') {
            p5.background(255, 255, 255, 255);

            // slide 2
            p5.noStroke();
            slide2.draw();

            // caterpillar body
            p5.fill(colors.lightgreen);
            for(let i = -2; i < 3; i++) {
                p5.circle(p5.width / 2 + i * caterpillar.bodyRadius, p5.height / 2, caterpillar.bodyRadius);
            }

        } else if (page == 'collections') {
            p5.background(255, 255, 255, 255); // else
            p5.fill(255, 0, 0);

            // slide layout things
            for(let i = 0; i < productsNodeList.length; i++) {
                let offsetScrollProgress = (scrollProgress - i * pathLengthOffset - productsDisplayCountList[i] * totalToMaxNumDisplayRatio * slideLength);
                const slidePoint = slidePath.getPointAtLength(offsetScrollProgress);
                const slideOffsetLeft = (p5.width - slide.clientWidth - 200) / 2;
                slidePoint.x = slidePoint.x / Number(slide.getAttribute("width")) * slide.clientWidth + slideOffsetLeft;
                slidePoint.y = slidePoint.y / Number(slide.getAttribute("height")) * slide.clientHeight;
                const product = productsNodeList[i];
                product.style.top = `${slidePoint.y}px`;
                product.style.left = `${slidePoint.x}px`;
            }


            const scrollThreshold = (slideLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[leadingProductIndex]) + leadingProductIndex * pathLengthOffset);
            const reverseScrollThreshold = slideLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[lastProductIndex]) + pathLengthOffset * (lastProductIndex - maxNumProductsDisplayed);

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

            // draw slide
            // let slideSteps = 40;
            // p5.fill(255, 0, 0);
            // for(let i = 0; i < slideSteps; i++) {
            //     let slidePoint = slidePath.getPointAtLength(i * slideLength / slideSteps);
            //     slidePoint.x = slidePoint.x / Number(slide.getAttribute("width")) * slide.clientWidth;
            //     slidePoint.y = slidePoint.y / Number(slide.getAttribute("height")) * slide.clientHeight;
                
            //     let radius = (p5.sin(i - scrollProgress * 0.01) + 1) * 15 + 10;
            //     // p5.circle(slidePoint.x, slidePoint.y, (p5.sin(i - scrollProgress * 0.01) + 1) * 15 + 10);
            //     drawGradientStep(slidePoint.x, slidePoint.y, radius, p5.color(255, 0, 0));
            // }

            // draw caterpillar menu move w scroll
            // p5.fill(0);
            // for(let i = 0; i < numCaterpillar; i++) {
            //     let offset = i == caterpillarActiveIndex ? -caterpillarRadius * 0.35 : 0;
            //     p5.circle(caterpillarHeadPos.x + i * caterpillarRadius, caterpillarHeadPos.y + offset, caterpillarRadius);
            // }

            // frame rate debug
            // p5.stroke(0);
            // p5.noFill();
            // p5.text(p5.round(p5.frameRate()), 100, 200);
        }
        
    }

    p5.mouseWheel = (e) => {

        scrollProgress += p5.constrain(e.delta, -50, 50);

        scrollSpeed = p5.abs(p5.constrain(e.delta, -50, 50));

        if(!debounceTimeout) {
            caterpillarActiveIndex = (caterpillarActiveIndex + Math.sign(e.delta)) % numCaterpillar;
            if(caterpillarActiveIndex < 0) caterpillarActiveIndex = caterpillarActiveIndex + numCaterpillar;
            debounceTimeout = setTimeout(() => {
                clearTimeout(debounceTimeout);
                debounceTimeout = null;
            }, debounceTime);
        }
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight - 64);
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
    navy: '#003E83',
    blue: '#4F8FE6',
    lightgreen: '#A6D40D'
};

const caterpillar = {
    bodyRadius: 120,
    slide2Data: [
        { x1: 1002, y1: 693, x2: 1068, y2: 810, x3: 970, y3: 950, x4: 824, y4: 768 },
        { x1: 1231, y1: 1038, x2: 970, y2: 950, x3: 919, y3: 1010, x4: 910, y4: 1093 },
        { x1: 818, y1: 861, x2: 919, y2: 1010, x3: 800, y3: 1123, x4: 650, y4: 952 },
        { x1: 971, y1: 1100, x2: 800, y2: 1123, x3: 600, y3: 1280, x4: 600, y4: 1341 }
    ],
}