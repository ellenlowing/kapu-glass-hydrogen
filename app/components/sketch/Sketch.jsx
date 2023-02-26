import {useEffect, useState, lazy, Suspense} from "react";
const ReactP5Wrapper = lazy(() => 
  import('react-p5-wrapper').then(module => ({
    default: module.ReactP5Wrapper
  }))
);
// import Slide from "./Slide";

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

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.pixelDensity(2);
        p5.noStroke();

        // init slides
        // slide2 = new Slide(caterpillar.slide2Data, colors.blue, p5.createVector(p5.width / 2 - caterpillar.bodyRadius, p5.height/2), p5);
        // slide2.setup();

        console.log(p5.getURLPath());
        if(p5.getURLPath().length == 0) {
            // homepage
        } else {
            // other pages
        }
    }

    p5.draw = () => {
        p5.background(255, 255, 255, 255); // if home page
        // p5.background(255, 255, 255, 0); // else

        // slide 2
        p5.noStroke();
        // slide2.draw();

        // caterpillar body
        p5.fill(colors.lightgreen);
        for(let i = -2; i < 3; i++) {
            p5.circle(p5.width / 2 + i * caterpillar.bodyRadius, p5.height / 2, caterpillar.bodyRadius);
        }

        p5.stroke(0);
        p5.noFill();
        p5.text(p5.round(p5.frameRate()), 100, 200);
    }

    p5.mouseWheel = (e) => {
        console.log(e.delta);
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
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