import { useLoaderData, Link } from "@remix-run/react";
import {Image} from '@shopify/hydrogen';
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
    return (
        <></>
        // <section className="h-[calc(100vh-64px)] w-[auto] gap-4">
        //     {product.media.nodes.map((media, idx) => {
        //         return ( <></>
        //             // <Image
        //             //     data={media.image}
        //             //     key={`featured-image-${idx}`}
        //             //     loaderOptions={{
        //             //         scale: 2,
        //             //     }}
        //             //     className="h-[30%] w-[auto] min-h-[180px] absolute featured-image rounded hidden z-50"
        //             //     id={`featured-image-${idx}`}
        //             //     loading="eager"
        //             // ></Image>
        //             // <p>{media.image.url}</p>
        //         );
        //     })}
        // </section>
    );
}

const FEATURED_PRODUCT_QUERY = `#graphql
    query FeaturedProduct {
        product(handle: "featured-page") {
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