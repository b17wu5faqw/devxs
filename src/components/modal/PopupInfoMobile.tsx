import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import { memo } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import Flex from "../utils/Flex";

interface PopupConfirmProps {
  duplicates: string[];
  onConfirm: () => void;
}

const PopupInfoMobile: React.FC<PopupConfirmProps> = ({
  duplicates,
  onConfirm,
}) => {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.INFO_MOBILE));
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const handleClose = () => {
    closeModal();
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "70vw", md: "310px" },
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
          padding: "5px",
        }}
      >
        <CustomText
          sx={{
            fontSize: "1.1em",
            fontWeight: "500",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#206B61",
            height: "45px",
            borderRadius: "5px",
          }}
        >
          Chú ý
        </CustomText>
        <CustomText
          sx={{
            margin: "15px 0 20px 0",
            textAlign: "center",
            color: "#f00",
            fontSize: "16px",
          }}
        >
          Số không đúng, đã sàng lọc {duplicates.join(", ")}
        </CustomText>
        <Flex
          sx={{
            gap: "20px",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <ButtonConfirm
            onClick={onConfirm}
            sx={{
              flex: 1,
              backgroundColor: "#69ac8e",
              height: "55px",
              lineHeight: "55px",
              fontSize: "1.2em",
              borderRadius: "8px",
              textTransform:'none'
            }}
          >
            Xác nhận
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default memo(PopupInfoMobile);
