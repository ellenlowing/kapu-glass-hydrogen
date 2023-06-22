function hide (el) {
    el.style.display = 'none';
}

function show (el, delay=0) {
    if(delay == 0) {
        el.style.display = 'block';
    } else {
        setTimeout(() => {
            el.style.display = 'block';
        }, delay);
    }
}

function randomHex() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
}

function inLine(x, y, x0, y0, x1, y1) {
    let slope = (y1 - y0) / (x1 - x0);
    let xy = (y - y0) / (x - x0);
    return slope == xy;
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function setPixelDensity(canvas) {

    // Get the device pixel ratio.
    let pixelRatio = window.devicePixelRatio;
	
    // Optionally print it to the console (if interested).
		console.log(`Device Pixel Ratio: ${pixelRatio}`);

    // Get the actual screen (or CSS) size of the canvas.
    let sizeOnScreen = canvas.getBoundingClientRect();

    // Set our canvas size equal to that of the screen size x the pixel ratio.
    canvas.width = sizeOnScreen.width * pixelRatio;
    canvas.height = sizeOnScreen.height * pixelRatio;

    // Shrink back down the canvas CSS size by the pixel ratio, thereby 'compressing' the pixels.
    canvas.style.width = (canvas.width / pixelRatio) + 'px';
    canvas.style.height = (canvas.height / pixelRatio) + 'px';
    
    // Fetch the context.
    let context = canvas.getContext('2d');

    // Scale all canvas operations by the pixelRatio, so you don't have to calculate these manually.
    context.scale(pixelRatio, pixelRatio);

    // Return the modified context.
    return context;
}

const colors = ['#fbe106', '#FBAC00', '#b8b8ff', '#40c945', '#B0DAFF', '#0d75ff', '#FFB6C1'];
const secondaryColors = ['#202d85', '#19cc33', '#ffb852', '#c9aced', '#abf5ed'];
const pathNameList = ['vessels', 'accessories', 'magazine', 'workshops', 'archive', 'about', 'cart'];
const roughFillStyles = ['dashed', 'hachure', 'cross-hatch', 'zigzag-line'];
const magazineScrollRanges = [[200, 1200], [1600, 2500], [2950, 3900], [4300, 5200]];

export {hide, show, randomHex, colors, secondaryColors, pathNameList, roughFillStyles, inLine, magazineScrollRanges, arrayEquals, setPixelDensity};