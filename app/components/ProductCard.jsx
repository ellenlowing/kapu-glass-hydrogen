import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export default function ProductCard({product, dataIndex}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;
  const availableForSale = product.variants?.nodes[0].availableForSale;

  return (
    <Link id={dataIndex} to={`/products/${product.handle}`} 
      className={`product group hover:col-unset hover:bg-unset w-[160px] md:w-[180px] offset-0 absolute hover:scale-[2] z-50 transition ease-in-out duration-50`}>
      <div className="grid gap-2 relative">
        <div className="hover:shadow rounded relative">
          {/* {isDiscounted && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
              Sale
            </label>
          )} */}
          {product.variants.nodes[0].image && 
            <Image
              data={product.variants.nodes[0].image}
              alt={product.title}
              className="rounded"
            />
          }
          
        </div>
        <div className="hidden group-hover:opacity-[100%] opacity-[0] grid absolute h-full w-full transition ease-in-out duration-200">
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
