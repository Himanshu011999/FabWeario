import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import SliderOneImg from '../../assets/images/banner-1.jpg';
import SliderTwoImg from '../../assets/images/banner-2.jpg';
import { apiUrl } from './http';

const Hero = () => {
    const [banners, setBanners] = useState([]);

    const fetchBanner = async () => {
        await fetch(apiUrl+'/get-banner',{
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
            setBanners(result.data)
        });
    }

    useEffect(() => {
        fetchBanner();
    }, []);

  return (
    <section className="section-1">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={0}
        slidesPerView={1}
        breakpoints={{
          1024: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        }}
      >
        {
            banners.map((banner, index) => {
                return (
                    <SwiperSlide key={index}>
                        <div className="content" style={{ backgroundImage: `url(${banner.image_url})` }}>
                            {/* You can add inner content here */}
                        </div>
                    </SwiperSlide>
                );
            })
        }
      </Swiper>
    </section>
  );
};

export default Hero;
