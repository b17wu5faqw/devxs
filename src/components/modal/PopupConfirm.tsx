import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import NewButton from "../button/NewButton";
import CustomText from "../text/CustomText";
import { memo } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import ButtonCancel from "../button/ButtonCancel";
import Flex from "../utils/Flex";

interface PopupConfirmProps {
  drawName: string;
  drawNo: string;
  title: string;
  numbers: number[];
  betChip: number;
  totalChip: number;
  rate: number;
  prizeRate: number;
  totalPrize: number;
  disabled?: boolean;
  onConfirm: () => void;
}

const PopupConfirm: React.FC<PopupConfirmProps> = ({
  drawName,
  drawNo,
  title,
  numbers,
  betChip,
  totalChip,
  rate,
  prizeRate,
  totalPrize,
  disabled,
  onConfirm,
}) => {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.CONFIRM));
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
            backgroundColor: "#3088e2",
          }}
        >
          {drawName} : Số kỳ <span className="text-[#ffc800]">{drawNo}</span>
        </CustomText>
        <Box>
          <CustomText
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "10px",
              color: "#666",
            }}
          >
            {title}
          </CustomText>
          <hr />
          <Flex
            sx={{
              paddingLeft: "6.5%",
              paddingTop: "2%",
              paddingBottom: "2%",
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            {numbers?.map((item) => (
              <CustomText
                key={item}
                sx={{
                  fontSize: "0.9em",
                  fontWeight: "600",
                  textAlign: "left",
                  padding: "4px 10px",
                  color: "#0078ff",
                  width: "48%",
                  margin: "5px 0",
                }}
              >
                {item} <span className="text-[#656565]">@</span>{" "}
                <span className="text-[#f00]">{prizeRate}</span>
              </CustomText>
            ))}
          </Flex>
          <hr />
          <CustomText
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            Gồm <span className="text-[#3287e4]">{numbers.length}</span> đơn
          </CustomText>
          <CustomText
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            Tiền cược: <span className="text-[#f00]">{betChip}</span>{" "}
            <span className="text-[#3287e4]">X{rate}</span>
          </CustomText>
          <CustomText
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            T.tiền cược: <span className="text-[20px]">{totalChip}</span>
          </CustomText>
          <hr />
          <CustomText
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            Tỉ lệ : <span className="text-[#f00]">{prizeRate}</span>
          </CustomText>
          <CustomText
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            Tiền thắng: <span className="text-[#000]">{totalPrize}</span>
          </CustomText>
        </Box>
        <Flex sx={{ gap: "20px", justifyContent: "center", padding: "10px" }}>
          <ButtonCancel
            sx={{ flex: 1 }}
            onClick={() => closeModal()}
          >
            Hủy
          </ButtonCancel>
          <ButtonConfirm
            onClick={onConfirm}
            sx={{ flex: 1 }}
            disabled={disabled}
          >
            Xác nhận
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default memo(PopupConfirm);
