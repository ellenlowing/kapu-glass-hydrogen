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

const colors = ['#ff616b', '#FBAC00', '#fbe106', '#40c945', '#B0DAFF', '#0079FF', '#b875eb'];
const secondaryColors = ['#202d85', '#19cc33', '#07FBF9', '#c9aced', '#ADE4DB'];
const pathNameList = ['vessels', 'accessories', 'magazine', 'workshops', 'archive', 'about', 'cart'];
const roughFillStyles = ['dashed', 'hachure', 'cross-hatch', 'zigzag-line'];
const magazineScrollRanges = [[200, 1200], [1600, 2500], [2950, 3900], [4300, 5200]];

export {hide, show, randomHex, colors, secondaryColors, pathNameList, roughFillStyles, inLine, magazineScrollRanges};