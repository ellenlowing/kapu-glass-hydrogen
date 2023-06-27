import React, { useState } from 'react';
import {MediaFile} from '@shopify/hydrogen-react';
import Carousel from 'react-bootstrap/Carousel';

export default function ProductGallery({media}) {
    const [index, setIndex] = useState(0);

    if (!media.length) {
      return null;
    }
  
    const typeNameMap = {
      MODEL_3D: 'Model3d',
      VIDEO: 'Video',
      IMAGE: 'MediaImage',
      EXTERNAL_VIDEO: 'ExternalVideo',
    };

    const onImageClick = (e) => {
    if(e.target.classList.contains('hover:cursor-prev')) {
        index == 0 ? setIndex(media.length - 1) : setIndex((index - 1) % media.length);
      } else {
        setIndex((index + 1) % media.length);
      }
    }

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
  
    return (
        <Carousel 
            activeIndex={index} 
            controls={false} 
            interval={0} 
            indicators={false} 
            onClick={onImageClick} 
            slide={false}>

            {media.map((med, i) => {
                let extraProps = {loading: 'eager'};
        
                if (med.mediaContentType === 'MODEL_3D') {
                    extraProps = {
                        interactionPromptThreshold: '0',
                        ar: true,
                        loading: 'eager',
                        disableZoom: true,
                    };
                }
        
                const data = {
                        ...med,
                        __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
                        image: {
                            ...med.image,
                            altText: med.alt || 'Product image',
                    },
                };

                return (
                    <Carousel.Item key={`product-image-${i}`}>
                        <MediaFile
                            tabIndex="0"
                            className={`w-100 d-block mx-auto`}
                            data={data}
                            loading='eager'
                            options={{
                            crop: 'center',
                            }}
                            {...extraProps}
                            onLoad={() => {
                                console.log('hi', i);
                            }}
                        />
                    </Carousel.Item>
                );
            })}

            <div className="absolute w-half h-full top-0 left-0 hover:cursor-prev"></div>
            <div className="absolute w-half h-full top-0 right-0 hover:cursor-next"></div>
        </Carousel>
        
    );
  }