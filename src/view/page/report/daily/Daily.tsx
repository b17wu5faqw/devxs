"use client";
import useDetect from "@/hooks/useDetect";
import DailyReportDesktop from "./desktop";
import DailyReportMobile from "./mobile";

const Daily = () => {
  const { isMobile } = useDetect();
  if (isMobile) return <DailyReportMobile />;
  return <DailyReportDesktop />;
};

export default Daily;
