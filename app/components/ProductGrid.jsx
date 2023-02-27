import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({collection, url}) {

  return (
    <section 
      className="gap-8 grid mr-[140px] md:mr-[180px] lg:mr-[16vw] relative"
    >
      <svg className="svg-slide max-w-[800px] lg:w-[80%]" id="slide-vessels" width="1090" height="1386" viewBox="0 0 1090 1386" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path-vessels" d="M1 1C122.877 60.573 221.217 129.104 315.904 277.895C391.726 397.041 342.785 504.593 434.158 693C534.238 899.361 622.903 889.829 730.616 955.598C784.637 996.107 773.351 1220.93 862.045 1282.06C949.084 1342.05 994.334 1358.59 1089 1385" stroke="black"/>
      </svg>

      <svg className="svg-slide" id="slide-accessories" width="737" height="1072" viewBox="0 0 737 1072" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path-accessories" d="M668.933 0.507812C716.523 48.0976 751.167 118.635 730.124 186.439C719.872 219.474 702.206 244.789 679.062 270.247C658.478 292.89 634.313 319.456 605.245 331.299C523.978 364.408 444.528 335.893 363.673 317.701C324.39 308.862 284.742 302.146 244.344 302.715C209.542 303.206 180.798 319.55 149.991 333.241C92.9626 358.587 66.4619 410.649 37.0449 461.312C0.926884 523.515 -4.46655 600.016 5.82507 669.999C16.5597 742.994 53.4381 808.791 77.5612 877.715C98.9742 938.895 119.465 1006.57 119.465 1071.97" stroke="black"/>
      </svg>

      <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
        {collection.products.nodes.map((product, index) => (
          <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
