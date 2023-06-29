import {isMobile} from 'react-device-detect';

export const meta = () => {
    return {
      title: 'home',
    };
};

export default function Index() {
    return (
        <div className={`select-none fa text-uppercase absolute text-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${isMobile ? 'homepage-title-mobile font-bold text-2xl' : 'homepage-title font-bold text-4xl'}`}>Right here is a good place to start</div>
    );
}