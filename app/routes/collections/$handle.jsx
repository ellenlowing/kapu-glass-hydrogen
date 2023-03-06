import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../../components/ProductGrid';

const seo = ({data}) => ({
    title: data?.collection?.title,
    description: data?.collection?.description,
});
export const handle = {
    seo,
};

export async function loader({params, context}) {
  const {handle} = params;
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
    },
  });

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    collection,
  });
}

export default function Collection() {
  const {collection} = useLoaderData();
  return (
    <>
      <header className="hidden grid w-full gap-8 py-8 justify-items-start absolute bottom-[0px] left-0">
        <h1 className="text-4xl whitespace-pre-wrap font-fa uppercase">
          {collection.title}
        </h1>
      </header>
      <ProductGrid
        collection={collection}
      />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
        title
        description
        handle
        products(first: 20) {
            nodes {
                id
                title
                publishedAt
                handle
                variants(first: 1) {
                    nodes {
                        id
                        image {
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
                    }
                }
            }
        }
    }
  }
`;
