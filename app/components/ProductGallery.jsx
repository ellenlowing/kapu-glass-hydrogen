import React, { useState } from 'react';
import {MediaFile} from '@shopify/hydrogen-react';

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

    return (
        <div 
            className="custom-carousel relative h-[max-content] shadow"
            onClick={onImageClick}
        >
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
                    <MediaFile
                        key={`product-image-${i}`}
                        tabIndex="0"
                        className={`product-carousel-image w-100 shadow mx-auto ${i == index ? 'block' : 'hidden'}`}
                        data={data}
                        loading='eager'
                        options={{
                        crop: 'center',
                        }}
                        {...extraProps}
                    />
                );
            })}

            <div className="absolute w-half h-full top-0 left-0 hover:cursor-prev"></div>
            <div className="absolute w-half h-full top-0 right-0 hover:cursor-next"></div>
        </div>
    );
  }