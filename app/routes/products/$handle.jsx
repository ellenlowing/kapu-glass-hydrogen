import {json} from 'react-router';
import { useLoaderData } from '@remix-run/react';
import ProductOptions from '../../components/ProductOptions';
import {Money} from '@shopify/hydrogen';
import ProductGallery from '../../components/ProductGallery';
import {useMatches, useFetcher} from '@remix-run/react';

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

  if (!product?.id) {
      throw new Response(null, {status: 404});
  }

  return json({
      product,
      selectedVariant
  });
}


export default function ProductHandle() {
    const {product, selectedVariant} = useLoaderData();
    const {price, compareAtPrice} = product.variants?.nodes[0] || {};
    const isDiscounted = compareAtPrice?.amount > price?.amount;
    const availableForSale = selectedVariant?.availableForSale || product.variants?.nodes[0].availableForSale;

    return (
        <section className="w-full gap-4 grid px-6 max-w-[1200px] mx-auto relative">
            <div className="grid items-start gap-6">
                <div className="mx-auto grid max-w-[500px] w-[80%] pt-24 ">
                    <div className="snap-center shadow">
                        <ProductGallery media={product.media.nodes}/>
                    </div>
                </div>
                <div className="md:sticky max-w-xl grid gap-8 px-0 py-8 md:p-6 md:px-0">
                    <div className="grid gap-2">
                        <h1 className="text-2xl font-bold whitespace-normal">
                            {product.title}
                        </h1>
                        {(price?.amount > 0 && availableForSale) && 
                          <div className="flex gap-2">
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
                          <div className="flex gap-2">
                            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-3">
                              Sold out
                            </span>
                          </div>
                        }
                        
                    </div>
                    {product.options[0].values.length > 1 && <ProductOptions options={product.options} selectedVariant={selectedVariant} />}
                    <div
                      className="prose pt-6 text-black text-sm"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                    {(price?.amount > 0 && availableForSale) && 
                      <div className="space-y-2">
                        <ProductForm variantId={selectedVariant?.id} />
                      </div>
                    }

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
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value={'ADD_TO_CART'} />
      <input
        type="hidden"
        name="countryCode"
        value={selectedLocale?.country ?? 'US'}
      />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <button className="bg-black text-white px-6 py-3 w-full rounded-md text-center font-medium max-w-[400px]">
        Add to Bag
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
