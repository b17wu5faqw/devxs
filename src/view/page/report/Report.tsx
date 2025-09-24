"use client";
import useDetect from "@/hooks/useDetect";
import ReportDesktop from "./desktop";
import ReportMobile from "./mobile";

const Report = () => {
  const { isMobile } = useDetect();
  if (isMobile) return <ReportMobile />;
  return <ReportDesktop />;
};

export default Report;
