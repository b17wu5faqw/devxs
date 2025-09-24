"use client";
import Sidebar from "@/view/page/home/desktop/sidebar/Sidebar";
import Main from "@/view/page/home/desktop/main/Main";
import ChatBox from "@/view/page/home/desktop/chatbox/ChatBox";
import Right from "@/view/page/home/desktop/right/Right";
import Flex from "@/components/utils/Flex";
import LayoutDesktop from "@/layout/LayoutDesktop";

const HomeDesktop = () => {
  return (
    <LayoutDesktop>
      <Flex sx={{ justifyContent: "start", alignItems: "start" }}>
        <Sidebar />
        <Main />
        <ChatBox />
        <Right />
      </Flex>
    </LayoutDesktop>
  );
};

export default HomeDesktop;
