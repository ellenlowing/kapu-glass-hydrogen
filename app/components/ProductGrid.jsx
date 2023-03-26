import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import SVGSlide from './SVGSlide';

export default function ProductGrid({collection}) {

  return (
    <section 
      className="gap-8 grid mr-[120px] relative h-full"
    >
      <SVGSlide/>

      <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
        {collection.products.nodes.map((product, index) => (
          <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
        ))}
      </div>

      <div id="selected-product-info" className="hidden absolute bottom-0 left-0 p-4">
        <h1 id="selected-product-title" className="text-3xl py-2">Product title</h1>
        <span id="selected-product-price" className="text-lg ">AUD$ 44.44</span>
      </div>

      {/* <div className="selected-product-info absolute rounded-full bottom-0 left-0 w-[250px] h-[250px] bubble">
          <h1 className="text-3xl relative text-center top-[38%] align-bottom text-white">Product title</h1>
      </div> */}
    </section>
  );
}
