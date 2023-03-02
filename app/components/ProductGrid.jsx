import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({collection}) {

  return (
    <section 
      className="gap-8 grid mr-[140px] md:mr-[180px] lg:mr-[16vw] relative"
    >
      <svg className="relative svg-slide" id="slide-vessels" width="1090" height="1386" viewBox="0 0 1090 1386" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path-vessels" d="M1 1C122.877 60.573 221.217 129.104 315.904 277.895C391.726 397.041 342.785 504.593 434.158 693C534.238 899.361 622.903 889.829 730.616 955.598C784.637 996.107 773.351 1220.93 862.045 1282.06C949.084 1342.05 994.334 1358.59 1089 1385" stroke="black"/>
      </svg>

      <svg className="relative svg-slide" id="slide-accessories" width="737" height="1072" viewBox="0 0 737 1072" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path-accessories" d="M668.933 0.507812C716.523 48.0976 751.167 118.635 730.124 186.439C719.872 219.474 702.206 244.789 679.062 270.247C658.478 292.89 634.313 319.456 605.245 331.299C523.978 364.408 444.528 335.893 363.673 317.701C324.39 308.862 284.742 302.146 244.344 302.715C209.542 303.206 180.798 319.55 149.991 333.241C92.9626 358.587 66.4619 410.649 37.0449 461.312C0.926884 523.515 -4.46655 600.016 5.82507 669.999C16.5597 742.994 53.4381 808.791 77.5612 877.715C98.9742 938.895 119.465 1006.57 119.465 1071.97" stroke="black"/>
      </svg>

      <svg className="relative svg-slide" id="slide-archive" width="1027" height="803" viewBox="0 0 1027 803" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path-archive" d="M0.916992 6.57077C39.7166 -2.55856 83.7534 2.46903 123.513 2.46903C170.228 2.46903 216.942 2.46903 263.656 2.46903C346.557 2.46903 431.095 7.05037 512.723 22.9777C567.43 33.6523 622.969 40.1347 677.704 51.6899C725.083 61.6922 776.515 73.8125 817.163 100.911C883.806 145.339 953.555 216.406 983.283 291.869C1019.15 382.926 1032.49 487.36 1022.25 584.688C1003.55 762.323 769.673 802.308 628.483 802.308C546.696 802.308 458.598 757.902 398.558 703.866C343.123 653.975 320.852 599.677 320.852 525.44C320.852 463.615 326.348 401.867 349.565 343.825C371.26 289.585 402.043 253.968 448.006 220.773C489.964 190.47 560.992 195.456 607.974 205.733C673.62 220.093 724.219 264.316 749.484 326.506C763.322 360.57 779.551 390.769 780.247 429.05C780.846 461.994 769.288 496.231 752.446 524.301C733.419 556.013 706.941 597.221 665.398 597.221" stroke="black"/>
      </svg>


      <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
        {collection.products.nodes.map((product, index) => (
          <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
