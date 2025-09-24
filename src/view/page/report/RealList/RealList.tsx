"use client";
import useDetect from "@/hooks/useDetect";
import RealListMobile from "./mobile";
import RealListDesktop from "./desktop";

const Report = () => {
  const { isMobile } = useDetect();
  if (isMobile) return <RealListMobile />;
  return <RealListDesktop />;
};

export default Report;
