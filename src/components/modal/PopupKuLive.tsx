import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import { useCallback, useEffect, useState } from "react";
import { getLoKu } from "@/apis/menu";
import Menu from "../menu-item/mobile/Menu";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/stores/useMenuStore";
import Flex from "../utils/Flex";
import Img from "../img/Img";

interface MenuItemType {
  id: number;
  lotto_type: number;
  region_id: number;
  name: string;
  img: string;
  time: string;
  server_time: string;
}

function PopupKuLive() {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.GAME_LIVE));
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
  };

  const router = useRouter();

  const handleNavigate = (href: string) => {
    closeModal();
    router.push(href);
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
      <FlexReverse
        sx={{
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Box sx={{ textAlign: "center", padding: "20px 20px 10px" }}>
          <Flex
            sx={{
              gap: "20px",
              // padding: "10px",
              backgroundColor: "#ECD8DD",
              marginBottom: "10px",
              borderRadius: "6px",
              height: "70px",
              alignItems: "center",
            }}
            onClick={() => handleNavigate("/game/AnyTimePoker/166")}
          >
            <Flex
              sx={{
                width: "40%",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Img
                url={`/images/live/bannerAtPoker_A.png`}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  margin: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  maxWidth: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "30px",
                  color: "#fff",
                  fontSize: "0.7em",
                  backgroundColor: "#F55BB3",
                  width: "64%",
                }}
              >
                <Img
                  url={`/images/live/icon_Vietnam.png`}
                  sx={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    left: "0",
                  }}
                />
                <span style={{ marginLeft: "15px" }}>Susan</span>
              </Box>
            </Flex>
            <Flex
              sx={{
                width: "58%",
                paddingLeft: "calc(6px + 5%)",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <CustomText
                sx={{ fontSize: "0.9em", fontWeight: "bold", color: "#000" }}
              >
                Live A
              </CustomText>
              <CustomText sx={{ cursor: "pointer" }}>00:00</CustomText>
            </Flex>
          </Flex>
        </Box>
        <Box sx={{ textAlign: "center", padding: "0 20px 10px" }}>
          <Flex
            sx={{
              gap: "20px",
              // padding: "10px",
              backgroundColor: "#ECD8DD",
              marginBottom: "10px",
              borderRadius: "6px",
              height: "70px",
              alignItems: "center",
            }}
            onClick={() => handleNavigate("/game/AnyTimePoker/167")}
          >
            <Flex
              sx={{
                width: "40%",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Img
                url={`/images/live/bannerAtPoker_B.png`}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  margin: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  maxWidth: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "30px",
                  color: "#fff",
                  fontSize: "0.7em",
                  backgroundColor: "#E09664",
                  width: "64%",
                }}
              >
                <Img
                  url={`/images/live/icon_Thailand.png`}
                  sx={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    left: "0",
                  }}
                />
                <span style={{ marginLeft: "15px" }}>Ronda</span>
              </Box>
            </Flex>
            <Flex
              sx={{
                width: "58%",
                paddingLeft: "calc(6px + 5%)",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <CustomText
                sx={{ fontSize: "0.9em", fontWeight: "bold", color: "#000" }}
              >
                Live B
              </CustomText>
              <CustomText sx={{ cursor: "pointer" }}>00:00</CustomText>
            </Flex>
          </Flex>
        </Box>
        <Box sx={{ textAlign: "center", padding: "20px 20px 10px" }}>
          <Flex
            sx={{
              gap: "20px",
              // padding: "10px",
              backgroundColor: "#ECD8DD",
              marginBottom: "10px",
              borderRadius: "6px",
              height: "70px",
              alignItems: "center",
            }}
            onClick={() => handleNavigate("/game/AnyTime/162")}
          >
            <Flex
              sx={{
                width: "40%",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Img
                url={`/images/live/bannerAtPoker_A.png`}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  margin: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  maxWidth: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "30px",
                  color: "#fff",
                  fontSize: "0.7em",
                  backgroundColor: "#F55BB3",
                  width: "64%",
                }}
              >
                <Img
                  url={`/images/live/icon_Vietnam.png`}
                  sx={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    left: "0",
                  }}
                />
                <span style={{ marginLeft: "15px" }}>Susan</span>
              </Box>
            </Flex>
            <Flex
              sx={{
                width: "58%",
                paddingLeft: "calc(6px + 5%)",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <CustomText
                sx={{ fontSize: "0.9em", fontWeight: "bold", color: "#000" }}
              >
                Lotto A
              </CustomText>
              <CustomText sx={{ cursor: "pointer" }}>00:00</CustomText>
            </Flex>
          </Flex>
        </Box>
        <Box sx={{ textAlign: "center", padding: "0 20px 10px" }}>
          <Flex
            sx={{
              gap: "20px",
              // padding: "10px",
              backgroundColor: "#ECD8DD",
              marginBottom: "10px",
              borderRadius: "6px",
              height: "70px",
              alignItems: "center",
            }}
            onClick={() => handleNavigate("/game/AnyTime/164")}
          >
            <Flex
              sx={{
                width: "40%",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Img
                url={`/images/live/bannerAtPoker_B.png`}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  margin: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  maxWidth: "100px",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "30px",
                  color: "#fff",
                  fontSize: "0.7em",
                  backgroundColor: "#E09664",
                  width: "64%",
                }}
              >
                <Img
                  url={`/images/live/icon_Thailand.png`}
                  sx={{
                    width: "20px",
                    height: "20px",
                    position: "absolute",
                    left: "0",
                  }}
                />
                <span style={{ marginLeft: "15px" }}>Ronda</span>
              </Box>
            </Flex>
            <Flex
              sx={{
                width: "58%",
                paddingLeft: "calc(6px + 5%)",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <CustomText
                sx={{ fontSize: "0.9em", fontWeight: "bold", color: "#000" }}
              >
                Lotto C
              </CustomText>
              <CustomText sx={{ cursor: "pointer" }}>00:00</CustomText>
            </Flex>
          </Flex>
        </Box>
      </FlexReverse>
    </Dialog>
  );
}

export default PopupKuLive;
