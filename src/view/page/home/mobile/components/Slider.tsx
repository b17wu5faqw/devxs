import Img from "@/components/img/Img";
import Flex from "@/components/utils/Flex";
import { Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function Slider() {
  return (
    <Flex>
      <Swiper
        style={{ width: "100%" }}
        slidesPerView={1}
        spaceBetween={0}
        modules={[A11y, Autoplay]}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".button-next-m",
          prevEl: ".button-prev-m",
        }}
        pagination={{
          el: ".swiper-pagination-m",
          clickable: true,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((item: any, index: number) => (
          <SwiperSlide key={item}>
            <Img
              sx={{ width: "100%" }}
              url={`/images/home/slider/${item}.jpg`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
}

export default Slider;
