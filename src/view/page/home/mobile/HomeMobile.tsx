import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { Box } from "@mui/material";
import Slider from "./components/Slider";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import { useState } from "react";
import { Swiper as SwiperClass } from "swiper/types";
import LayoutMobile from "@/layout/LayoutMobile";
import Footer from "./components/Footer";
import useModalStore from "@/stores/modalStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import Hot from "./components/Hot";
import Live from "./components/Live";
import BCT from "./components/BCT";
import RNG from "./components/RNG";
import Home from "./components/Home";
import useBalanceStore from "@/stores/balanceStore";
import PopupMakeTransfer from "@/components/modal/PopupMakeTransfer";
import { MODAL } from "@/constant/modal";

const HomeMobile = () => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  const [swiperIndex, setSwiperIndex] = useState(1);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const balanceUser = useBalanceStore((s) => s.balance);
  const openModal = useModalStore((state) => state.openModal);

  const slideTo = (index: number) => {
    swiperRef?.slideTo(index - 1, 0);
    setSwiperIndex(index);
  };

  return (
    <LayoutMobile>
      <Box
        sx={{
          position: "sticky",
          width: "100%",
          top: 0,
          zIndex: 99,
          backgroundSize: "100% auto",
        }}
      >
        <Flex
          sx={{
            backgroundColor: "#000",
            height: "40px",
          }}
        >
          <Flex
            onClick={() => user?.redirect_url && router.push(user.redirect_url)}
            sx={{
              background:
                "url(/images/common/btn_back_new.svg) no-repeat center",
              backgroundSize: "auto 45%",
              width: "54px",
              height: "100%",
            }}
          />
          <CustomText sx={{ flex: 1, color: "#fff", fontSize: "1.2em" }}>
            KU XỔ SỐ
          </CustomText>
          <Flex
            sx={{
              lineHeight: "40px",
              textAlign: "center",
            }}
          >
            <Flex
              sx={{
                color: "#feea11",
                cursor: "pointer",
                paddingRight: "15px",
                paddingLeft: "13px",
                position: "relative",
                fontSize: "1.3em",
                "&:before": {
                  content: "'$'",
                  position: "absolute",
                  left: "0",
                  top: "0",
                  width: "10px",
                  textAlign: "right",
                },
                "&:after": {
                  content: "''",
                  background:
                    "url(/images/common/icon_arrowGray.svg) no-repeat center",
                  backgroundSize: "100%",
                  width: "10px",
                  height: "10px",
                  position: "absolute",
                  right: "0",
                  top: "0",
                  bottom: "0",
                  margin: "auto",
                },
              }}
            >
              {balanceUser}
            </Flex>
            <Flex
              onClick={() => openModal(MODAL.MAKE_TRANSFER)}
              sx={{
                background: "url(/images/common/btn_menu.svg) no-repeat center",
                backgroundSize: "auto 48%",
                cursor: "pointer",
                width: "54px",
                height: "40px",
                opacity: "0.8",
              }}
            />
          </Flex>
        </Flex>
        <Slider />
        <Flex
          sx={{
            background: "#000",
            padding: "0 5px",
            justifyContent: "space-around",
          }}
        >
          <Flex
            sx={{
              borderBottom:
                swiperIndex == 1
                  ? "3px solid #4de99f"
                  : "3px solid transparent",
              padding: "10px 5px 7px",
              background: "url(/images/main/icon_hot.gif) no-repeat center",
              backgroundSize: "26px",
              backgroundPositionX: "15%",
              paddingLeft: "7%",
              alignItems: "center",
              justifyContent: "center",
              width: "20%",
            }}
          >
            <CustomText
              onClick={() => slideTo(1)}
              sx={{ color: swiperIndex == 1 ? "#4de99f" : "#fff" }}
            >
              HOT
            </CustomText>
          </Flex>
          <Flex
            sx={{
              borderBottom:
                swiperIndex == 2
                  ? "3px solid #4de99f"
                  : "3px solid transparent",
              padding: "10px 5px 7px",
              alignItems: "center",
              justifyContent: "center",
              width: "20%",
            }}
          >
            <CustomText
              onClick={() => slideTo(2)}
              sx={{ color: swiperIndex == 2 ? "#4de99f" : "#fff" }}
            >
              LIVE
            </CustomText>
          </Flex>
          <Flex
            sx={{
              borderBottom:
                swiperIndex == 3
                  ? "3px solid #4de99f"
                  : "3px solid transparent",
              padding: "10px 5px 7px",
              alignItems: "center",
              justifyContent: "center",
              width: "20%",
            }}
          >
            <CustomText
              onClick={() => slideTo(3)}
              sx={{ color: swiperIndex == 3 ? "#4de99f" : "#fff" }}
            >
              BCT
            </CustomText>
          </Flex>
          <Flex
            sx={{
              borderBottom:
                swiperIndex == 4
                  ? "3px solid #4de99f"
                  : "3px solid transparent",
              padding: "10px 5px 7px",
              alignItems: "center",
              justifyContent: "center",
              width: "20%",
            }}
          >
            <CustomText
              onClick={() => slideTo(4)}
              sx={{ color: swiperIndex == 4 ? "#4de99f" : "#fff" }}
            >
              RNG
            </CustomText>
          </Flex>
          <Flex
            sx={{
              borderBottom:
                swiperIndex == 5
                  ? "3px solid #4de99f"
                  : "3px solid transparent",
              padding: "10px 5px 7px",
              alignItems: "center",
              justifyContent: "center",
              width: "20%",
            }}
          >
            <CustomText
              onClick={() => slideTo(5)}
              sx={{ color: swiperIndex == 5 ? "#4de99f" : "#fff" }}
            >
              Trang chủ
            </CustomText>
          </Flex>
        </Flex>
      </Box>
      <Box
        sx={{
          paddingTop: "240px",
          paddingBottom: "58px",
          position: "absolute",
          top: "0",
          bottom: "0",
          width: "100%",
          overflowY: "scroll",
        }}
      >
        <Swiper
          modules={[Virtual]}
          onSwiper={setSwiperRef}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={30}
          pagination={{
            type: "fraction",
          }}
          navigation={false}
          virtual
        >
          <SwiperSlide key={1} virtualIndex={1}>
            <Hot />
          </SwiperSlide>
          <SwiperSlide key={2} virtualIndex={2}>
            <Live />
          </SwiperSlide>
          <SwiperSlide key={3} virtualIndex={3}>
            <BCT />
          </SwiperSlide>
          <SwiperSlide key={4} virtualIndex={4}>
            <RNG />
          </SwiperSlide>
          <SwiperSlide key={5} virtualIndex={5}>
            <Home />
          </SwiperSlide>
        </Swiper>
      </Box>
      <Footer />
      <PopupMakeTransfer />
    </LayoutMobile>
  );
};

export default HomeMobile;
