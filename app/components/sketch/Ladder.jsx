import {hide, show} from './Utility';

export default class Ladder {
    constructor(p5, rc) {
        this.p5 = p5;
        this.rc = rc;
        this.activeIndex = [];
        this.width = 160;
        this.stepHeight = 40;
        this.numSteps = 7;
        this.lineStyle = {fill: 'black', roughness: 1.5, strokeWidth: 0.5 };
        this.hoverStyle = {fill: 'rgba(255, 0, 0, 0)', strokeWidth: 0.25, fillStyle: 'cross-hatch', roughness: 1.4, fillWeight: 0.5 };
        this.menuActive = false;
        this.marginRight = this.p5.width * 0.05;
        this.endX = this.p5.width - this.marginRight;
        this.startX = this.endX - this.width;
        this.startY = -this.stepHeight * this.numSteps;
        this.height = this.stepHeight * (this.numSteps + 1);
        this.menuLength = -this.stepHeight * this.numSteps;
        this.menuSpeed = 20;

        for(let i = 0; i < this.numSteps; i++) {
            const navLink = document.getElementById(`nav-link-${i}`);
            navLink.addEventListener('mouseover', (e) => {
                this.activeIndex.push(i);
                this.p5.loop();
            })
            navLink.addEventListener('mouseleave', (e) => {
                let index = this.activeIndex.indexOf(i);
                this.activeIndex.splice(index, 1);
                this.p5.loop();
            })
        }

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
                this.interval = setInterval(() => {
                    if(this.startY < 0) {
                        this.startY += 10;
                        nav.style.transform = `translateY(${this.startY}px)`;
                    } else {
                        clearInterval(this.interval);
                        show(nav);
                    }
                }, this.menuSpeed);
            } else {
                this.menuActive = false;
                menuSwitch.innerHTML = 'open';
                hide(nav);
                this.interval = setInterval(() => {
                    if(this.startY > this.menuLength) {
                        this.startY -= 10;
                        nav.style.transform = `translateY(${this.startY}px)`;
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
        
    }

    update() {

    }

    show() {
        this.rc.line(this.startX, this.startY, this.startX, this.height + this.startY, this.lineStyle );
        this.rc.line(this.endX, this.startY, this.endX, this.height + this.startY, this.lineStyle );
        for(let i = 0; i < this.numSteps; i++) {
            let y = i * this.stepHeight + this.startY;
            if(this.activeIndex.indexOf(i) < 0) {
                this.hoverStyle.fill = '#FF000000';
            } else {
                this.hoverStyle.fill = `#FF0000`;
            }
            this.rc.rectangle(this.startX, y, this.width, this.stepHeight, this.hoverStyle);
        }
    }

    resize() {
        this.marginRight = this.p5.width * 0.05;
        this.endX = this.p5.width - this.marginRight;
        this.startX = this.endX - this.width;
    }
}