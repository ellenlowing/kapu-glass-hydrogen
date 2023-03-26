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

const colors = ['#FF1119', '#FBAC00', '#FFE600', '#40c945', '#a6ff47', '#4f8fe6', '#b875eb'];
const pathNameList = ['vessels', 'accessories', 'magazine', 'workshops', 'archive', 'about', 'cart'];

export {hide, show, colors, pathNameList};