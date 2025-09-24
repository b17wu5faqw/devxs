"use client";
import useDetect from "@/hooks/useDetect";
import HomeDesktop from "./desktop/LotteryResult";

const Index = () => {
  const { isMobile } = useDetect();
  if (!isMobile) return <HomeDesktop />;
};

export default Index;
