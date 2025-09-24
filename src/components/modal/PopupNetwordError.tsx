import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import Flex from "../utils/Flex";
import ButtonConfirm from "../button/ButtonConfirm";

function PopupNetwordError() {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.NETWORK_ERROR)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal(MODAL.NETWORK_ERROR);
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
          overflow: "unset",
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
        <CustomText
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#206B61",
            borderRadius: "6px 6px 0 0",
          }}
        >
          Thông báo
        </CustomText>
        <Box sx={{ textAlign: "center", padding: "20px 0" }}>
          <CustomText sx={{ fontSize: "17px", color: "#000" }}>
            Kết nối mạng không ổn định
          </CustomText>
        </Box>
      </FlexReverse>
    </Dialog>
  );
}

export default PopupNetwordError;
