import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { apiUrl } from "./http";
import Loader from "./Loader";

const Hero = () => {
  const [loader, setLoader] = useState(true);
  const [banners, setBanners] = useState([]);

  const fetchBanner = async () => {
    try {
      const res = await fetch(apiUrl + "/get-banner", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();
      setBanners(result.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoader(false); // ✅ always stop loader
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // ✅ Show only loader while loading
  if (loader) {
    return (
      <section className="section-1">
        <Loader />
      </section>
    );
  }

  return (
    <section className="section-1">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={0}
        slidesPerView={1}
      >
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div
                className="content"
                style={{ backgroundImage: `url(${banner.image_url})` }}
              ></div>
            </SwiperSlide>
          ))
        ) : (
          <div>No banners found</div>
        )}
      </Swiper>
    </section>
  );
};

export default Hero;