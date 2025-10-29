import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import { useEffect } from "react";

interface PopupBettingClosedProps {
  drawNo?: string;
}

const PopupBettingClosed: React.FC<PopupBettingClosedProps> = ({ drawNo }) => {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.BETTING_CLOSED));
  const closeModal = useModalStore((state) => state.closeModal);

  const handleClose = () => {
    closeModal();
  };

  // Tự động đóng sau 2 giây
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      closeModal();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen, closeModal]);

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "310px" },
          maxHeight: { xs: "100dvh", md: "90vh" },
          background: "rgba(0, 0, 0, 0.8)", // Background đen mờ
          position: "relative",
          overflow: "hidden",
          border: "1px solid #ccc", // Border xám nhẹ
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

        <Box sx={{ textAlign: "center", padding: "20px 0" }}>
          <CustomText
            sx={{
              fontSize: "20px",
              color: "#ff0000", // Chữ đỏ
              fontWeight: "600",
              marginBottom: "8px"
            }}
          >
            KY{new Date().toLocaleDateString('en-GB').replace(/\//g, '').slice(0, 6)}{drawNo || "0367"}
          </CustomText>
          <CustomText
            sx={{
              fontSize: "18px",
              color: "#ff0000", // Chữ đỏ
              fontWeight: "600"
            }}
          >
            Kèo đã đóng
          </CustomText>
        </Box>
      </FlexReverse>
    </Dialog>
  );
};

export default PopupBettingClosed;
