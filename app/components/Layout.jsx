import Sketch from "./sketch/Sketch";
import logo from '../../public/logo.png';
import {Link, useLoaderData} from '@remix-run/react';
import {isMobile} from 'react-device-detect';

export function Layout({children, title}) {
    const {cart} = useLoaderData();

    return (
      <div className="flex flex-col min-h-screen antialiased">
        <header
          role="banner"
          className={`absolute items-center h-20 z-[60] top-0 justify-between leading-none p-1 antialiased transition`}
        >
          <Link className="h-full" to="/">
            <img id="logo" className="h-full" src={logo}></img>
          </Link>

          <nav id="nav" className={`fixed z-[70] h-[40px]`}>
            <Link id="nav-link-0" to="/collections/vessels" className=" cursor-pointer nav-link">vessels</Link>
            <Link id="nav-link-1" to="/collections/accessories" className=" cursor-pointer nav-link">accessories</Link>
            <Link id="nav-link-2" to="/collections/magazine" className=" cursor-pointer nav-link">magazine</Link>
            <Link id="nav-link-3" to="/collections/workshops" className=" cursor-pointer nav-link">workshop</Link>
            <Link id="nav-link-4" to="/collections/archive" className=" cursor-pointer nav-link">archive</Link>
            <Link id="nav-link-5" to="/about" className=" cursor-pointer nav-link">about</Link>
            <Link id="nav-link-6" to="/cart" className=" cursor-pointer nav-link">cart{cart?.totalQuantity > 0 && `(${cart?.totalQuantity})`}</Link>
            <a id="menu-switch" className=" cursor-pointer nav-link">menu</a>
          </nav>

          <canvas id="ladder-menu" className="fixed w-[160px] h-[320px] top-[0] right-[5vw] translate-y-[-280px] z-[60] mix-blend-multiply"></canvas>
        </header>

        <main
          role="main"
          id="mainContent"
          className={`flex-grow ${isMobile ? 'select-none' : ''}`}
        >
          {children}

          <Sketch/>
        </main>
      </div>
    );
}
