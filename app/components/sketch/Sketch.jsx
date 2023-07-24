import {useEffect, useState, lazy, Suspense} from "react";
import { useLoaderData, Link } from "@remix-run/react";
import rough from 'roughjs/bin/rough';
const ReactP5Wrapper = lazy(() => 
  import('react-p5-wrapper').then(module => ({
    default: module.ReactP5Wrapper
  }))
);
import Butterfly from './Butterfly';
import Ladder from './Ladder';
import {hide, show, colors, secondaryColors, pathNameList, magazineScrollRanges, arrayEquals, setPixelDensity, deviceMultiplier, waitForElm} from './Utility';
import Path from './Path';
import Flower from './Flower';
import Slide from './Slide';
import Caterpillar from './Caterpillar';
import FallingStar from './FallingStar';
import Spiral from './Spiral';
import Cloud from './Cloud';
import BubbleEmitter from './BubbleEmitter';
import Sparkle from './Sparkle';
import Habitat from './Habitat';

export async function loader({context}) {
    const {product} = await context.storefront.query(FEATURED_PRODUCT_QUERY);
  
    return json({
        product
    });
  }

export default function Sketch() {
    const {product} = useLoaderData();
    const [isSSR, setIsSSR] = useState(true);

    const links = product.media.nodes.map(media => media.image.url);

    useEffect(() => {
        setIsSSR(false);

    }, [])

    return (
        <>
            {
                !isSSR && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ReactP5Wrapper sketch={sketch} links={links} className="select-none"></ReactP5Wrapper>
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
    let butterflyOffset = 0;
    let mousePath;

    // caterpillar
    let habitat = new Habitat();

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

    // cloud
    let clouds;

    // bubble
    let bubbleEmitters;

    // sparkle
    let sparkles;
    
    let canvas;
    let ladderMenu;

    let bgColor = '#000';
    let mainColor;

    let logo;
    let logoAngle = 0;

    let sampleDuration = 500, duration = 0, frames = 0, averageFPS;

    p5.updateWithProps = async props => {
        waitForElm('#defaultCanvas0').then(() => {
            habitat.imagesCount = props.links.length;
            habitat.links = props.links;
            habitat.loadImages();
            console.log("loading images after canvas is loaded");
        })
    }

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight); 
        p5.pixelDensity(2);
        p5.noStroke();

        canvas = document.getElementById('defaultCanvas0');
        p5.drawingContext.willReadFrequently = true;
        rc = rough.canvas(canvas);

        console.log('initialized canvas');
        
        ladderMenu = document.getElementById('ladder-menu');
        let ladderCanvas = ladderMenu;
        const c = setPixelDensity(ladderCanvas);
        let roughLadder = rough.canvas(ladderCanvas);
        ladder = new Ladder(p5, roughLadder, ladderMenu);

        habitat.setup(p5, rc);

        butterfly = new Butterfly(
            p5.createVector(p5.width/2, p5.height/2),
            p5.random(0.01, 0.1),
            p5,
            rc
        );

        mousePath = new Path(p5);

        slide = new Slide(p5, rc, canvas);

        fallingStars = [];
        for(let i = 0; i < 20 * deviceMultiplier; i++) {
            let x = p5.random();
            let y = p5.random();
            let radius1 = p5.random(5);
            let radius2 = p5.random(radius1 + 2, 25);
            fallingStars.push(new FallingStar(p5, rc, x, y, radius1, radius2, 5));
        }

        spirals = [];

        flowers = [];
        for(let i = 0; i < 20 * deviceMultiplier; i++) {
            let x = p5.random(p5.width);
            let y = p5.random(p5.height);
            let flower = new Flower(p5.createVector(x, y), p5, rc);
            flowers.push(flower);
        }

        clouds = [];
        for(let i = 0; i < 4 * deviceMultiplier; i++) {
            for(let j = 0; j < 4 * deviceMultiplier; j++) {
                let x = p5.random(i, i+1);
                let y = p5.random(0, p5.height);
                let cloud = new Cloud(p5, rc, p5.createVector(x, y));
                clouds.push(cloud);
            }
        }

        sparkles = [];

        canvas.addEventListener('create-bubble', (e) => {
            if(bubbleEmitters.length > 0) {
                bubbleEmitters[e.detail.bubbleIndex].emit(2);
            }
        })

        canvas.addEventListener('create-spiral', (e) => {
            let x = p5.random();
            let y = p5.random();
            let stepSize = p5.random(3, 20);
            let stepCount = p5.random(5, 18);
            let spiral = new Spiral(p5, rc, x, y, stepSize, stepCount);
            spirals.push(spiral);
            if(spirals.length > (10 * deviceMultiplier)) {
                spirals.shift();
            }
        })

        logo = document.getElementById('logo');

        lastURLPath = null;
    }

    p5.draw = async () => {

        // if page change
        const urlPath = p5.getURLPath();

        if(lastURLPath == null || !arrayEquals(urlPath, lastURLPath)) {
            const navLinks = document.getElementsByClassName('nav-link');
            bgColor = '#FFF';
            mainColor = colors[pathNameList.indexOf(urlPath[urlPath.length-1])];
            for(let link of navLinks) {
                link.style.color = '#000';
            }
            ladder.show(mainColor);

            if((!lastURLPath || urlPath[1] !== lastURLPath[1])) {
                if(urlPath.length == 0) {
                    console.log('set up home');
                    // add caterpillar
                    habitat.resize();
                } else if( urlPath[0] == 'collections') {
                    const collectionName = urlPath[1];
                    console.log('init slide');
                    await slide.setup(collectionName).then(() => {});
                    setGradientCaterpillarColor();
        
                    // diff animations per collection page
                    console.log('init bg elements');
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
                } else {
                    sparkles = [];
                    console.log('set up sparkles');
                }
            }

            const body = document.getElementsByTagName('body')[0];
            if(urlPath[0] == 'products' || urlPath[0] == 'cart' || urlPath == 'about') {
                body.style.overflow = 'auto';
            } else {
                body.style.overflow = 'hidden';
            }
            lastURLPath = urlPath;
        }

        if(urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            slide.scrolling = false;
            if(!slide.freezeScroll && slide.svg) {
                slide.update();
            }
        }

        // draw every n frames
        if(p5.frameCount % roughFPS == 0) {
            p5.background(bgColor);

            if(urlPath.length == 0) {
                // home
                habitat.update();
                habitat.show();
            } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
                slide.show(mainColor);
                if(urlPath.indexOf('vessels') != -1) {
                    for(let star of fallingStars) {
                        if(!slide.freezeScroll) star.update();
                        star.show();
                    }
                } else if (urlPath.indexOf('accessories') != -1) {
                    for(let spiral of spirals) {
                        spiral.update();
                        spiral.show();
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
            } else {
                // butterfly
                if(deviceMultiplier === 0.5) {
                    // use noise 
                    let xoff = p5.map(p5.cos(butterflyOffset), -1, 1, 0, 3);
                    let yoff = p5.map(p5.sin(butterflyOffset), -1, 1, 0, 3);
                    let rx = p5.map(p5.noise(xoff, yoff, butterflyOffset), 0, 1, p5.width * 0.15, p5.width/2);
                    let ry = p5.map(p5.noise(xoff, yoff, butterflyOffset), 0, 1, p5.height * 0.15, p5.height/2);
                    let x = rx * p5.cos(butterflyOffset) + p5.width / 2;
                    let y = ry * p5.sin(butterflyOffset) + p5.height / 2;
                    let color = butterfly.updateColor();
                    mousePath.addPoint(x, y);
                    let sparkle = new Sparkle(p5, rc, color, p5.createVector(x, y));
                    sparkles.push(sparkle);
                    if(mousePath.points.length > 2) {
                        butterfly.update(mousePath.lastPt, mousePath.lastAngle);
                        butterfly.show();
                        mousePath.points.shift();
                        mousePath.angles.shift();
                    }
                    if(sparkles.length > 60) {
                        sparkles.shift();
                    }
                    butterflyOffset += 0.08;
                } else {
                    if(mousePath.points.length >= 2) {
                        butterfly.update(mousePath.lastPt, mousePath.lastAngle);
                        butterfly.show();
                    }
                }
                
                for(let sparkle of sparkles) {
                    sparkle.show();
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
            let color = butterfly.updateColor();
            if(deviceMultiplier === 1) {
                mousePath.addPoint(p5.mouseX, p5.mouseY);
                if(mousePath.points.length > 3) {
                    mousePath.points.shift();
                    mousePath.angles.shift();
    
                    let sparkle = new Sparkle(p5, rc, color, p5.createVector(mousePath.points[0].x, mousePath.points[0].y));
                    sparkles.push(sparkle);
                }
                if(sparkles.length > 120) {
                    sparkles.shift();
                }
            }

            // if u want to switch back to uneven distribution of particles
            // let mouseDist = p5.pow(p5.pow(p5.mouseX - p5.pmouseX, 2) + p5.pow(p5.mouseY - p5.pmouseY, 2), 0.5);
            // if(mouseDist > 6) {
            //     let sparkle = new Sparkle(p5, rc, color, p5.createVector(p5.mouseX, p5.mouseY));
            //     sparkles.push(sparkle);
            // }
        }
    }

    p5.mousePressed = (e) => {
        const urlPath = p5.getURLPath();
        if(urlPath.length == 0) {
            habitat.caterpillars.push(new Caterpillar(p5, rc, p5.mouseX, p5.mouseY, habitat.caterpillars.length));
        }
    }

    p5.mouseWheel = (e) => {
        if(!slide.freezeScroll && slide.svg) {
            p5.loop();
            slide.scrollProgress += p5.constrain(e.delta, -30, 30);
            hide(slide.selectedProductInfo);
            logo.style.transform = `rotate(${logoAngle}deg)`;
            logoAngle += Math.sign(e.delta) * 0.5;
            slide.scrolling = true;
        }
    }

    p5.touchStarted = (e) => {
        // e.preventDefault();
        console.log("main loop touch started", e.target.classList);
        if(e.touches && !slide.freezeScroll && slide.svg) {
            p5.loop();
            startTouch = p5.createVector(e.touches[0].clientX, e.touches[0].clientY);
        } else if (slide.activeIndex != null && !e.target.classList.contains('product-image')) {
            // console.log()
            slide.productsNodeList[slide.activeIndex].style.transform = 'scale(1)';
            slide.mouseLeaveHandler();
        }
    }

    p5.touchMoved = (e) => {
        // e.preventDefault();
        console.log("main loop touch moved");
        if(e.touches && !slide.freezeScroll && slide.svg) {
            p5.loop();
            let movedTouch = p5.createVector(startTouch.x - e.touches[0].clientX, startTouch.y - e.touches[0].clientY);
            slide.scrollProgress += p5.constrain(movedTouch.y, -20, 20);
            logo.style.transform = `rotate(${logoAngle}deg)`;
            logoAngle += Math.sign(movedTouch.y) * 0.5;
            slide.scrolling = true;
        }
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        const urlPath = p5.getURLPath();
        if(urlPath.length == 0) {
            p5.background(bgColor);
            habitat.resize();
        } else if (urlPath.indexOf('collections') != -1 && urlPath.length > 1) {
            p5.background(bgColor);
            slide.resize();
            slide.update();
            slide.show();

            if(urlPath.indexOf('vessels') != -1) {
                for(let star of fallingStars) {
                    star.update();
                    star.show();
                }
            } else if (urlPath.indexOf('accessories') != -1) {
                for(let spiral of spirals) {
                    spiral.update();
                    spiral.show();
                }
            } else if (urlPath.indexOf('workshops') != -1) {
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
        // ladder.resize();
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

    // grab average frame rate with deltaTime
    // set update rate
    function getAverageFPS() {
        duration += p5.deltaTime;
        frames += 1;
        if(duration >= sampleDuration) {
            averageFPS = frames / duration * 1000;
            roughFPS = Math.floor(averageFPS / 6); // target at 6 frames per second
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
        slide.secondaryColor = secondaryColors[pathIndex];
    }
}

const FEATURED_PRODUCT_QUERY = `#graphql
query FeaturedProduct {
    product(handle: "featured-page") {
            id
            title
            media(first: 10) {
                nodes {
                    ... on MediaImage {
                    mediaContentType
                            image {
                                id
                                url
                                altText
                                width
                                height
                            }
                    }
                }
            }
    }
}
`;