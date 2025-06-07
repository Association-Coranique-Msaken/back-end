import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
//les images
import img1 from "../../images/img4.jpg";
import img2 from "../../images/img3.jpg";
import img3 from "../../images/img6.jfif";
import img4 from "../../images/img5.jfif";
export default function Gallery() {
    return (
        <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            navigation
            loop={true}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
        >
            <SwiperSlide>
                <img className='Gallery-slide' src={img3} alt='img3' />
            </SwiperSlide>
            <SwiperSlide>
                <img className='Gallery-slide' src={img4} alt='img4' />
            </SwiperSlide>
            <SwiperSlide>
                <img className='Gallery-slide' src={img1} alt='img1' />
            </SwiperSlide>
            <SwiperSlide>
                <img className='Gallery-slide' src={img2} alt='img2' />
            </SwiperSlide>
        </Swiper>
    );
}
