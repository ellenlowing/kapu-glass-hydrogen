import {hide, show, colors, setPixelDensity} from './Utility';
import {isMobile} from 'react-device-detect';

export default class Ladder {
    constructor(p5, rc, el) {
        this.p5 = p5;
        this.rc = rc;
        this.el = el;
        this.activeIndex = [];
        this.width = 160;
        this.stepHeight = 40;
        this.numSteps = 7;
        this.bgStyle = {fill: 'white', fillStyle: 'solid', stroke: 'white', strokeWidth: 4, roughness: 0};
        this.lineStyle = {fill: 'black', roughness: 0.5, strokeWidth: 2 };
        this.hoverStyle = {fill: colors[0], strokeWidth: 0.8, fillStyle: 'cross-hatch', hachureGap: 6, roughness: 2, fillWeight: 0.4, disableMultiStrokeFill: true, disableMultiStroke: true };
        this.menuActive = false;
        this.marginRight = this.p5.width * 0.05;
        this.endX = this.width;
        this.startX = 0;
        this.startY = -this.stepHeight * this.numSteps;
        this.height = this.stepHeight * (this.numSteps + 1);
        this.menuLength = -this.stepHeight * this.numSteps;
        this.menuSpeed = 100;
        this.ladderHoverColor = colors;

        // menu
        const menuSwitch = document.getElementById('menu-switch');
        const nav = document.getElementById('nav');
        menuSwitch.addEventListener('mouseover', (e) => {
            if(!this.menuActive) {
                menuSwitch.innerHTML = 'open';
            }
        })
        menuSwitch.addEventListener('click', (e) => {
            if(!this.menuActive) {
                this.menuActive = true;
                menuSwitch.innerHTML = 'close';
                hide(nav);
                nav.style.height = '320px';
                this.interval = setInterval(() => {
                    if(this.startY < 0) {
                        this.startY += this.stepHeight;
                        nav.style.transform = `translateY(${this.startY}px)`;
                        this.el.style.transform = `translateY(${this.startY / 2}px)`;
                    } else {
                        clearInterval(this.interval);
                        show(nav);
                    }
                }, this.menuSpeed);
            } else {
                this.menuActive = false;
                menuSwitch.innerHTML = 'open';
                hide(nav);
                nav.style.height = '40px';
                this.interval = setInterval(() => {
                    if(this.startY > this.menuLength) {
                        this.startY -= this.stepHeight;
                        nav.style.transform = `translateY(${this.startY}px)`;
                        this.el.style.transform = `translateY(${this.startY}px)`;
                    } else {
                        clearInterval(this.interval);
                        show(nav);
                    }
                }, this.menuSpeed);
            }
        })
        menuSwitch.addEventListener('mouseleave', (e) => {
            if(!this.menuActive) {
                menuSwitch.innerHTML = 'menu';
            }
        })

        for(let i = 0; i < this.numSteps; i++) {
            const navLink = document.getElementById(`nav-link-${i}`);
            navLink.addEventListener('mouseover', (e) => {
                this.activeIndex.push(i);
                this.show();
            })
            navLink.addEventListener('mouseleave', (e) => {
                let index = this.activeIndex.indexOf(i);
                this.activeIndex.splice(index, 1);
                this.show();
            })
            if(isMobile) {
                navLink.addEventListener('click', e => {
                    menuSwitch.click();
                })
            }
        }
        
    }

    show(color) {
        if(color) {
            this.lineStyle.stroke = color;
            this.hoverStyle.stroke = color;
            this.hoverStyle.fill = color;
        }
        if(this.activeIndex.length > 0) {
            this.lineStyle.stroke = this.ladderHoverColor[this.activeIndex[0]];
            this.hoverStyle.stroke = this.ladderHoverColor[this.activeIndex[0]];
        }

        this.rc.rectangle(this.startX, 0, this.width, this.stepHeight * this.numSteps + 3, this.bgStyle); // erase bg
        this.rc.line(this.startX, 0, this.startX, this.height, this.bgStyle );
        this.rc.line(this.endX, 0, this.endX, this.height, this.bgStyle );
        this.rc.line(this.startX, 0, this.startX, this.height, this.lineStyle );
        this.rc.line(this.endX, 0, this.endX, this.height, this.lineStyle );

        for(let i = 0; i < this.numSteps; i++) {
            let y = i * this.stepHeight ;
            if(this.activeIndex.indexOf(i) < 0) {
                this.hoverStyle.fill = '#FF000000';
            } else {
                this.hoverStyle.fill = this.ladderHoverColor[i];
            }
            this.rc.rectangle(this.startX, y, this.width, this.stepHeight, this.hoverStyle);
        }
    }
}