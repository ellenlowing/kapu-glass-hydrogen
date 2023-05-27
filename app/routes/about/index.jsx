import { useLoaderData, Link } from "@remix-run/react";
import {Image} from '@shopify/hydrogen';

export const meta = () => {
    return {
      title: 'about'
    };
};

export default function About() {
    return (
        <section className="px-6 w-full gap-4 pt-24 w-[calc(95vw-160px)]">
            <h2 className="font-bold text-lead py-6 fa text-4xl">
                About kapu
            </h2>
            <div className="">
                Kapu is a project in glass by Prinita Thevarajah. Born in Brooklyn and based in Sydney, Kapu exchanges worldwide. For collaboration or vendor information, send us a line at <a href="mailto:kapu.glass@gmail.com">kapu.glass@gmail.com</a>. 
            </div>

            <h2 className="font-bold text-lead pt-24 pb-6 fa text-4xl">
                Credits
            </h2>
            <div className="">
                Site by Ellen Lo <br></br>
                Logo by Roshan Ramesh
            </div>
        </section>
    );
}