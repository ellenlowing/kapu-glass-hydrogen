import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import styles from './styles/app.css';
import customStyles from './styles/custom.css';
import favicon from '../public/favicon.png';
import {Layout} from './components/Layout';
import {Seo} from '@shopify/hydrogen';
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.min.css';
import resetStyles from './styles/reset.css';
import { CART_QUERY } from './queries/cart.js';
import {json} from 'react-router';

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
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context}) {
  const layout = await context.storefront.query(LAYOUT_QUERY);

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
  
  return json({
    layout,
    cart
  });
}

export default function App() {
  const {layout} = useLoaderData();

  const {name} = layout.shop;

  return (
    <html lang="en">
      <head>
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        {/* <h1>Hello, {name}</h1>
        <p>This is a custom storefront powered by Hydrogen</p> */}
        <Layout title={name}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <script src="https://unpkg.com/roughjs@latest/bundled/rough.js"></script>
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;
