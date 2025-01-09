/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

'use client'
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// import plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { useEffect } from 'react';
import fjGallery from 'flickr-justified-gallery';


function Gallery() {

    useEffect(() => {
        fjGallery(document.querySelectorAll('.gallery'), {
            itemSelector: '.gallery__item',
            rowHeight: 180,
            lastRow: 'start',
            gutter: 8,
            rowHeightTolerance: 0.1,
            calculateItemsHeight: false,

        });
    }, []);


    const images = [
        '/bg-ticket.jpg',
        '/background.jpg',
        '/background.jpg',
        '/frank.jpg',
        '/background.jpg',
        '/background.jpg',
        '/frank.jpg',
        '/background.jpg',
        '/frank.jpg',
        '/background.jpg',


    ];

    return (
        <div className="gallery">

            <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames={'gallery'}
                mobileSettings={{
                    controls: false,
                    showCloseIcon: false,
                    download: false,
                    rotate: false,
                }}
            >
                {
                    images.map((image, index) => (
                        <a
                            key={index}
                            data-pinterest-text="Pin it2"
                            data-tweet-text="lightGallery slide  2"
                            className="gallery__item cursor-pointer"
                            data-src={image}
                            data-sub-html={`<h4>Twenty one Pilots ${index + 1}</h4>`}
                        >
                            <img
                                className="img-responsive transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                src={image}
                            />
                        </a>

                    ))
                }
            </LightGallery>
        </div>
    );
}

export default Gallery;
