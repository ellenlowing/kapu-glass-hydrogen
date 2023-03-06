import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';
import SVGSlide from './SVGSlide';

export default function ProductGrid({collection}) {

  return (
    <section 
      className="gap-8 grid mr-[70px] md:mr-[90px] lg:mr-[8vw] relative"
    >
      <SVGSlide/>

      <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
        {collection.products.nodes.map((product, index) => (
          <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
