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
    let slide, slidePath, slideLength;
    let productsContainer;
    let productsNodeList = [];
    let productsDisplayCountList = [];
    let scrollProgress = 0;
    let leadingProductIndex, lastProductIndex;
    let pathLengthOffset;
    let maxNumProductsDisplayed = 4;
    let totalToMaxNumDisplayRatio;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight-64); // 64px is header height
        p5.pixelDensity(2);
        p5.noStroke();

        const urlPath = p5.getURLPath();

        if(urlPath.length == 0) {
            // homepage
            page = 'home';

            // init slides
            slide2 = new Slide(caterpillar.slide2Data, colors.blue, p5.createVector(p5.width / 2 - caterpillar.bodyRadius, p5.height/2), p5);
            slide2.setup();

        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            // other pages
            page = 'collections';

            console.log('collections');

            const body = document.getElementsByTagName('body')[0];
            body.style.overflow = 'hidden';

            slide = document.getElementById('slide');
            slidePath = document.getElementById('slide-path');
            slideLength = slidePath.getTotalLength();
            pathLengthOffset = slideLength / 4;
            scrollProgress = slideLength / maxNumProductsDisplayed * (maxNumProductsDisplayed - 1);
            productsContainer = document.getElementById('products-container');
            const numProducts = Number(productsContainer.getAttribute("data-collection-length"));
            totalToMaxNumDisplayRatio = numProducts / maxNumProductsDisplayed;
            leadingProductIndex = 0;
            lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed - 1) % numProducts;
            console.log(leadingProductIndex, lastProductIndex);
            for(let i = 0; i < numProducts; i++) {
                const product = document.getElementById(`product-${i}`);
                product.style.position = 'absolute';
                productsNodeList.push(product);
                productsDisplayCountList.push(0);
                
                if(i >= leadingProductIndex && i < (leadingProductIndex + maxNumProductsDisplayed)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            }
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

            for(let i = 0; i < productsNodeList.length; i++) {
                let offsetScrollProgress = (scrollProgress - i * pathLengthOffset - productsDisplayCountList[i] * totalToMaxNumDisplayRatio * slideLength);
                const slidePoint = slidePath.getPointAtLength(offsetScrollProgress);
                slidePoint.x = slidePoint.x / Number(slide.getAttribute("width")) * slide.clientWidth;
                slidePoint.y = slidePoint.y / Number(slide.getAttribute("height")) * slide.clientHeight;
                const product = productsNodeList[i];
                product.style.top = `${slidePoint.y}px`;
                product.style.left = `${slidePoint.x}px`;
            }

            const scrollThreshold = (slideLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[leadingProductIndex]) + leadingProductIndex * pathLengthOffset);
            const reverseScrollThreshold = slideLength * (1 + totalToMaxNumDisplayRatio * productsDisplayCountList[lastProductIndex]) + pathLengthOffset * (lastProductIndex - maxNumProductsDisplayed);
            
            if( scrollProgress > scrollThreshold ) {
                productsNodeList[leadingProductIndex].style.display = 'none';
                productsDisplayCountList[leadingProductIndex] += 1;
                lastProductIndex = (leadingProductIndex + maxNumProductsDisplayed) % productsNodeList.length;
                productsNodeList[lastProductIndex].style.display = 'block';
                leadingProductIndex = (leadingProductIndex + 1) % productsNodeList.length;
            } 
            else if ( scrollProgress < reverseScrollThreshold + 1) {
                productsNodeList[lastProductIndex].style.display = 'none';
                lastProductIndex = (lastProductIndex - 1) % productsNodeList.length;
                if(lastProductIndex < 0) lastProductIndex = productsNodeList.length + lastProductIndex;
                leadingProductIndex = (leadingProductIndex - 1) % productsNodeList.length < 0 ? productsNodeList.length + (leadingProductIndex - 1) % productsNodeList.length : (leadingProductIndex - 1) % productsNodeList.length;
                productsDisplayCountList[leadingProductIndex] -= 1;
                setTimeout(() => {
                    productsNodeList[leadingProductIndex].style.display = 'block';
                }, 100);
            }

            p5.stroke(0);
            p5.noFill();
            p5.text(p5.round(p5.frameRate()), 100, 200);
        }
        
    }

    p5.mouseWheel = (e) => {
        scrollProgress += e.delta;
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight - 64);
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