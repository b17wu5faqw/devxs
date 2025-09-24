"use client";

import Img from "@/components/img/Img";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box
      sx={{
        background: "url(images/main/PC_bg.jpg) no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        position: "relative",
      }}
    >
      <Flex
        sx={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          height: "100%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Img url="/images/main/img_top.png" sx={{}} />
        <Img url="/images/logo/logo_onlyPage.svg" sx={{}} />
        <Box sx={{ textAlign: "center" }}>
          <CustomText
            sx={{ color: "#fff", fontSize: "28px", fontWeight: "bold" }}
          >
            Xác nhận thất bại, vui lòng đăng nhập lại！
          </CustomText>
          <CustomText
            sx={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}
          >
            Phân tích thông tin đăng nhập thất bại
          </CustomText>
        </Box>
        <Img url="/images/main/img_bottom.png" sx={{}} />
      </Flex>
    </Box>
  );
};

export default Home;
