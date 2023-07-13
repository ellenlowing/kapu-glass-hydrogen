import Sketch from "./sketch/Sketch";
import logo from '../../public/logo.png';
import {Link, useLoaderData} from '@remix-run/react';
import {isMobile} from 'react-device-detect';
import {useEffect, useState} from 'react';

export function Layout({children, title}) {
    const {cart} = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [isHome, setIsHome] = useState(false);
    
    useEffect(() => {
      if(window.location.pathname === '/') {
        setIsHome(true);
        // let opacity = 1;
        // const fadeInterval = setInterval(() => {
        //   loadingText.style.opacity = opacity;
        //   opacity -= 0.05;
        //   console.log(opacity,loadingText.style.opacity);
        // }, 50);
        setTimeout(() => {
          // clearInterval(fadeInterval);

          setLoading(false);
        }, 2000);

      } else {
        setLoading(false);
      }
    }, [])

    return (
      <div className="flex flex-col min-h-screen antialiased">
        <header
          role="banner"
          className={`absolute items-center h-20 z-[60] top-0 justify-between leading-none p-1 antialiased transition`}
        >
          
          <Link className={`h-full ${isHome ? 'transition ease-in-out duration-[1000ms] delay-500' : ''}  ${!loading ? 'opacity-100' : 'opacity-0'}`} to="/">
            <img id="logo" className="h-full" src={logo}></img>
          </Link>
          
          <nav id="nav" className={`fixed z-[70] h-[40px] ${isHome ? 'hidden' : ''}`}>
            <Link id="nav-link-0" to="/collections/vessels" className=" cursor-pointer nav-link">vessels</Link>
            <Link id="nav-link-1" to="/collections/accessories" className=" cursor-pointer nav-link">accessories</Link>
            <Link id="nav-link-2" to="/collections/magazine" className=" cursor-pointer nav-link">magazine</Link>
            <Link id="nav-link-3" to="/collections/workshops" className=" cursor-pointer nav-link">workshop</Link>
            <Link id="nav-link-4" to="/collections/archive" className=" cursor-pointer nav-link">archive</Link>
            <Link id="nav-link-5" to="/about" className=" cursor-pointer nav-link">about</Link>
            <Link id="nav-link-6" to="/cart" className=" cursor-pointer nav-link">cart{cart?.totalQuantity > 0 && `(${cart?.totalQuantity})`}</Link>
            <a id="menu-switch" className=" cursor-pointer nav-link">menu</a>
          </nav>

          <canvas id="ladder-menu" className={`fixed w-[160px] h-[320px] top-[0] right-[5vw] translate-y-[-280px] z-[60] mix-blend-multiply ${isHome ? 'hidden' : 'visible'}`}></canvas>
        </header>

        <main
          role="main"
          id="mainContent"
          className={`flex-grow ${isMobile ? 'select-none' : ''}`}
        >
          <div id="loading-text" className={`w-full select-none fa text-uppercase text-3xl absolute text-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${isHome ? 'visible' : 'hidden'} transition ease-in-out duration-[1000ms] ${loading ? 'opacity-100' : 'opacity-0'}`}>
            Right here is a good place to start
          </div> 
          <div className={`${isHome ? 'transition ease-in-out duration-[1000ms] delay-500' : ''} ${!loading ? 'opacity-100' : 'opacity-0'}`}>
            {children}
            <Sketch/>
          </div>
        </main>
      </div>
    );
}
