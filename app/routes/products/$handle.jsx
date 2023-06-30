import {json} from 'react-router';
import { useLoaderData } from '@remix-run/react';
import ProductOptions from '../../components/ProductOptions';
import {Money} from '@shopify/hydrogen';
import ProductGallery from '../../components/ProductGallery';
import {useEffect, useState} from 'react';
import {useMatches, useFetcher} from '@remix-run/react';
import {isMobile} from 'react-device-detect';
import { CART_QUERY } from '../../queries/cart';

const seo = ({data}) => ({
  title: data?.product?.title,
  description: data?.product?.description,
});
export const handle = {
  seo,
};

export const loader = async ({params, context, request}) => {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
      variables: {
          handle,
          selectedOptions
      },
  });
  const selectedVariant = product.selectedVariant ?? product?.variants?.nodes[0];

  const cartId = await context.session.get('cartId');
  const cart = cartId
    ? (
        await context.storefront.query(CART_QUERY, {
          variables: {
            cartId,
            country: context.storefront.i18n.country,
            language: context.storefront.i18n.language,
          },
          cache: context.storefront.CacheNone(),
        })
      ).cart
    : null;

  if (!product?.id) {
      throw new Response(null, {status: 404});
  }

  return json({
      product,
      selectedVariant,
      cart
  });
}


export default function ProductHandle() {
    const {product, selectedVariant, cart} = useLoaderData();
    const {price, compareAtPrice} = product.variants?.nodes[0] || {};
    const [cartQuantity, setCartQuantity] = useState(cart?.totalQuantity);
    const [cartAdded, setCartAdded] = useState(false);
    const isDiscounted = compareAtPrice?.amount > price?.amount;
    const availableForSale = selectedVariant?.availableForSale || product.variants?.nodes[0].availableForSale;

    useEffect(() => {
      if(cart) {
        if(cartQuantity != cart?.totalQuantity) {
          setCartAdded(true);
          setTimeout(() => {
            setCartAdded(false);
          }, 1500)
        } 
        setCartQuantity(cart?.totalQuantity);
      }
    })

    return (
        <section id="active-product" data-collection-handle={product.collections.nodes[0].handle} className="w-full lg:max-w-6xl gap-4 grid px-6 mx-auto relative py-24 cursor-none">
            <div className="grid items-start gap-6 lg:grid-flow-col grid-flow-row lg:gap-24 lg:grid-cols-[400px_auto]">
                <div className="mx-auto grid max-w-lg z-50 w-full h-full">
                    <div className="snap-center  w-full h-full">
                        <ProductGallery media={product.media.nodes}/>
                    </div>
                </div>
                <div className={`sticky grid gap-8 lg:gap-12 lg:px-8 ${isMobile ? 'py-16' : 'py-8' }`}>
                    <div className={`${isMobile ? 'block' : 'grid'} lg:gap-8 lg:grid-flow-row grid-flow-col`}>
                        <h1 className="text-5xl whitespace-normal fa">
                            {product.title}
                        </h1>
                        {(price?.amount > 0 && availableForSale) && 
                          <div className={`flex gap-2 self-end place-self-end lg:self-start lg:place-self-start ${isMobile ? 'pt-8' : ''}`}>
                            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-3">
                              $
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
                        }
                        {(price?.amount > 0 && !availableForSale) && 
                          <div className={`flex gap-2 self-end place-self-end lg:self-start lg:place-self-start ${isMobile ? 'pt-8' : ''}`}>
                            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-3">
                              Sold out
                            </span>
                          </div>
                        }
                    </div>
                    {product.options[0].values.length > 1 && <ProductOptions options={product.options} selectedVariant={selectedVariant} />}
                    <div className={`${isMobile ? 'block' : 'grid'} lg:grid-flow-row grid-flow-col`}>
                      <div
                        className="prose pt-6 text-black text-sm"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                      />
                      {(price?.amount > 0 && availableForSale) && 
                        <div className={`py-[0px] lg:py-16 self-end place-self-end lg:self-start lg:place-self-start ${isMobile ? 'pt-12' : ''}`}>
                          <ProductForm variantId={selectedVariant?.id} />
                          {cartAdded && <span className="inline-block px-4">Added!</span>}
                        </div>
                      }
                    </div>
                    

                </div>
            </div>
        </section>
    );
}

function ProductForm({variantId}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  const lines = [{merchandiseId: variantId, quantity: 1}];

  return (
    <fetcher.Form action="/cart" method="post" className="inline-block">
      <input type="hidden" name="cartAction" value={'ADD_TO_CART'} />
      <input
        type="hidden"
        name="countryCode"
        value={selectedLocale?.country ?? 'US'}
      />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <button className="border-[#000000] border-[1px] py-1 px-2 font-medium max-w-[400px] hover:bg-black hover:text-white">
        Add to Cart
      </button>
    </fetcher.Form>
  );
}


function PrintJson({data}) {
    return (
      <details className="outline outline-2 outline-blue-300 p-4 my-2">
        <summary>Product JSON</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    );
}
  
  
const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      media(first: 10) {
        nodes {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      collections(first: 1) {
        nodes {
          handle
          id
          title
        }
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
