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
import Flower from './Flower';
import Slide from './Slide';

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
    // let page;
    let lastURLPath;

    // caterpillar qt menu
    let caterpillarRadius = 30;

    // butterfly
    let butterfly;
    let mousePath;

    // flower
    let flowers = [];

    // ladder
    let ladder;

    // slide
    let slide;

    // rough 
    let rc;
    let roughFPS = 5;

    // touch
    let startTouch;

    const colors = {
        red: '#EC1E24',
        orange: '#FF8C00',
        green: '#23C17C',
        blue: '#3300FF',
        lightblue: '#4F8FE6',
        lightgreen: '#A6D40D',
        palekingblue: '#96bfe6'
    };

    const caterpillar = {
        bodyRadius: 120,
    };

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight); 
        p5.pixelDensity(2);
        p5.noStroke();

        rc = rough.canvas(document.getElementById('defaultCanvas0'));

        ladder = new Ladder(p5, rc);

        butterfly = new Butterfly(
            p5.createVector(p5.width/2, p5.height/2),
            p5.random(0.01, 0.1),
            {
                stroke: colors.red,
                strokeWidth: 1,
                roughness: 0.5,
                fill: colors.red,
                fillStyle: 'hachure', 
                hachureGap: 2,
                // fillWeight: 0.2,
                simplification: 0.1
            },
            p5,
            rc
        );

        mousePath = new Path(p5);

        slide = new Slide(p5, rc);

        const urlPath = p5.getURLPath();
        lastURLPath = urlPath;

        if(urlPath.length == 0) {
            // homepage

        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            // collections pages
            const collectionName = urlPath[1];
 
            const body = document.getElementsByTagName('body')[0];
            body.style.overflow = 'hidden';

            // slide layout things
            slide.setup(collectionName);
            
        } else if (urlPath.indexOf('products') != -1 && urlPath.length > 1) {
            // products pages
        }
    }

    p5.draw = () => {

        if(p5.frameCount < 5) {
            roughFPS = p5.constrain(p5.round(p5.frameRate() / 6), 0, 10);
            console.log(roughFPS);
        }

        // if page change
        const urlPath = p5.getURLPath();
        if(lastURLPath !== urlPath) {
            if(urlPath[0] == 'collections' && urlPath[1] !== lastURLPath[1]) {
                const collectionName = urlPath[1];
                slide.setup(collectionName);
                console.log(collectionName);
            }

            const body = document.getElementsByTagName('body')[0];
            if(urlPath[0] == 'products') {
                body.style.overflow = 'auto';
            } else {
                body.style.overflow = 'hidden';
            }
            lastURLPath = urlPath;
        }

        if(!slide.freezeScroll && slide.svg) {
            slide.update();
        }
        if(p5.frameCount % roughFPS == 0) {

            p5.background(colors.palekingblue);
            ladder.show();
            if(mousePath.points.length > 2) {
                butterfly.update(mousePath.points[0], mousePath.angles[0]);
                butterfly.show();
            }

            if(urlPath.length == 0) {
                drawRoughCaterpillar();
            } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
                slide.show();
            }

            // frame rate debug
            p5.stroke(0);
            p5.noFill();
            p5.text(p5.round(p5.frameRate()), 100, 200);
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
        // let flower = new Flower(p5.createVector(p5.mouseX, p5.mouseY), {
        //     stroke: colors.orange,
        //     strokeWidth: 1,
        //     roughness: 0.3,
        //     fill: colors.orange,
        //     fillStyle: 'cross-hatch'
        // }, p5, rc);
        // flowers.push(flower);
    }

    p5.mouseWheel = (e) => {
        if(!slide.freezeScroll && slide.svg) {
            p5.loop();
            slide.scrollProgress += p5.constrain(e.delta, -30, 30);
            hide(slide.selectedProductInfo);
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
        if(lastURLPath.length == 0) {
            drawRoughCaterpillar();
        } else if (lastURLPath.indexOf('collections') != -1 && lastURLPath.length > 1) {
            p5.background(colors.palekingblue);
            slide.resize();
            slide.update();
            slide.show();
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

    function lerpColor(colorA, colorB, t) {
        let r = p5.lerp(p5.red(colorA), p5.red(colorB), t);
        let g = p5.lerp(p5.green(colorA), p5.green(colorB), t);
        let b = p5.lerp(p5.blue(colorA), p5.blue(colorB), t);
        let a = p5.lerp(p5.alpha(colorA), p5.alpha(colorB), t)
        return p5.color(r, g, b, a);
    }
}