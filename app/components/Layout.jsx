import Sketch from "./sketch/Sketch";
import {Image} from '@shopify/hydrogen';
import logo from '../../public/logo.png';

export function Layout({children, title}) {
    return (
      <div className="flex flex-col min-h-screen antialiased">
        <header
          role="banner"
          className={`flex items-center h-16 sticky z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition`}
        >
          <a className="h-full p-2" href="/">
            <img className="h-full" src={logo}></img>
          </a>
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
