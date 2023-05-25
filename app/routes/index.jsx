import { useLoaderData, Link } from "@remix-run/react";
import {Image} from '@shopify/hydrogen';
import bg from '../../public/bg_placeholder.png';
import {json} from '@shopify/remix-oxygen';

export const meta = () => {
    return {
      title: 'home',
    };
};

export async function loader({context}) {
    const {product} = await context.storefront.query(FEATURED_PRODUCT_QUERY);
  
    return json({
        product
    });
  }

export default function Index() {
    const {product} = useLoaderData();
    console.log(product.media.nodes);
    return (
        <section className="h-[calc(100vh-64px)] w-[auto] gap-4" id="home-featured-images">
            {product.media.nodes.map((media, idx) => {
                return (
                    <Image
                        data={media.image}
                        key={`featured-image-${idx}`}
                        loaderOptions={{
                            scale: 2,
                        }}
                    ></Image>
                );
            })}
        </section>
    );
}

const FEATURED_PRODUCT_QUERY = `#graphql
    query FeaturedProduct {
        product(handle: "test-feature-1") {
                id
                title
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
        }
    }
`;