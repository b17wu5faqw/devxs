import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import ButtonConfirm from "../button/ButtonConfirm";
import Flex from "../utils/Flex";

interface PopupErrorProps {
  message: string;
}

const PopupError: React.FC<PopupErrorProps> = ({ message }) => {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.ERROR));
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
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
            backgroundColor: "#fd9324",
          }}
        >
          Chú ý
        </CustomText>
        <Box sx={{ textAlign: "center", padding: "20px 0" }}>
          <CustomText sx={{ fontSize: "17px", color: "#f00" }}>
            {message}
          </CustomText>
        </Box>
        <hr />
        <Flex sx={{ gap: "20px", justifyContent: "center", padding: "10px" }}>
          <ButtonConfirm
            onClick={() => closeModal()}
            sx={{ width: "130px", fontWeight: "600" }}
          >
            Đóng
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default PopupError;
