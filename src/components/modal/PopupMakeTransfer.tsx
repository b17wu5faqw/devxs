import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow, TextField, Typography } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import NewButton from "../button/NewButton";
import CustomText from "../text/CustomText";
import { memo, useEffect, useState } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import ButtonCancel from "../button/ButtonCancel";
import Flex from "../utils/Flex";
import { useAuthStore } from "@/stores/authStore";
import { getMainBalance, makeTransfer } from "@/apis/account";
import useBalanceStore from "@/stores/balanceStore";
import { a } from "framer-motion/client";

const PopupMakeTransfer = () => {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.MAKE_TRANSFER)
  );
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal(MODAL.MAKE_TRANSFER);
    setAmount("");
    setError("");
  };

  // Get balance data from your store
  // const mainBalance = useBalanceStore((state) => state.balance);
  // const gameBalance = useBalanceStore((state) => state.gameBalance);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);

  // Get access token for API calls
  const { accessToken } = useAuthStore();

  // State for transfer amount
  const [mainBalance, setMainBalance] = useState<number>(0);
  const [gameBalance, setGameBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch main balance when component opens
  useEffect(() => {
    if (isOpen && accessToken) {
      fetchBalances();
    }
  }, [isOpen, accessToken]);

  // Function to fetch balances
  const fetchBalances = async () => {
    try {
      setIsLoading(true);

      // Fetch main balance using the API function
      const response = await getMainBalance({ jwt_key: accessToken || "" });

      if (response && response.status === 1) {
        setMainBalance(response.data?.main_balance || 0);
        setGameBalance(response.data?.balance || 0);
      } else {
        setError("Không thể tải thông tin số dư");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Lỗi kết nối máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = event.target.value.replace(/\D/g, "");
    if (value && parseInt(value) > mainBalance) {
      setAmount(mainBalance.toString());
    } else {
      setAmount(value);
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleTransferMax = () => {
    setAmount(mainBalance.toString());
  };

  const handleTransfer = async () => {
    // Validate amount
    if (!amount || parseInt(amount) <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (parseInt(amount) > mainBalance) {
      setError("Số dư không đủ");
      return;
    }

    try {
      setIsTransferring(true);

      // Call your transfer API here
      const response = await makeTransfer({
        type: 0,
        amount: parseInt(amount),
        jwt_key: accessToken || "",
      });

      if (response.status === 1) {
        // Success - update balances
        setAmount("");
        await fetchBalances();
        await fetchBalance();
      } else {
        // API returned error
        setError(response.description || "Có lỗi xảy ra khi chuyển tiền");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setIsTransferring(false);
    }
  };

  // Add this function to handle game-to-main transfers
  const handleGameToMainTransfer = async () => {
    if (gameBalance <= 0) {
      setError("Không có số dư game để chuyển");
      return;
    }

    try {
      setIsTransferring(true);

      // Call your API for game-to-main transfer
      // This might be a different endpoint or use different parameters
      const response = await makeTransfer({
        type: 1,
        amount: gameBalance, // Transfer all game balance
        jwt_key: accessToken || "",
      });

      if (response.status === 1) {
        await fetchBalances();
      } else {
        // API returned error
        setError(response.description || "Có lỗi xảy ra khi chuyển tiền");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "500px" },
          minWidth: { xs: "90vw", md: "500px" },
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
            fontSize: "18px",
            fontWeight: "600",
            textAlign: "center",
            color: "#5aaaf3",
            padding: "10px",
            lineHeight: "34px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          Chuyển khoản nhanh
        </CustomText>
        <Flex
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: "10px",
            top: "10px",
            background: "url(/images/main/btn_close_ku.svg) no-repeat center",
            backgroundSize: "auto 55%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            opacity: "0.47",
          }}
        />
        <Flex
          sx={{
            padding: "16px",
            borderBottom: "1px solid #e5e5e5",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              sx={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}
            >
              TK chính
            </Typography>
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: 600,
                border: "1px solid #dadada",
                textAlign: "left",
                color: "#1ba200",
                lineHeight: "1em",
                height: "45px",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isLoading ? "Đang tải..." : mainBalance.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              background:
                "url(/images/main/icon_arrowBlue.svg) no-repeat center",
              width: "20px",
              height: "20px",
              backgroundSize: "100% auto",
              flex: "none",
              marginTop: "30px",
            }}
          />
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              sx={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}
            >
              KU Xổ Số
            </Typography>
            <Typography
              sx={{
                fontSize: "19px",
                fontWeight: 600,
                border: "1px solid #dadada",
                textAlign: "left",
                color: "#1ba200",
                lineHeight: "1em",
                height: "45px",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isLoading ? "Đang tải..." : gameBalance.toLocaleString()}
            </Typography>
          </Box>
        </Flex>
        <Flex
          sx={{
            padding: "16px",
            alignItems: "flex-start",
            flexDirection: { xs: "column", sm: "row" },
            gap: "10px",
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <TextField
              fullWidth
              placeholder="Nhập số điểm"
              value={amount}
              onChange={handleAmountChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { padding: "8px 12px" },
              }}
              error={!!error}
              helperText={error}
              disabled={isLoading || isTransferring || mainBalance <= 0}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3088e2",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3088e2",
                    borderWidth: "1px",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#f5f5f5",
                    color: "#aaa",
                  },
                },
              }}
            />
          </Box>

          <Flex
            sx={{
              flex: 1,
              alignItems: "flex-end",
              gap: "10px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <ButtonConfirm
              onClick={handleTransfer}
              disabled={isLoading || isTransferring || !amount}
              sx={{
                flex: 1,
                height: "45px",
                borderRadius: "3px",
                textTransform: "unset",
                backgroundColor: "#3e6493",
                "&.Mui-disabled": {
                  backgroundColor: "#aaa",
                  color: "#fff",
                },
              }}
            >
              {isTransferring ? "Đang xử lý..." : "Xác nhận"}
            </ButtonConfirm>

            <ButtonCancel
              onClick={handleTransferMax}
              disabled={isLoading || isTransferring || mainBalance <= 0}
              sx={{
                flex: 1,
                height: "45px",
                borderRadius: "3px",
                backgroundColor: "#4ca287",
                color: "#fff",
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "#e0f0ff",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#aaa",
                  color: "#fff",
                },
              }}
            >
              Chuyển hết
            </ButtonCancel>
          </Flex>
        </Flex>
        <Flex
          sx={{
            justifyContent: "center",
            padding: "16px",
            borderTop: "1px solid #e5e5e5",
            width: "100%",
          }}
        >
          <ButtonCancel
            disabled={isLoading || isTransferring || gameBalance <= 0}
            onClick={handleGameToMainTransfer}
            sx={{
              color: "#3e6493",
              border: "1px solid #3e6493",
              backgroundColor: "transparent",
              borderRadius: "0",
              fontSize: { xs: "14px", md: "16px" },
              height: "45px",
              lineHeight: "45px",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              "&:hover": {
                backgroundColor: "#e2e8ef",
              },
              "&.Mui-disabled": {
                color: "#aaa",
                borderColor: "#ddd",
                backgroundColor: "#f5f5f5",
                cursor: "default",
              },
            }}
          >
            KU Xổ Số chuyển về tài khoản chính
          </ButtonCancel>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default memo(PopupMakeTransfer);
