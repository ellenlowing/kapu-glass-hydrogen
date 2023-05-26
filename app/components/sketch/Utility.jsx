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

const colors = ['#ff616b', '#FBAC00', '#FFFF19', '#40c945', '#a6ff47', '#abf5ed', '#b875eb'];
const secondaryColors = ['#202d85', '#19cc33'];
const pathNameList = ['vessels', 'accessories', 'magazine', 'workshops', 'archive', 'about', 'cart'];

export {hide, show, randomHex, colors, secondaryColors, pathNameList};