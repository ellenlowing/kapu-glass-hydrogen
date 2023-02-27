import {useState, useEffect} from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({collection, url}) {
  const [slideProgress, setSlideProgress] = useState(0);
  const productThumbnails = [];
  let slide, slidePath, slideLength;

  useEffect(() => {


    const onPageLoad = () => {
      slide = document.getElementById('slide');
      slidePath = document.getElementById('slide-path');
      slideLength = slidePath.getTotalLength();
      for(let i = 0; i < collection.products.nodes.length; i++) {
        const product = document.getElementById(`product-${i}`);
        product.style.position = 'absolute';
        productThumbnails.push(product);
      }
    }
    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }

    const handleScroll = (event) => {
      setSlideProgress(slideProgress+10);

      for(let i = 0; i < collection.products.nodes.length; i++) {
        const product = productThumbnails[i];
        const slideProgressOffset = -i * 400;
        const offsetSlideLength = slideProgress + slideProgressOffset;
        const slidePoint = slidePath.getPointAtLength(offsetSlideLength);
        if(offsetSlideLength < 0 || offsetSlideLength > slideLength) {
          product.style.display = 'none';
        } else {
          slidePoint.x = slidePoint.x / Number(slide.getAttribute("width")) * slide.clientWidth;
          slidePoint.y = slidePoint.y / Number(slide.getAttribute("height")) * slide.clientHeight;
          product.style.display = 'block';
          product.style.top = `${slidePoint.y}px`;
          product.style.left = `${slidePoint.x}px`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
  })

  

  return (
    <section 
      className="w-full gap-8 grid"
    >
      <svg id="slide" width="1090" height="1386" viewBox="0 0 1090 1386" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path" d="M1 1C122.877 60.573 221.217 129.104 315.904 277.895C391.726 397.041 342.785 504.593 434.158 693C534.238 899.361 622.903 889.829 730.616 955.598C784.637 996.107 773.351 1220.93 862.045 1282.06C949.084 1342.05 994.334 1358.59 1089 1385" stroke="black"/>
      </svg>
      {/* <svg id="slide" width="1594" height="763" viewBox="0 0 1594 763" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="slide-path" d="M0.5 680.002C169.5 424.001 182 -44.999 413.5 4.99959C594.5 44.0914 557 193.068 557 580C557 715.5 722.5 762.5 852 762.5C1019.06 762.18 1125.5 679 1172.5 557.5C1235.7 329.9 1280.5 319.5 1345.5 352C1475 416.75 1233.5 643.5 1593.5 744.5" stroke="black"/>
      </svg> */}


      <div id="products-container" data-collection-length={collection.products.nodes.length} className="grid-flow-row grid gap-6 gap-y-20">
        {collection.products.nodes.map((product, index) => (
          <ProductCard dataIndex={`product-${index}`} key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
