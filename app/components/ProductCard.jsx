import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export default function ProductCard({product, dataIndex}) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  return (
    <Link id={dataIndex} to={`/products/${product.handle}`} className={`hover:col-unset hover:bg-unset w-[140px] md:w-[180px] lg:w-[16vw] max-w-[240px] offset-0 absolute`}>
      <div className="grid gap-6">
        <div className="hover:shadow rounded relative transition ease-in-out duration-500 hover:scale-[2.0] hover:z-50 z-1">
          {isDiscounted && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
              Sale
            </label>
          )}
          <Image
            data={product.variants.nodes[0].image}
            alt={product.title}
            className="rounded"
          />
        </div>
        <div className="grid gap-1 hidden">
          <h3 className="max-w-prose text-copy overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-3">
              {price.currencyCode}$
              <Money 
                withoutCurrency 
                withoutTrailingZeros 
                data={price} 
              />
              {isDiscounted && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  withoutCurrency
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
