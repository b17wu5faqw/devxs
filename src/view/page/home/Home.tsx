"use client";
import useDetect from "@/hooks/useDetect";
import HomeDesktop from "./desktop/HomeDesktop";
import HomeMobile from "./mobile/HomeMobile";

const Home = () => {
  const { isMobile } = useDetect();
  if (isMobile) return <HomeMobile />;
  return <HomeDesktop />;
};

export default Home;
