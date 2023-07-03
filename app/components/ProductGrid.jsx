import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import SVGSlide from './SVGSlide';
import {isMobile} from 'react-device-detect';

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

      <div id="caterpillar-indicator" className="absolute bottom-[10px] left-[50%] translate-x-[-50%] text-center z-[2] cursor-pointer">
        {collection.products.nodes.map((product, index) => (
          <div id={`gradient-circle-${index}`} className={`select-none gradient-circle relative w-[50px] h-[50px] rounded-full bottom-[0] inline-block mr-[-20px]`} key={`gradient-circle-${index}`}>
            <span id={`caterpillar-index-${index}`} className='caterpillar-index text-white iota-md drop-shadow-[0_0_2px_#FFFFFF] text-md top-[11px] left-[0px] relative'>{index+1}</span>
          </div>
        ))}
      </div>
    </>
  );
}
