"use client";
import Sidebar from "@/view/page/home/desktop/sidebar/Sidebar";
import ChatBox from "@/view/page/home/desktop/chatbox/ChatBox";
import Right from "@/view/page/home/desktop/right/Right";
import Flex from "@/components/utils/Flex";
import LayoutDesktop from "@/layout/LayoutDesktop";
import XocDiaKUContent from "./XocDiaKUContent";

const HomeDesktop = () => {
  return (
    <LayoutDesktop>
      <Flex sx={{ justifyContent: "start", alignItems: "start" }}>
        <Sidebar />
        <XocDiaKUContent />
        <ChatBox />
        <Right />
      </Flex>
    </LayoutDesktop>
  );
};

export default HomeDesktop;
