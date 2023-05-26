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
      </section>

      <div id="selected-product-info" className="hidden absolute text-center bottom-[20px] w-full bg-red-800">
        <h1 id="selected-product-title" className="absolute text-left left-[20px] bottom-0">Product title</h1>
        <span id="selected-product-price" className="absolute text-right right-[20px] bottom-0">44.44</span>
      </div>
    </>
  );
}
