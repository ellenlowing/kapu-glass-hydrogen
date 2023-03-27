import Sketch from "./sketch/Sketch";
import {Image} from '@shopify/hydrogen';
import logo from '../../public/logo.png';
import {Link} from '@remix-run/react';

export function Layout({children, title}) {
    return (
      <div className="flex flex-col min-h-screen antialiased">
        <header
          role="banner"
          className={`flex items-center h-16 z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition`}
        >
          <Link className="h-full p-2" to="/">
            <img className="h-full" src={logo}></img>
          </Link>

          <nav id="nav" className="fixed">
            <Link id="nav-link-0" to="/collections/vessels" className=" cursor-pointer nav-link">vessels</Link>
            <Link id="nav-link-1" to="/collections/accessories" className=" cursor-pointer nav-link">accessories</Link>
            <Link id="nav-link-2" to="/" className=" cursor-pointer nav-link">magazine</Link>
            <Link id="nav-link-3" to="/collections/workshops" className=" cursor-pointer nav-link">workshop</Link>
            <Link id="nav-link-4" to="/collections/archive" className=" cursor-pointer nav-link">archive</Link>
            <Link id="nav-link-5" to="/about" className=" cursor-pointer nav-link">about</Link>
            <Link id="nav-link-6" to="/cart" className=" cursor-pointer nav-link">cart</Link>
            <a id="menu-switch" className=" cursor-pointer nav-link">menu</a>
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
