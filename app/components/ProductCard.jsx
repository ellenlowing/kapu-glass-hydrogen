import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {isMobile} from 'react-device-detect';

export default function ProductCard({product, dataIndex}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;
  const availableForSale = product.variants?.nodes[0].availableForSale;

  return (
    <Link id={dataIndex} to={`/products/${product.handle}`} 
      className={`hidden product group hover:col-unset hover:bg-unset ${isMobile ? 'w-[100px]' : 'w-[160px] md:w-[180px]'} offset-0 absolute origin-bottom z-50 transition-transform ease-in-out duration-500`}>
      <div className="grid gap-2 relative">
        <div className="hover:shadow rounded relative">
          {product.variants.nodes[0].image && 
            <Image
              data={product.variants.nodes[0].image}
              alt={product.title}
              className="rounded product-image"
              loading="eager"
            />
          }
          
        </div>
        <div className={`hidden group-hover:opacity-[100%] opacity-[0] grid absolute h-full w-full transition ease-in-out duration-200 `}>
          <h3 id="product-title" className="t-0 left-[150px] p-[0.1rem] product-hover text-xs text-copy overflow-hidden text-ellipsis w-max-content h-fit-content absolute">
            {product.title}
          </h3>
          {availableForSale && 
            <div data-price={price.amount} id="product-price" className={` absolute flex gap-4 p-[0.1rem] product-hover w-fit-content h-fit-content left-[150px] bottom-0`}>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-3">
                $
                <Money 
                  withoutCurrency 
                  withoutTrailingZeros 
                  data={price} 
                />
                {isDiscounted && (
                  <Money
                    className="line-through opacity-70"
                    withoutTrailingZeros
                    withoutCurrency
                    data={compareAtPrice}
                  />
                )}
                
              </span>
            </div>
          }
          {!availableForSale && 
            <div data-price={price.amount} id="product-price" className={` absolute flex gap-4 p-[0.1rem] product-hover w-fit-content h-fit-content left-[150px] bottom-0`}>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-3">
                Sold out
              </span>
            </div>
          }
          
        </div>
      </div>
    </Link>
  );
}
