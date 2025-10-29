import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Button, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import NewButton from "../button/NewButton";
import CustomText from "../text/CustomText";
import { memo, useEffect, useState } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import ButtonCancel from "../button/ButtonCancel";
import Flex from "../utils/Flex";
import { ChipButton } from "../button/CustomButton";
import { sellLotto } from "@/apis/lotto";
import { useAuthStore } from "@/stores/authStore";

interface PopupConfirmProps {
  drawName: string;
  drawId: number;
  drawNo: string;
  subtypeId: number;
  title: string;
  inputType: number;
  numbers: string[];
  betChip: number;
  totalChip: number;
  rate: number;
  prizeRate: number;
  totalPrize: number;
  maxBet: number;
  disabled?: boolean;
  externalOpen?: boolean;
  externalOnClose?: () => void;
  onConfirm: (totalChip: number, betChip: number) => void;
}

const PopupConfirmMobile: React.FC<PopupConfirmProps> = ({
  drawName,
  drawId,
  drawNo,
  subtypeId,
  inputType,
  title,
  numbers,
  betChip: initialBetChip,
  totalChip: initialTotalChip,
  rate,
  prizeRate,
  maxBet,
  totalPrize: initialTotalPrice,
  disabled,
  externalOpen,
  externalOnClose,
  onConfirm,
}) => {
  const [betChip, setBetChip] = useState(initialBetChip || 0);
  const [totalChip, setTotalChip] = useState(initialTotalChip || 0);
  const [totalPrize, setTotalPrize] = useState(initialTotalPrice || 0);
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.CONFIRM));
  const { accessToken } = useAuthStore();
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  
  const handleClose = () => {
        if (externalOnClose) {
            externalOnClose();
        } else {
            closeModal();
        }
    };

  const handleClickChip = (num: number) => {
    setBetChip((prev) => {
      const newValue = prev + num;
      if (maxBet && newValue > maxBet) {
        return maxBet;
      }
      return newValue;
    });
    const total = betChip * (rate ? Number(rate) : 0);
    setTotalChip(total);
  };

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setBetChip(0);
      return;
    }

    const numValue = Number(newValue);
    if (!isNaN(numValue)) {
      if (maxBet && numValue > maxBet) {
        setBetChip(maxBet);
      } else {
        setBetChip(numValue);
      }
    }
  };

  const handleConfirm = () => {
    setBetChip(0);
    onConfirm(totalChip, betChip);
  };

  useEffect(() => {
    setTotalChip(betChip * (rate ? Number(rate) : 0) * Number(numbers.length));
  }, [betChip, numbers]);

  useEffect(() => {
    setTotalPrize(totalChip * (prizeRate ? Number(prizeRate) : 0));
  }, [totalChip]);

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
          position: "relative",
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
          }}
        >
          {drawName} kỳ{" "}
          <span className="text-[#fff600] font-bold">{drawNo}</span>
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
        <Box>
          <CustomText
            sx={{
              fontSize: "1em",
              fontWeight: "600",
              textAlign: "center",
              padding: "2% 0",
              color: "#6077a1",
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
                  fontWeight: "500",
                  textAlign: "left",
                  padding: "4px 5px",
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
          <Flex
            sx={{
              position: "relative",
              justifyContent: "flex-start",
              lineHeight: "40px",
              padding: "2% 3.5%",
              fontSize: "0.95em",
            }}
          >
            <label className="text-sm" style={{ width: "50%" }}>
              Tiền cược：
              <input
                value={betChip}
                onChange={handleChange}
                style={{
                  height: "2em",
                  fontSize: "1.22em",
                  width: "50%",
                  border: "1px solid #b3b3b3",
                  borderRadius: "5px",
                  padding: "0 2%",
                  fontWeight: "bold",
                }}
              />
            </label>
            <CustomText sx={{ fontSize: "1em" }}>X{rate}</CustomText>
          </Flex>
          <Flex sx={{ border: "1px solid #d9d9d9" }}>
            <ChipButton
              onClick={() => handleClickChip(1)}
              sx={{
                background: "url(/images/main/icon_chip1.png) no-repeat center",
                backgroundSize: "auto 80%",
              }}
            >
              1
            </ChipButton>
            <ChipButton
              onClick={() => handleClickChip(5)}
              sx={{
                background: "url(/images/main/icon_chip5.png) no-repeat center",
                backgroundSize: "auto 80%",
              }}
            >
              5
            </ChipButton>
            <ChipButton
              onClick={() => handleClickChip(10)}
              sx={{
                background:
                  "url(/images/main/icon_chip10.png) no-repeat center",
                backgroundSize: "auto 80%",
              }}
            >
              10
            </ChipButton>
            <ChipButton
              onClick={() => handleClickChip(100)}
              sx={{
                background:
                  "url(/images/main/icon_chip100.png) no-repeat center",
                backgroundSize: "auto 80%",
              }}
            >
              100
            </ChipButton>
            <ChipButton
              onClick={() => handleClickChip(500)}
              sx={{
                background:
                  "url(/images/main/icon_chip500.png) no-repeat center",
                backgroundSize: "auto 80%",
              }}
            >
              500
            </ChipButton>
            <ChipButton
              onClick={() => handleClickChip(1000)}
              sx={{
                background:
                  "url(/images/main/icon_chip1k.png) no-repeat center",
                backgroundSize: "auto 80%",
              }}
            >
              1K
            </ChipButton>
          </Flex>
          <Flex>
            <CustomText
              sx={{
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "left",
                padding: "4px 10px",
                color: "#666",
              }}
            >
              Đơn cược :<span className="text-[#3287e4]">{numbers.length}</span>
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
              Tiền cược: <span className="text-[#f00]">{totalChip}</span>
            </CustomText>
          </Flex>
          <Flex>
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
          </Flex>
        </Box>
        <Flex sx={{ gap: "10px", justifyContent: "center", padding: "10px" }}>
          <ButtonCancel
            sx={{ borderRadius: "3px", width: "40%" }}
            onClick={() => setBetChip(0)}
          >
            Xóa
          </ButtonCancel>
          <ButtonConfirm
            disabled={disabled || totalChip == 0}
            onClick={handleConfirm}
            sx={{ borderRadius: "3px", width: "60%" }}
          >
            Xác nhận đặt cược
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default memo(PopupConfirmMobile);
