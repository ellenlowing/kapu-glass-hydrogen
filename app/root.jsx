import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation
} from '@remix-run/react';
import {useEffect} from 'react';
import styles from './styles/app.css';
import customStyles from './styles/custom.css';
import favicon from '../public/favicon.png';
import {Layout} from './components/Layout';
import {Seo} from '@shopify/hydrogen';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css';
import resetStyles from './styles/reset.css';
import { CART_QUERY } from './queries/cart.js';
import {json} from 'react-router';
import {useAnalyticsFromLoaders, useAnalyticsFromActions} from './utils';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifySalesChannel,
  useShopifyCookies,
} from '@shopify/hydrogen';

export const links = () => {
  return [
    {rel: 'stylesheet', href: bootstrapStyles},
    {rel: 'stylesheet', href: resetStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: customStyles},
  ];
};

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
  google: 'notranslate'
});

export async function loader({context}) {
  const layout = await context.storefront.query(LAYOUT_QUERY);
  const cartId = await context.session.get('cartId');
  const {product} = await context.storefront.query(FEATURED_PRODUCT_QUERY);

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
  
  return json({
    layout,
    cart,
    product,
    analytics: {
      shopId: layout.id
    }
  });
}

export default function App() {
  const {layout} = useLoaderData();
  const {name} = layout.shop;
  const location = useLocation();
  const pageAnalytics = useAnalyticsFromLoaders();
  const analyticsFromActions = useAnalyticsFromActions();
  useShopifyCookies({hasUserConsent: true});

  useEffect(() => {
    const payload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
      shopifySalesChannel: ShopifySalesChannel.hydrogen,
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    });
  }, [location]);

  return (
    <html translate="no" lang="en">
      <head>
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout title={name}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
      id
    }
  }
`;

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
