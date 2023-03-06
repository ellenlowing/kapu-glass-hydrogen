import { useLoaderData, Link } from "@remix-run/react";
import {Image} from '@shopify/hydrogen';
import bg from '../../public/bg_placeholder.png';

export default function Index() {
    return (
        <section className="h-[calc(100vh-64px)] w-[auto] gap-4">
            {/* <img className="h-full mx-auto" src={bg}></img> */}
        </section>
    );
}