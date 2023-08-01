import { useLoaderData, Link } from "@remix-run/react";
import {Image} from '@shopify/hydrogen';
// import portrait from '../../../public/portrait.jpg';

export const meta = () => {
    return {
      title: 'about'
    };
};

export default function About() {
    return (
        <section className="cursor-none px-6 w-full max-w-3xl mx-auto gap-4 pt-24 pb-24">
            <h2 className="font-bold text-lead py-6 fa text-4xl">
                About kapu
            </h2>
            <div className="w-full">
                Kapu is a project in glass and design. Kapu exchanges worldwide, born in Brooklyn with a home base in Sydney. 
                <br></br>Say hi at <a href="mailto:kapu.glass@gmail.com">kapu.glass@gmail.com</a>. 
                <br></br>Follow <a target="_blank" href="https://www.instagram.com/kapu.glass/">@kapu.glass</a> on Instagram.
            </div>
            {/* <img className="w-full max-w-[400px] pt-10" src={portrait}></img> */}

            <h2 className="font-bold text-lead pt-24 pb-6 fa text-4xl">
                Credits
            </h2>
            <div className="">
                Site by <a target="_blank" href="https://ellenlowing.com/">Ellen Lo</a> <br></br>
                Logo by <a target="_blank" href="https://www.roshanramesh.com/">Roshan Ramesh</a> <br></br>
                Portrait by <a target="_blank"  href="https://neil-kumar.co/">Neil Kumar</a>
            </div>

            <h2 className="font-bold text-lead pt-24 pb-6 fa text-4xl">
                newsletter
            </h2>
            <div className="">
                Subscribe on <a target="_blank" href="https://substack.com/profile/158707134-kapu?utm_source=profile-page">Substack</a>.
            </div>
        </section>
    );
}