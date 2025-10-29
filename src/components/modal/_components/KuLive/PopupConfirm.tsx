import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "@/components/utils/FlexReverse";
import CustomText from "@/components/text/CustomText";
import { memo } from "react";
import ButtonConfirm from "@/components/button/ButtonConfirm";
import ButtonCancel from "@/components/button/ButtonCancel";
import Flex from "@/components/utils/Flex";

interface PopupConfirmProps {
  drawName: string;
  drawNo: string;
  title: string;
  numbers: string[];
  inputType: number;
  betChip: number;
  totalChip: number;
  rate: number;
  prizeRate: number;
  totalPrize: number;
  drawCount: number;
  lottoType: number;
  disabled?: boolean;
  onConfirm: () => void;
}

const PopupConfirm: React.FC<PopupConfirmProps> = ({
  drawName,
  drawNo,
  title,
  numbers,
  inputType,
  betChip,
  totalChip,
  rate,
  prizeRate,
  totalPrize,
  drawCount,
  lottoType,
  disabled,
  onConfirm,
}) => {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.CONFIRM_LIVE)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
  };

  const formatNumbersForDisplay = (
    numbers: string[],
    inputType?: number
  ): string => {
    if (inputType === 5) {
      return numbers
        .map((item) => {
          const [key, values] = item.split(":");
          const keyMap: { [key: string]: string } = {
            cngan: "C.ngàn",
            ngan: "Ngàn",
            tram: "Trăm",
            chuc: "Chục",
            donvi: "Đơn vị",
          };
          return `${keyMap[key] || key}: ${values}`;
        })
        .join(" | ");
    }
    return numbers.join(", ");
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
            {formatNumbersForDisplay(numbers, inputType === 5 ? 5 : undefined)}
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
          {lottoType == 2 && (
            <CustomText
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "left",
                padding: "4px 10px",
                color: "#666",
              }}
            >
              Kỳ liên tiếp: <span className="text-[#f00]">{drawCount}</span>{" "}
            </CustomText>
          )}
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
          <ButtonCancel sx={{ flex: 1 }} onClick={() => closeModal()}>
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
