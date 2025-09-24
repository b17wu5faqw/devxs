"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "@/layout/header/Header";
import { Box } from "@mui/material";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import useDetect from "@/hooks/useDetect";
import PopupGame from "@/components/modal/PopupGame";
import PopupNetwordError from "@/components/modal/PopupNetwordError";
import useBalanceStore from "@/stores/balanceStore";
import PopupGameLo from "@/components/modal/PopupGameLo";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad);
  const router = useRouter();
  const { setAccessToken, accessToken } = useAuthStore();
  const token = useSearchParams().get("access_token");
  const { isMobile } = useDetect();
  const user = useAuthStore((state) => state.user);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }

      if (!storedToken && !accessToken) {
        setTimeout(() => {
          router.push("/error");
        }, 5000);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (!user) return;
    fetchBalance();
    const interval = setInterval(() => {
      fetchBalance();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, fetchBalance]);

  useEffect(() => {
    async function LoadGlobalStateBeforeRender() {
      await checkAuthOnLoad();
    }
    LoadGlobalStateBeforeRender();
  }, [checkAuthOnLoad]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <Flex
        sx={{
          background: "url(/images/main/PC_bg_vn.jpg) no-repeat",
          backgroundSize: "cover",
          height: "100vh",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: "50px",
            left: "10%",
            transform: "translateX(0)",
            textAlign: "center",
          }}
        >
          <CustomText
            sx={{
              fontSize: isMobile ? "22px" : "50px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Mạng xổ số uy tín nhất ngành
          </CustomText>
          <CustomText
            sx={{
              fontSize: isMobile ? "16px" : "20px",
              color: "white",
            }}
          >
            Đang đổi đường truyền ...
          </CustomText>
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <PopupGame />
      <PopupGameLo />
      <PopupNetwordError />
      <div>{children}</div>
    </>
  );
};

export default MainLayout;
