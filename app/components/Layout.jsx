import Sketch from "./sketch/Sketch";
import {Image} from '@shopify/hydrogen';
import logo from '../../public/logo.png';

export function Layout({children, title}) {
    return (
      <div className="flex flex-col min-h-screen antialiased">
        <header
          role="banner"
          className={`flex items-center h-16 z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition`}
        >
          <a className="h-full p-2" href="/">
            <img className="h-full" src={logo}></img>
          </a>

          <nav className="px-3">
            <a href="/collections/vessels" className="px-3 cursor-pointer">vessels</a>
            <a href="/collections/accessories" className="px-3 cursor-pointer">accessories</a>
            <a href="/" className="line-through px-3 cursor-pointer">magazine</a>
            <a href="/" className="line-through px-3 cursor-pointer">workshop</a>
            <a className="line-through px-3 cursor-pointer">archive</a>
            <a href="/about" className="px-3 cursor-pointer">about</a>
            <a className="px-3 cursor-pointer line-through">cart</a>
          </nav>
        </header>

        <main
          role="main"
          id="mainContent"
          className="flex-grow"
        >
          {children}

          <Sketch/>
        </main>
      </div>
    );
}
