import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import SVGSlide from './SVGSlide';
import {isMobile, isBrowser} from 'react-device-detect';

export default function ProductGrid({collection}) {

  return (
    <>
      <section 
        className="gap-8 grid relative h-full"
      >
        <SVGSlide/>
        <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
          {collection.products.nodes.map((product, index) => (
            <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div id="selected-product-info" className=" absolute text-center bottom-[20px] w-full bg-red-800 fa">
        <h1 id="selected-product-title" className={`fa absolute text-left  bottom-0 leading-none max-w-[70%] ${isMobile ? 'text-[2em] left-[20px] font-bold' : 'text-[4em] left-[20px]'}`} ></h1>
        <span id="selected-product-price" className={`fa absolute text-right bottom-0  ${isMobile ? 'text-[1.2em] right-[20px] font-bold' : 'text-[2.5em] right-[20px]'}`}></span>
        <p className='fa absolute z-[-10] bottom-[-40px]'>preload</p>
      </div>

      <div id="caterpillar-indicator" className={`absolute bottom-[10px] left-[50%] translate-x-[-50%] text-center z-[2] cursor-pointer w-max ${isMobile ? 'caterpillar-indicator-mobile w-max' : ''}`}>
        {collection.products.nodes.map((product, index) => (
          <div id={`gradient-circle-${index}`} className={`select-none gradient-circle relative ${isMobile ? 'w-[30px] h-[30px] mr-[-12px]' : 'w-[50px] h-[50px] mr-[-20px]'} rounded-full bottom-[0] inline-block`} key={`gradient-circle-${index}`}>
            <span id={`caterpillar-index-${index}`} className={`caterpillar-index text-white iota-md drop-shadow-[0_0_2px_#FFFFFF] ${isMobile ? 'top-[1px] left-[0.5px] text-[0.6rem]' : 'top-[11px] left-[1px]'}  relative`}>{index+1}</span>
          </div>
        ))}
      </div>
      {isBrowser && 
        <>
          <div id="caterpillar-help-text" className="select-none px-[1.8rem] pt-[1rem] pb-[1.8rem] text-left w-fit absolute bottom-[70px] translate-x-[-50%] director-bold text-md">
            just scroll, or touch me with your cursor...
          </div>
          <svg id="caterpillar-help-svg" width="461" height="79" viewBox="0 0 461 79" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1274 11.3432C7.84224 14.3161 6.49924 17 2.49924 24C-0.0021143 28.3774 0.998153 31.5 0.999038 37.5C0.998481 45 5.5 50.4565 8.5 51.5C11.5 52.5435 13.7151 53.3087 19.9494 55.0543C27.219 57.0898 34.6394 56.7083 41.9819 57.9852C48.703 59.1541 56.6694 59.097 63.509 59.097C71.4708 59.097 80.4811 60.132 88.3713 61.1183C118.415 64.8738 149.814 64.9199 179.988 62.6848C186.163 62.2274 192.436 61.0331 198.634 60.9162C203.981 60.8153 209.151 59.097 214.502 59.097C221.792 59.097 228.797 57.2778 235.978 57.2778C239.709 57.2778 244.051 55.9749 247.601 56.4187C249.56 56.6635 248.662 62.7636 248.662 64.5546C248.662 67.2707 247.282 68.6401 246.894 70.9723C246.602 72.7251 243.03 78.943 244.114 78.4006C248.433 76.2413 253.114 69.3194 255.03 65.0094C256.016 62.7904 257.758 60.6702 257.758 58.1874C257.758 54.9043 265.793 56.3682 268.269 56.3682C278.473 56.3682 288.691 56.2036 298.892 56.3682C311.306 56.5684 323.784 58.8214 336.186 59.097C349.184 59.3858 362.013 60.9162 375.096 60.9162C385.76 60.9162 398.466 62.8114 408.953 60.714C425.038 57.4971 445.682 57.0291 456.455 43.179C459.082 39.8003 460.819 33.2082 459.487 28.8782C458.473 25.5837 458.707 22.4257 456.455 19.5295C454.406 16.8952 451.397 15.1444 448.976 12.9097C442.297 6.74492 430.7 6.52569 422.345 5.48133C410.954 4.05747 398.338 5.43079 386.921 5.43079C356.238 5.43079 325.774 8.15958 295.102 8.15958C264.681 8.15958 234.411 6.34039 204.092 6.34039H158.208C145.618 6.34039 131.417 8.17678 119.045 5.88559C108.118 3.86208 96.7978 6.24778 85.8446 3.81373C74.8924 1.37992 62.3017 0.882812 51.0778 0.882812C41.8597 0.882812 33.0882 4.92545 23.992 5.43079C21.2009 5.58586 15.6203 9.9409 13.1274 11.3432Z" stroke="none"/>
          </svg>
        </>
      } 
      {isMobile && 
        <>
          <div id="caterpillar-help-text" className="select-none px-[0.5rem] pt-[0.4rem] pb-[1.4rem] text-center w-[60%] absolute bottom-[40px] left-[64%] translate-x-[-50%] director-bold text-xs">
            drag up or down on empty spaces, or over me...
          </div>
          <svg id="caterpillar-help-svg" width="287" height="71" viewBox="0 0 287 71" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60.7412 49.2601C71.4012 49.2601 81.8771 47.5766 92.4871 47.5766C94.5223 52.9031 90.4806 61.1174 86.3225 64.1309C84.5458 65.4186 83.12 67.0563 81.3492 68.3397C80.0704 69.2665 78.2401 70.5551 80.7238 69.7426C83.5724 68.8107 86.1553 66.9725 88.7348 65.4091C93.7542 62.367 100.007 56.3242 101.094 50.0707C101.917 45.3303 107.057 45.3312 110.987 45.3319L111.13 45.3319C119.76 45.3319 128.326 45.8931 136.949 45.8931C156.774 45.8931 176.599 47.5766 196.48 47.5766C211.5 47.5766 226.596 48.5168 241.568 49.6965C247.573 50.1697 254.546 49.4032 260.508 48.3872C264.488 47.7089 268.348 47.0335 272.063 45.3319C277.995 42.6151 286 38.8797 286 30.7417C286 24.9927 283.255 19.2742 278.614 16.1514C276.555 14.7656 274.03 14.1288 271.735 13.3144C268.871 12.2979 266.253 10.7667 263.426 9.69804C259.203 8.10133 254.806 7.01562 250.591 5.45813C245.595 3.61208 239.868 3.26683 234.659 2.12233C230.553 1.22031 226.391 1 222.21 1C212.804 1 203.606 3.70752 194.217 3.80582C183.819 3.91467 173.45 3.59486 163.067 3.21348C141.001 2.40299 119.157 3.51397 97.1328 3.80582C92.1094 3.87239 87.1157 4.92815 82.0639 4.92815C77.2646 4.92815 72.5924 4.62944 67.8289 4.36698C61.4257 4.01418 55.0048 3.80582 48.5312 3.80582H11.812C8.88728 3.80582 5.24385 9.99524 3.8011 12.1921C0.998519 16.4596 0.457589 20.616 1.47823 25.6912C3.83837 37.4271 12.0574 43.5357 22.2352 47.2648C34.4985 51.7581 48.1394 49.2601 60.7412 49.2601Z" stroke="none"/>
          </svg>
        </>
      } 
    </>
  );
}
