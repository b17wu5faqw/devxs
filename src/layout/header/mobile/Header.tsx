"use client";

import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import useModalStore from "@/stores/modalStore";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { MODAL } from "@/constant/modal";

const Header = ({ type, name }: { type: number; name: string }) => {
  const router = useRouter();

  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleGameModalClick = () => {
    switch (type) {
      case 1:
        openModal(MODAL.GAME);
        break;
      case 2:
        openModal(MODAL.GAME_LO);
        break;
      case 5:
        openModal(MODAL.GAME_LIVE);
        break;
      case 6:
        openModal(MODAL.GAME_LIVE);
        break;
      default:
        openModal(MODAL.GAME);
        break;
    }
  };

  const handleResultClick = () => {
    switch (type) {
      case 5:
        openModal(MODAL.KU_LIVE_RESULT);
        break;
      case 6:
        openModal(MODAL.KU_LOTTO_RESULT);
        break;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1f4733",
        height: "45px",
        borderBottom: "1px solid #35423e",
        position: "relative",
        zIndex: "99",
      }}
    >
      <Flex>
        <Flex>
          <Flex
            sx={{
              background: "url(/images/main/btn_home.svg) no-repeat center",
              backgroundSize: "auto 55%",
              width: "38px",
              height: "40px",
              cursor: "pointer",
              opacity: "0.5",
            }}
            onClick={() => router.push(`/`)}
          />
          <Flex
            sx={{
              background:
                "url(/images/main/btn_lotteryResult.svg) no-repeat center",
              backgroundSize: "auto 50%",
              width: "38px",
              height: "45px",
              cursor: "pointer",
              opacity: "0.5",
            }}
            onClick={handleResultClick}
          />
        </Flex>
        <Flex>
          <CustomText
            onClick={handleGameModalClick}
            sx={{
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "5px",
              color: "#fff",
              fontSize: " 0.95em",
              paddingRight: "30px",
              paddingLeft: "10px",
              lineHeight: "27px",
              position: "relative",
              margin: "9px auto",
              display: "inline-block",
              "&:after": {
                content: "''",
                position: "absolute",
                right: "10px",
                top: "-2px",
                bottom: "0",
                borderTop: "1.5px solid rgba(255,255,255,1)",
                borderRight: "1.5px solid rgba(255,255,255,1)",
                borderBottom: "none",
                borderLeft: "none",
                width: "8px",
                height: "8px",
                borderWidth: "2px",
                transform: "rotate(45deg)",
                margin: "auto",
              },
            }}
          >
            {name}
          </CustomText>
        </Flex>
        <Flex>
          <Flex
            sx={{
              background:
                "url(/images/main/btn_betRecord.svg) no-repeat center",
              backgroundSize: "auto 55%",
              width: "38px",
              height: "40px",
              cursor: "pointer",
              opacity: "0.5",
            }}
            onClick={() => router.push(`/history`)}
          />
          <Flex
            sx={{
              background: "url(/images/main/btn_menu.svg) no-repeat center",
              backgroundSize: "auto 50%",
              width: "38px",
              height: "45px",
              cursor: "pointer",
              opacity: "0.5",
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
