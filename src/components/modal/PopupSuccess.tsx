import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import { useEffect, useState } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import Flex from "../utils/Flex";

function PopupSuccess() {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.SUCCESS));
  const closeModal = useModalStore((state) => state.closeModal);
  const [countdown, setCountdown] = useState(5);
  const handleClose = () => {
    closeModal(MODAL.SUCCESS);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          closeModal(MODAL.SUCCESS);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen]);

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
      <FlexReverse
        sx={{
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <CustomText
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#119C59",
          }}
        >
          Đặc cược hoàn tất
        </CustomText>
        <Box sx={{ textAlign: "center", padding: "20px 0" }}>
          <CustomText sx={{ fontSize: "17px", color: "#000" }}>
            Xin vui lòng đến
          </CustomText>
          <CustomText
            sx={{ fontSize: "20px", color: "#3C97E7", fontWeight: "600" }}
          >
            "Lịch sử đặt cược"
          </CustomText>
          <CustomText sx={{ fontSize: "17px", color: "#000" }}>
            để kiểm tra
          </CustomText>
        </Box>
        <hr />
        <Flex sx={{ gap: "20px", justifyContent: "center", padding: "10px" }}>
          <ButtonConfirm
            onClick={() => closeModal(MODAL.SUCCESS)}
            sx={{ width: "130px", fontWeight: "600" }}
          >
            Xác nhận <span className="text-[#FFC800] ml-1">({countdown})</span>
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
}

export default PopupSuccess;
