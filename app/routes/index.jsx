import {isMobile} from 'react-device-detect';
import {Link} from '@remix-run/react';
import {useEffect, useState} from 'react';

export const meta = () => {
    return {
      title: 'home',
    };
};

export default function Index() {
    const [orientation, setOrientation] = useState('landscape');

    useEffect(() => {
        if(typeof window !== 'undefined') {

            const handleWindowResize = () => {
                if((window.innerWidth / window.innerHeight) >= 1.2) {
                    setOrientation('landscape');
                } else if ((window.innerHeight / window.innerWidth) >= 1.2) {
                    setOrientation('portrait');
                } else {
                    setOrientation('square');
                }
              };

            handleWindowResize();
          
              window.addEventListener('resize', handleWindowResize);
          
              return () => {
                window.removeEventListener('resize', handleWindowResize);
              };
        }
    }, []);

    return (
        <div className={`select-none fa text-uppercase absolute text-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${orientation == 'landscape' ? 'h-[40vh]' : orientation == 'portrait' ? 'w-[15vh]' : 'w-[40vw]'}`}>
            <div id="grid-links" className={`container m-auto grid ${orientation == 'landscape' ? 'grid-cols-4 h-full gap-[3vw]' : orientation == 'portrait' ? 'grid-rows-4 w-full gap-1' : 'grid-cols-2 h-full gap-[2vw]'} relative`}>
                <Link id="grid-link-0" className={`grid-link tile relative ${orientation == 'landscape' ? 'h-fit top-[50%] translate-y-[-50%]' : 'w-fit left-[50%] translate-x-[-50%]'} `} to="/collections/vessels">
                    <svg className="grid-link-svg w-full h-full" id="slide-vessels" width="1264" height="743" viewBox="0 0 1264 743" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="grid-link-path" d="M552.328 336.214C552.328 307.966 553.996 279.518 557.193 251.458C561.813 210.906 574.429 173.193 585.301 134.055C596.322 94.3784 606.814 51.6142 606.814 10.1644C606.814 3.33501 605.195 -2.97191 609.841 3.78606C627.545 29.5374 644.897 55.4398 661.192 82.0553C684.75 120.534 705.555 163.207 718.705 206.702C727.112 234.511 733.841 265.299 746.92 291.458C752.338 302.294 749.559 296.339 755.677 293.62C765.712 289.16 774.524 282.643 785.731 278.809C796.535 275.113 806.172 269.116 816.433 264.215C836.128 254.809 857.99 249.597 878.81 243.242C898.919 237.105 917.787 228.026 937.404 220.54C953.208 214.51 968.35 209.285 982.809 200.432C1032.82 169.816 1085.43 143.5 1135.02 112.001C1176.33 85.7654 1215.06 55.857 1258.37 32.7587C1265.26 29.086 1263.95 30.6891 1260.32 36.8667C1252.16 50.7394 1242.42 63.7801 1233.83 77.4067C1213.89 109.071 1194.84 141.251 1174.59 172.757C1156.26 201.279 1134.09 227.191 1110.81 251.675C1085.28 278.524 1061.78 307.527 1038.05 335.998C1013.9 364.976 987.765 389.717 958.485 413.619C940.216 428.532 923.27 445.208 904.756 459.672C899.789 463.553 896.572 467.849 892.648 472.645C884.931 482.077 874.38 488.933 865.189 496.861C859.68 501.612 854.299 507.141 848.649 511.563C843.92 515.264 833.792 519.44 831.027 524.968C829.555 527.913 841.343 526.901 842.27 526.914C853.724 527.076 865.385 529.537 876.54 531.995C914.579 540.377 950.722 563.576 984.215 582.373C1020.81 602.913 1057.05 624.042 1093.29 645.183C1118.97 660.162 1147.85 669.413 1173.08 684.966C1175.15 686.244 1192.32 696.172 1183.56 695.02C1166.59 692.787 1149.58 690.908 1132.65 688.426C1100.36 683.694 1068.33 678.899 1036.21 672.858C963.636 659.205 891.314 646.385 820.757 624.21C788.176 613.97 754.188 608.327 722.056 596.967C705.483 591.109 688.106 587.067 671.029 582.914C658.336 579.826 655.412 580.027 643.895 586.265C625.028 596.484 604.59 605.131 584.436 612.535C554.254 623.622 524.292 634.248 493.626 643.886C458.064 655.062 421.363 665.927 386.709 679.669C364.501 688.476 341.733 695.712 319.466 704.426C286.891 717.172 254.162 728.668 221.306 740.533C209.697 744.725 213.531 736.312 218.603 729.29C228.188 716.019 243.749 704.502 255.684 693.291C290.894 660.214 322.797 623.014 355.358 587.238C381.499 558.515 413.267 535.128 437.951 505.077C448.597 492.117 394.573 453.832 385.952 446.267C357.656 421.435 326.139 399.751 299.467 373.079C243.532 317.144 191.76 255.508 141.307 194.594C109.324 155.981 70.8116 123.447 40.6594 83.2445C29.0327 67.7422 14.762 53.2894 4.65983 36.7586C3.81045 35.3687 -1.24621 31.2683 2.06527 33.5154C13.907 41.5509 25.4943 49.8757 37.9567 56.9746C86.2448 84.4804 131.448 116.812 178.712 145.946C232.419 179.054 276.05 227.783 334.5 251.458C384.162 271.575 450.927 294.903 500.221 316.203C517.79 323.794 536.39 330.875 552.328 341.5" stroke="black" strokeWidth={`${isMobile ? "10" : "5"}`}/>
                    </svg>
                    <span className={`fa ${isMobile ? 'font-normal' : 'font-bold'} ${orientation == 'landscape' ? 'text-xl' : 'text-md'} top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] absolute text-center`}>Vessels</span>
                </Link>
                <Link id="grid-link-1" className={`grid-link tile relative ${orientation == 'landscape' ? 'h-fit top-[50%] translate-y-[-50%]' : 'w-fit left-[50%] translate-x-[-50%]'} `} to="/collections/accessories">
                    <svg className="grid-link-svg w-full h-full" id="slide-accessories" width="748" height="809" viewBox="0 0 748 809" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="grid-link-path" d="M747.719 5.77385C635.978 5.77385 523.466 5.77385 411.326 5.77385C299.455 5.77385 187.766 -1.1266 75.8281 1.85841C56.4663 2.37472 37.264 3.7602 17.8795 3.7602C6.81901 3.7602 6.99362 3.28926 6.6925 13.8285C6.39831 24.1252 7.17888 40.5739 4.23136 50.5218C-3.71396 77.3373 4.67884 111.344 4.67884 138.675C4.67884 223.573 18.7745 307.219 18.7745 392.396C18.7745 415.649 21.249 437.807 22.6899 460.861C24.0207 482.154 26.8291 504.046 26.8291 525.298C26.8291 564.743 28.8431 605.065 32.7582 644.216C36.1565 678.198 33.2345 712.828 37.0093 746.8C37.352 749.885 38.9762 762.515 41.3722 764.476C45.3442 767.726 61.618 764.923 66.8785 764.923C85.4123 764.923 103.542 772.863 121.695 774.88C155.42 778.627 189.589 780.086 223.161 785.06C258.53 790.3 296.089 787.073 331.787 787.073C395.463 787.073 459.89 799.51 523.979 803.071C556.248 804.864 588.698 801.737 620.858 806.203C643.889 809.402 668.157 807.21 691.448 807.21C701.178 807.21 710.592 805.196 720.535 805.196C721.571 805.196 730.702 805.628 729.149 803.63C725.484 798.918 725.554 789.108 724.562 783.158C721.192 762.941 723.555 740.66 723.555 720.175C723.555 696.606 719.528 673.141 719.528 649.697C719.528 619.123 721.541 589.428 721.541 559.083C721.541 527.453 719.528 496.402 719.528 464.888C719.528 451.571 717.514 438.569 717.514 425.062C717.514 407.401 713.818 390.703 713.487 373.155C713.26 361.126 710.686 348.059 709.348 336.014C708.226 325.915 706.647 311.994 702.412 302.677C697.552 291.986 699.391 277.977 699.391 266.543C699.391 261.065 697.539 255.245 697.378 249.427C697.304 246.767 696.241 233.313 694.581 231.416C685.668 221.23 654.664 225.263 642.785 225.263C617.611 225.263 589.94 225.726 565.259 230.297C550.053 233.113 533.993 232.469 518.609 233.765C504.206 234.978 490.376 237.345 475.875 237.345C452.494 237.345 429.113 237.345 405.733 237.345C374.937 237.345 343.432 237.64 312.769 234.883C299.939 233.73 287.385 233.317 274.509 233.317C264.171 233.317 263.1 235.696 260.414 246.294C256.43 262.006 255.261 278.092 251.352 293.727C247.744 308.159 248.361 322.141 245.87 336.461C242.706 354.657 241.548 378.45 244.752 396.871C251.526 435.822 256.386 475.785 256.386 515.23C256.386 535.623 257.053 555.038 261.98 574.744C263.516 580.891 264.312 603.301 270.929 603.831C291.37 605.466 311.074 611.885 332.01 611.885C349.432 611.885 368.235 609.77 385.26 613.451C406.815 618.112 433.805 613.899 455.738 613.899C470.393 613.899 485.048 613.899 499.703 613.899C507.543 613.899 500.399 599.866 499.591 594.21C493.671 552.766 493.713 510.55 486.391 469.363C482.351 446.637 481.916 421.564 481.916 398.437" stroke="black" strokeWidth={`${isMobile ? "10" : "5"}`}/>
                    </svg>
                    <span className={`fa ${isMobile ? 'font-normal' : 'font-bold'} ${orientation == 'landscape' ? 'text-xl' : 'text-md'} top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] absolute text-center`}>accessories</span>
                </Link>
                <Link id="grid-link-2" className={`grid-link tile relative ${orientation == 'landscape' ? 'h-fit top-[50%] translate-y-[-50%]' : 'w-fit left-[50%] translate-x-[-50%]'} `} to="/collections/magazine">
                    <svg className="grid-link-svg w-full h-full" id="slide-magazine" width="1339" height="1301" viewBox="0 0 1339 1301" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="grid-link-path" d="M519.5 500C482.5 545.5 430.647 594.674 369.285 636.579C302.292 682.33 231.67 744.366 148.781 756.208C114.815 761.06 77.8209 757.97 47.5176 740.818C23.3127 727.117 7.27478 681.271 3.80484 655.72C0.770135 633.373 -1.62412 610.333 6.77938 588.857C16.1036 565.028 36.5765 553.414 55.536 537.902C66.3224 529.076 96.3514 531.823 109.336 531.823C132.164 531.823 155.07 534.414 175.035 546.308C239.225 584.549 295.121 636.842 353.507 683.008C436.518 748.645 510.262 824.271 591.082 892.52C651.424 943.475 705.932 999.856 755.717 1061.29C790.091 1103.71 833.446 1158.57 804.085 1214.03C788.792 1242.92 766.577 1261.65 743.042 1283.22C718.874 1305.37 678.683 1300.71 649.151 1298.22C624.215 1296.12 602.857 1290.18 585.263 1272.1C569.808 1256.21 557.959 1233.98 557.328 1211.57C556.541 1183.65 555.444 1158.62 564.311 1131.39C575.629 1096.63 593.333 1066.79 610.87 1034.91C652.092 959.961 723.241 909.916 782.617 851.264C841.486 793.112 925.996 712.363 986.179 655.72C1028.36 616.022 1043.11 597.99 1086.93 559.887C1117.51 533.291 1152.75 513.867 1192.84 505.699C1212.35 501.726 1230.86 499.233 1251.04 499.233C1274.38 499.233 1291.18 515.451 1304.58 533.117C1333.79 571.612 1350.85 626.999 1327.35 671.498C1303.49 716.653 1237.59 735.812 1190.65 741.335C1118.56 749.816 1075.76 704.253 1012.09 669.17C978.253 650.523 944.915 622.91 916.915 597.41C888.915 571.91 851.866 526.402 830 499.233C791.915 451.91 764.627 412.725 718.261 366.358C677.447 325.544 657.428 298 610.87 255.5C564.311 213 549.383 189.566 538.187 150.38C536.436 144.249 536.064 123.643 538.187 117.273C544.419 98.5783 550.66 89.8102 560.949 73.0424C574.817 50.4427 590.503 24.2522 615.008 11.9997C647.866 -4.42943 675.931 -1.38404 707.995 15.4916C745.446 35.2029 783.963 72.1049 784.945 117.273C785.81 157.072 772.253 198.342 748.733 230.822C734.031 251.125 722.723 274.662 705.279 292.9C684.475 314.649 663.376 338.424 640.098 357.564C622.623 371.931 568.673 445.985 552.672 461.987C546.334 468.325 533.358 482.959 519.5 500Z" stroke="black" strokeWidth={`${isMobile ? "10" : "5"}`}/>
                    </svg>
                    <span className={`fa ${isMobile ? 'font-normal' : 'font-bold'} ${orientation == 'landscape' ? 'text-xl' : 'text-md'} top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] absolute text-center`}>magazine</span>
                </Link>
                <Link id="grid-link-3" className={`grid-link tile relative ${orientation == 'landscape' ? 'h-fit top-[50%] translate-y-[-50%]' : 'w-fit left-[50%] translate-x-[-50%]'} `} to="/collections/workshops">
                    <svg className="grid-link-svg w-full h-full" id="slide-workshops" width="855" height="302" viewBox="0 0 855 302" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="grid-link-path" d="M832.883 75.0561C827.641 72.435 825.515 64.3659 822.764 59.7143C813.838 44.6203 801.322 33.0812 787.511 22.5023C764.88 5.16774 750.48 1.42903 722.226 1.61131C626.294 2.23023 522.665 30.2082 451.297 98.7217C407.404 140.859 382.002 198.384 343.741 245.285C306.756 290.622 251.165 301.266 195.382 301.266C168.685 301.266 144.381 298.806 119.163 289.515C99.8363 282.395 89.3934 271.66 74.9329 257.199C43.0935 225.36 16.2788 194.804 5.89477 149.807C-2.97092 111.389 -1.76062 69.4731 32.1717 44.3725C82.0477 7.47792 156.558 -3.09644 217.089 3.08021C273.746 8.86151 326.312 22.3569 371.487 59.0615C415.44 94.7738 451.05 138.398 489.162 180.164C542.031 238.103 640.558 285.021 719.615 258.668C744.555 250.355 771.822 247.103 793.06 230.922C812.103 216.413 837.818 196.697 845.287 174.288C848.752 163.894 865.167 92.6829 841.697 92.6829" stroke="black" strokeWidth={`${isMobile ? "10" : "5"}`}/>
                    </svg>
                    <span className={`fa ${isMobile ? 'font-normal' : 'font-bold'} ${orientation == 'landscape' ? 'text-xl' : 'text-md'} top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] absolute text-center`}>workshop</span>
                </Link>
            </div>
        </div>
    );
}