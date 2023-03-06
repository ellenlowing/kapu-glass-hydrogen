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

          <nav id="nav" className="">
            <a id="nav-link-0" href="/collections/vessels" className="px-3 cursor-pointer nav-link">vessels</a>
            <a id="nav-link-1" href="/collections/accessories" className="px-3 cursor-pointer nav-link">accessories</a>
            <a id="nav-link-2" href="/" className="line-through px-3 cursor-pointer nav-link">magazine</a>
            <a id="nav-link-3" href="/collections/workshops" className="line-through px-3 cursor-pointer nav-link">workshop</a>
            <a id="nav-link-4" href="/collections/archive" className="px-3 cursor-pointer nav-link">archive</a>
            <a id="nav-link-5" href="/about" className="px-3 cursor-pointer nav-link">about</a>
            <a id="nav-link-6" className="px-3 cursor-pointer line-through nav-link">cart</a>
            <a id="menu-switch" className="px-3 cursor-pointer nav-link">menu</a>
          </nav>
        </header>

        <main
          role="main"
          id="mainContent"
          className="flex-grow h-[100vh]"
        >
          {children}

          <Sketch/>
        </main>
      </div>
    );
}
