import {useEffect, useState, lazy, Suspense} from "react";
const ReactP5Wrapper = lazy(() => 
  import('react-p5-wrapper').then(module => ({
    default: module.ReactP5Wrapper
  }))
);
import Butterfly from './Butterfly';
import Ladder from './Ladder';
import {hide, show, colors, secondaryColors, pathNameList, magazineScrollRanges} from './Utility';
import Path from './Path';
import Flower from './Flower';
import Slide from './Slide';
import Caterpillar from './Caterpillar';
import FallingStar from './FallingStar';
import Spiral from './Spiral';
import Cloud from './Cloud';
import BubbleEmitter from './BubbleEmitter';

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

    // butterfly
    let butterfly;
    let mousePath;

    let caterpillar;

    // flower
    let flowers;

    // ladder
    let ladder;

    // slide
    let slide;

    // rough 
    let rc;
    let roughFPS = 10;

    // touch
    let startTouch;

    // star
    let fallingStars;

    // spiral
    let spirals;
    let activeSpiralIndices = [];

    // cloud
    let clouds;

    // bubble
    let bubbleEmitters;
    
    let canvas;

    let bgColor = '#000';
    let mainColor;

    let logo;
    let logoAngle = 0;

    let sampleDuration = 500, duration = 0, frames = 0, averageFPS;

    let caterpillarIndicator, caterpillarIndicatorHovered = false;

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight); 
        p5.pixelDensity(2);
        p5.noStroke();

        canvas = document.getElementById('defaultCanvas0');
        rc = rough.canvas(canvas);
        
        ladder = new Ladder(p5, rc);

        butterfly = new Butterfly(
            p5.createVector(p5.width/2, p5.height/2),
            p5.random(0.01, 0.1),
            p5,
            rc
        );

        caterpillar = new Caterpillar(p5, rc);

        mousePath = new Path(p5);

        slide = new Slide(p5, rc, canvas);

        fallingStars = [];
        for(let i = 0; i < 20; i++) {
            let x = p5.random(p5.width);
            let y = p5.random(p5.height);
            let radius1 = p5.random(5);
            let radius2 = p5.random(radius1 + 2, 25);
            fallingStars.push(new FallingStar(p5, rc, x, y, radius1, radius2, 5));
        }

        spirals = [];
        for(let i = 0; i < 20; i++) {
            let x = i < 10 ? p5.random(p5.width/2) : p5.random(p5.width/2, p5.width);
            let y = p5.random(p5.height);
            let stepSize = p5.random(3, 20);
            let stepCount = p5.random(5, 18);
            let spiral = new Spiral(p5, rc, x, y, stepSize, stepCount);
            spirals.push(spiral);
        }

        flowers = [];
        for(let i = 0; i < 9; i++) {
            let x = p5.random(p5.width);
            let y = p5.random(p5.height);
            let flower = new Flower(p5.createVector(x, y), p5, rc);
            flowers.push(flower);
        }

        clouds = [];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                let x = p5.random(p5.width * i, p5.width * (i+1));
                let y = p5.random(0, p5.height);
                let cloud = new Cloud(p5, rc, p5.createVector(x, y));
                clouds.push(cloud);
            }
        }

        canvas.addEventListener('create-bubble', (e) => {
            if(bubbleEmitters.length > 0) {
                bubbleEmitters[e.detail.bubbleIndex].emit(2);
            }
        })

        logo = document.getElementById('logo');

        const urlPath = p5.getURLPath();
        lastURLPath = urlPath;
        mainColor = colors[pathNameList.indexOf(urlPath[urlPath.length-1])];

        if(urlPath.length == 0) {
            // homepage
            caterpillar.setup();

        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            // collections pages
            const collectionName = urlPath[1];
            setGradientCaterpillarColor();
 
            const body = document.getElementsByTagName('body')[0];
            body.style.overflow = 'hidden';

            // slide layout things
            slide.setup(collectionName);

            // diff animations per collection page
            if(urlPath.indexOf('vessels') != -1) {
                // star
                for(let star of fallingStars) {
                    star.setup();
                }
            } else if (urlPath.indexOf('accessories') != -1) {
                // spiral
                for(let spiral of spirals){
                    spiral.setup();
                }
            } else if (urlPath.indexOf('workshops') != -1) {
                // flower
                for(let flower of flowers) {
                    flower.setup();
                }
            } else if (urlPath.indexOf('archive') != -1) {
                // cloud
                for(let cloud of clouds) {
                    cloud.setup();
                }
            } else if (urlPath.indexOf('magazine') != -1) {
                setupBubbleEmitters();
            }
        } 

        setUpCaterpillarIndicator();
    }

    p5.draw = () => {

        // if page change
        const urlPath = p5.getURLPath();
        if(lastURLPath !== urlPath) {
            const navLinks = document.getElementsByClassName('nav-link');
            if(urlPath.length == 0) {
                bgColor = '#000';
                mainColor = '#FFF';
                for(let link of navLinks) {
                    link.style.color = '#FFF';
                }
                caterpillar.setup();
            } else {
                bgColor = '#FFF';
                mainColor = colors[pathNameList.indexOf(urlPath[urlPath.length-1])];
                for(let link of navLinks) {
                    link.style.color = '#000';
                }
            }

            if(urlPath[0] == 'collections' && urlPath[1] !== lastURLPath[1]) {
                const collectionName = urlPath[1];
                slide.setup(collectionName);
                setGradientCaterpillarColor();

                setUpCaterpillarIndicator();

                // diff animations per collection page
                if(urlPath.indexOf('vessels') != -1) {
                    for(let star of fallingStars) {
                        star.setup();
                    }
                } else if (urlPath.indexOf('accessories') != -1) {
                    // spiral
                    for(let spiral of spirals) {
                        spiral.setup();
                    }
                } else if (urlPath.indexOf('workshops') != -1) {
                    // flower
                    for(let flower of flowers) {
                        flower.setup();
                    }
                } else if (urlPath.indexOf('archive') != -1) {
                    // cloud
                    for(let cloud of clouds) {
                        cloud.setup();
                    }
                } else if (urlPath.indexOf('magazine') != -1) {
                    setupBubbleEmitters();
                }
            }

            const body = document.getElementsByTagName('body')[0];
            if(urlPath[0] == 'products' || urlPath[0] == 'cart') {
                body.style.overflow = 'auto';
            } else {
                body.style.overflow = 'hidden';
            }
            lastURLPath = urlPath;
        }


        if(urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            if(!slide.freezeScroll && slide.svg) {
                slide.update();
                if(caterpillarIndicatorHovered) {
                    slide.scrollProgress += 20;
                }
            }
        }

        if(p5.frameCount % roughFPS == 0) {

            p5.background(bgColor);
            ladder.show(mainColor);

            if(urlPath.length == 0) {
                if(caterpillar) {
                    caterpillar.update();
                    caterpillar.show();
                }                
            } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
                slide.show(mainColor);
                if(urlPath.indexOf('vessels') != -1) {
                    for(let star of fallingStars) {
                        if(!slide.freezeScroll) star.update();
                        star.show();
                    }
                } else if (urlPath.indexOf('accessories') != -1) {
                    if(slide.freezeScroll) {
                        if(activeSpiralIndices.length == 0) {
                            activeSpiralIndices.push(Math.floor(p5.random(0, spirals.length/2)));
                            activeSpiralIndices.push(Math.floor(p5.random(spirals.length/2, spirals.length)));
                        }
                        for(let idx of activeSpiralIndices) {
                            spirals[idx].update();
                            spirals[idx].show();
                        }
                    } else {
                        activeSpiralIndices = [];
                    }
                } else if (urlPath.indexOf('workshops') != -1) {
                    // flower
                    for(let flower of flowers) {
                        if(!slide.freezeScroll) flower.update();
                        flower.show();
                    }
                } else if (urlPath.indexOf('archive') != -1) {
                    // cloud
                    for(let cloud of clouds) {
                        if(!slide.freezeScroll) cloud.update();
                        cloud.show();
                    }
                } else if (urlPath.indexOf('magazine') != -1) {
                    // bubble
                    for(let emitter of bubbleEmitters) {
                        emitter.show();
                        if(!slide.freezeScroll) emitter.update();
                    }
                }
            } else if (urlPath.indexOf('products') != -1 || urlPath.indexOf('about') != -1 || urlPath.indexOf('cart') != -1) {
                // butterfly
                if(mousePath.points.length >= 2) {
                    butterfly.update(mousePath.points[0], mousePath.angles[0]);
                    butterfly.show();
                }
            }
        }

        // frame rate debug
        getAverageFPS();
        // p5.stroke(0);
        // p5.noFill();
        // p5.text(`${averageFPS}`, 100, 200);
    }

    p5.mouseMoved = (e) => {
        // butterfly
        const urlPath = p5.getURLPath();
        if(urlPath.indexOf('products') != -1 || urlPath.indexOf('about') != -1 || urlPath.indexOf('cart') != -1) {
            butterfly.updateColor();
            mousePath.addPoint(p5.mouseX, p5.mouseY);
            if(mousePath.points.length > 2) {
                mousePath.points.shift();
                mousePath.angles.shift();
            }
        }
    }

    p5.mousePressed = (e) => {
        const urlPath = p5.getURLPath();
        if(urlPath.length == 0) {
            caterpillar.pressed();
        }
    }

    p5.mouseWheel = (e) => {
        if(!slide.freezeScroll && slide.svg) {
            p5.loop();
            slide.scrollProgress += p5.constrain(e.delta, -30, 30);
            hide(slide.selectedProductInfo);
            logo.style.transform = `rotate(${logoAngle}deg)`;
            logoAngle += Math.sign(e.delta) * 0.5;
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
        const urlPath = p5.getURLPath();
        if(urlPath.length == 0) {
            p5.background(bgColor);
            if(caterpillar) {
                caterpillar.resize();
                caterpillar.update();
                caterpillar.show();
            }
        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            p5.background(bgColor);
            slide.resize();
            slide.update();
            slide.show();

            if (urlPath.indexOf('workshops') != -1) {
                // flower
                for(let flower of flowers) {
                    flower.resize();
                    flower.transform();
                }
            } else if (urlPath.indexOf('archive') != -1) {
                // cloud
                for(let cloud of clouds) {
                    cloud.show();
                }
            } else if (urlPath.indexOf('magazine') != -1) {
                // bubble
                setupBubbleEmitters();
            }
        }
        ladder.resize();
        ladder.show();
    }

    function setupBubbleEmitters() {
        bubbleEmitters = [];
        for(let i = 0; i < 4; i++) {
            let spawnPos = p5.createVector(0, 0);
            let startPos = slide.points[2 + i * 10];
            let midPos = slide.points[5 + i * 10];
            spawnPos.x = (startPos[0] + midPos[0]) / 2;
            spawnPos.y = (startPos[1] + midPos[1]) / 2;
            let emitter = new BubbleEmitter(p5, rc, spawnPos);
            bubbleEmitters.push(emitter);
        }
    }

    function getAverageFPS() {
        duration += p5.deltaTime;
        frames += 1;
        if(duration >= sampleDuration) {
            averageFPS = frames / duration * 1000;
            roughFPS = Math.floor(averageFPS / 6);
            duration = 0;
            frames = 0; 
        }
    }

    function lerpColor(colorA, colorB, t) {
        let r = p5.lerp(p5.red(colorA), p5.red(colorB), t);
        let g = p5.lerp(p5.green(colorA), p5.green(colorB), t);
        let b = p5.lerp(p5.blue(colorA), p5.blue(colorB), t);
        let a = p5.lerp(p5.alpha(colorA), p5.alpha(colorB), t)
        return p5.color(r, g, b, a);
    }

    function setGradientCaterpillarColor() {
        const urlPath = p5.getURLPath();
        const pathIndex = pathNameList.indexOf(urlPath[1]);
        document.documentElement.style.setProperty('--gradient-caterpillar-color', secondaryColors[pathIndex]);
    }

    function setUpCaterpillarIndicator() {
        caterpillarIndicator = p5.select('#caterpillar-indicator');
        if(caterpillarIndicator) {
            caterpillarIndicator.mouseOver(
                () => {
                        caterpillarIndicatorHovered = true;
                }
            );
            caterpillarIndicator.mouseOut(
                () => {
                        caterpillarIndicatorHovered = false;
                    }
            );
        }
    }
}