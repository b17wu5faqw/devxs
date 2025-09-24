import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import { memo, useMemo } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import ButtonCancel from "../button/ButtonCancel";
import Flex from "../utils/Flex";

interface PopupConfirmProps {
  drawName: string;
  drawNo: string;
  title: string;
  sets: { numbers: string; betAmount: string }[];
  totalAmount: number;
  type: number;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

const PopupLoTruotConfirm: React.FC<PopupConfirmProps> = ({
  drawName,
  drawNo,
  title,
  sets,
  totalAmount,
  type,
  onConfirm,
  isSubmitting,
}) => {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.LO_TRUOT_CONFIRM)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal(MODAL.LO_TRUOT_CONFIRM);
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  const getPrizeRate = (numberCount: number): string => {
    switch (numberCount) {
      case 4:
        return "2.02";
      case 5:
        return "2.44";
      case 6:
        return "2.95";
      case 7:
        return "3.58";
      case 8:
        return "4.34";
      case 9:
        return "5.25";
      case 10:
        return "6.4";
      default:
        return "2.02";
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "410px" },
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
            fontWeight: "600",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#3088e2",
          }}
        >
          {drawName} : Số kỳ <span className="text-[#ffc800]">{drawNo}</span>
        </CustomText>
        <Box>
          <Flex
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <CustomText
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "left",
                  padding: "10px 20px 0",
                  color: "#666",
                  backgroundColor: "#f5f9ff",
                }}
              >
                {title}
              </CustomText>
              <Flex
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  paddingBottom: "10px",
                }}
              >
                {sets.map((set, index) => (
                  <Flex
                    key={index}
                    sx={{
                      fontSize: "0.96em",
                      fontWeight: "600",
                      textAlign: "left",
                      padding: "0 20px",
                      color: "#0078ff",
                      width: "auto",
                      margin: "5px 0",
                    }}
                  >
                    {set.numbers} <span className="text-[#999]">@</span>
                    <span className="text-[#f00]">
                      {getPrizeRate(type)}
                    </span>
                    <span className="text-[#000]">${set.betAmount}</span>
                  </Flex>
                ))}
              </Flex>
              <hr />
            </Box>
          </Flex>
          <hr />
          <CustomText
            sx={{
              fontSize: "15px",
              fontWeight: "600",
              textAlign: "left",
              padding: "6px 10px 0",
              color: "#666",
            }}
          >
            Gồm <span className="text-[#3287e4]">{sets.length}</span> đơn
          </CustomText>
          <CustomText
            sx={{
              fontSize: "15px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            T.tiền cược:{" "}
            <span className="text-[20px] text-[#000]">{totalAmount}</span>
          </CustomText>
        </Box>
        <Flex sx={{ gap: "20px", justifyContent: "center", padding: "10px" }}>
          <ButtonCancel
            sx={{ flex: 1, fontWeight: "bold" }}
            onClick={() => handleClose()}
          >
            Hủy
          </ButtonCancel>
          <ButtonConfirm
            onClick={handleConfirm}
            disabled={isSubmitting}
            sx={{ flex: 1, fontWeight: "bold" }}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default memo(PopupLoTruotConfirm);
