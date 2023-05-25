import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import SVGSlide from './SVGSlide';

export default function ProductGrid({collection}) {

  return (
    <>
      <section 
        className="gap-8 grid mr-[60px] md:mr-[0] relative h-full"
      >
        <SVGSlide/>

        <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
          {collection.products.nodes.map((product, index) => (
            <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
          ))}
        </div>

        {/* <div className="selected-product-info absolute rounded-full bottom-0 left-0 w-[250px] h-[250px] bubble">
            <h1 className="text-3xl relative text-center top-[38%] align-bottom text-white">Product title</h1>
        </div> */}
      </section>

      <div id="selected-product-info" className="hidden absolute text-center border-solid border-black border-0 bottom-[40px] w-full">
        <h1 id="selected-product-title" className="text-3xl align-top text-left left-0 bottom-0">Product title</h1>
        <span id="selected-product-price" className="text-md text-right right-0 bottom-0">AUD$ 44.44</span>
      </div>
    </>
  );
}
