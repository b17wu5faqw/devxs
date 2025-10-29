import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Button, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import Flex from "../utils/Flex";
import { useCallback, useEffect, useState } from "react";
import { getVnLotto } from "@/apis/menu";
import Menu from "../menu-item/mobile/Menu";
import { useRouter } from "next/navigation";
import { CustomButton2 } from "../button/CustomButton";

interface MenuItemType {
  id: number;
  lotto_type: number;
  name: string;
  time: string;
}

type Button = {
  id: number;
  help: string;
  name: string;
};

type ButtonGroup = {
  groupTitle: string;
  buttons: Button[];
};

interface TabProps {
  tabActive: ButtonGroup[];
  selectedButton: number;
  onChangeType: (button: Button) => void;
}

function PopupKuLiveType({ tabActive, selectedButton, onChangeType }: TabProps) {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.KU_LIVE_TYPE));
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
  };

  const router = useRouter();

  const handleNavigate = (id: number) => {
    closeModal();
    router.push(`/game/VnLotto/${id}`);
  };

  const [vnLottoMenu, setVnLottoMenu] = useState<MenuItemType[]>([]);

  const fetch = useCallback(async () => {
    const resp = await getVnLotto();
    setVnLottoMenu(resp.data);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleButtonClick = (button: Button) => {
    onChangeType(button);
    closeModal();
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "310px" },
          maxHeight: { xs: "100dvh", md: "90vh" },
          background:
            "linear-gradient(137.93deg, rgba(97,206,255,.024) 7.21%,#f6faff 49.31%,rgba(97,206,255,.024) 96.05%),#fff",
          position: "relative",
          overflow: "hidden",
        },
      }}
      open={isOpen}
      TransitionComponent={Grow}
      onClose={handleClose}
    >
      <Box
        onClick={handleClose}
        sx={{
          background: "url(/images/main/Pop_btn_close.svg) no-repeat center",
          position: "absolute",
          top: "-40px",
          right: "5px",
          width: "30px",
          height: "30px",
          backgroundSize: "100%",
          cursor: "pointer",
          opacity: "0.8",
        }}
      />
      <Box sx={{ position: "relative" }}>
        <CustomText
          sx={{
            backgroundColor: "#206B61",
            height: "40px",
            fontWeight: "bold",
            lineHeight: "40px",
            borderRadius: "8px 8px 0 0",
            textAlign: "center",
            color: "#fff",
          }}
        >
          Cách chơi
        </CustomText>
        <Flex
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: "10px",
            top: "5px",
            background: "url(/images/main/icon_close.png) no-repeat center",
            backgroundSize: "auto 55%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            opacity: "0.8",
          }}
        />
      </Box>
      <Box>
        <FlexReverse
          sx={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {tabActive &&
            tabActive.map((group, index) => (
              <Box sx={{ paddingBottom: "10px" }} key={index}>
                <CustomText
                  sx={{
                    color: "#1d845b",
                    textAlign: "left",
                    position: "relative",
                    fontSize: "0.85em",
                    paddingLeft: "25px",
                    "&:before": {
                      content: "''",
                      width: "6px",
                      height: "6px",
                      background: "#8ec1ad",
                      position: "absolute",
                      left: "10px",
                      top: "0",
                      bottom: "0",
                      margin: "auto 0",
                    },
                  }}
                >
                  {group.groupTitle}
                </CustomText>
                <Flex
                  key={index}
                  sx={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    padding: "10px 0 0 10px",
                    flexWrap: "wrap",
                  }}
                >
                  {group.buttons.map((button) => (
                    <CustomText
                      onClick={() => handleButtonClick(button)}
                      sx={{
                        width: "48%",
                        position: "relative",
                        height: "45px",
                        fontSize: "0.85em",
                        border:
                          selectedButton === button.id
                            ? "1px solid #8ec1ae"
                            : "1px solid #cccccc",
                        borderRadius: "5px",
                        textAlign: "center",
                        lineHeight: "45px",
                        backgroundColor:
                          selectedButton === button.id ? "#dcfef0" : "",
                      }}
                      key={button.id}
                    >
                      {button.name}
                    </CustomText>
                  ))}
                </Flex>
              </Box>
            ))}
        </FlexReverse>
      </Box>
    </Dialog>
  );
}

export default PopupKuLiveType;
