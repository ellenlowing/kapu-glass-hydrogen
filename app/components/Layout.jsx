import Sketch from "./sketch/Sketch";
import logo from '../../public/logo.png';
import {Link, useLoaderData} from '@remix-run/react';
import {isMobile} from 'react-device-detect';
import {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";

export function Layout({children, title}) {
    const {cart} = useLoaderData();
    const [loading, setLoading] = useState(true);
    const [isHome, setIsHome] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
      if(location.pathname == '/') {
        setIsHome(true);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } else {
        setIsHome(false);
        setLoading(false);
      }

      const onPageLoad = () => {
        setPageLoaded(true);
      };
  
      // Check if the page has already loaded
      if (document.readyState === 'complete') {
        onPageLoad();
      } else {
        window.addEventListener('load', onPageLoad);
        // Remove the event listener when component unmounts
        return () => window.removeEventListener('load', onPageLoad);
      }
    }, [location])

    return (
      <div className="flex flex-col min-h-screen antialiased">
        <header
          role="banner"
          className={`absolute items-center h-20 z-[60] top-0 justify-between leading-none p-1 antialiased transition`}
        >
          <Link className={`h-full ${isHome ? 'hidden' : 'visible'} transition-opacity ease-in-out duration-[500ms] ${pageLoaded ? 'opacity-100' : 'opacity-0'}`} to="/">
            <img id="logo" className="h-full" src={logo}></img>
          </Link>
          
          <div className={`${isHome || !pageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity ease-in-out duration-[500ms] `}>
            <nav id="nav" className={`${isHome ? 'hidden' : 'visible'} fixed z-[70] h-[40px]`}>
              <Link id="nav-link-0" to="/collections/vessels" className=" cursor-pointer nav-link">vessels</Link>
              <Link id="nav-link-1" to="/collections/accessories" className=" cursor-pointer nav-link">accessories</Link>
              <Link id="nav-link-2" to="/collections/magazine" className=" cursor-pointer nav-link">magazine</Link>
              <Link id="nav-link-3" to="/collections/workshops" className=" cursor-pointer nav-link">workshop</Link>
              <Link id="nav-link-4" to="/collections/archive" className=" cursor-pointer nav-link">archive</Link>
              <Link id="nav-link-5" to="/about" className=" cursor-pointer nav-link">about</Link>
              <Link id="nav-link-6" to="/cart" className=" cursor-pointer nav-link">cart{cart?.totalQuantity > 0 && `(${cart?.totalQuantity})`}</Link>
              <a id="menu-switch" className=" cursor-pointer nav-link">menu</a>
            </nav>
            <canvas id="ladder-menu" className={`fixed w-[160px] h-[320px] top-[0] right-[5vw] translate-y-[-280px] z-[60] mix-blend-multiply transition-opacity ease-in-out duration-[500ms] ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}></canvas>
          </div>
        </header>

        <main
          role="main"
          id="mainContent"
          className={`flex-grow ${isMobile ? 'select-none' : ''}`}
        >
          <div id="loading-text" className={`select-none fa font-bold text-uppercase ${isMobile ? 'text-xl w-[80%]' : 'text-3xl w-[80%]'} leading-relaxed absolute text-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${isHome ? 'visible' : 'hidden'} transition-opacity ease-in-out duration-[1000ms] ${loading ? 'opacity-100' : 'opacity-0'}`}>
            Right here is a good place to start
          </div> 
          <div className={`transition-opacity ease-in-out ${isHome ? 'duration-[1000ms] delay-500' : 'duration-[1000ms] delay-200'} ${!loading && isHome ? 'opacity-100' : 'opacity-0'}  ${pageLoaded && !isHome ? 'opacity-100' : 'opacity-0'}`}>
            {children}
            <Sketch/>
          </div>
        </main>
      </div>
    );
}
