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

const colors = ['#ff616b', '#FBAC00', '#FFFF19', '#40c945', '#a6ff47', '#abf5ed', '#b875eb'];
const pathNameList = ['vessels', 'accessories', 'magazine', 'workshops', 'archive', 'about', 'cart'];

export {hide, show, colors, pathNameList};