import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import {
  Box,
  Button,
  Dialog,
  Grid,
  Grow,
  Popover,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import CustomText from "../text/CustomText";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useMenuStore } from "@/stores/useMenuStore";
import useBalanceStore from "@/stores/balanceStore";
import { sellLotto } from "@/apis/lotto";
import PopupError from "../modal/PopupError";
import PopupLoXienConfirm from "../modal/PopupLoXienConfirm";
import Flex from "../utils/Flex";

interface DrawProps {
  currentDraw: any;
}

const MAX_BET_AMOUNTS = {
  XIEN_2: 5000,
  XIEN_3: 3500,
  XIEN_4: 1000,
};

const LoXien: React.FC<DrawProps> = ({ currentDraw }) => {
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.LO_XIEN));
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal(MODAL.LO_XIEN);
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState<number | string>("");
  const [completedSets, setCompletedSets] = useState<
    { numbers: string[]; betAmount: string }[]
  >([]);

  const latestInputRef = useRef<HTMLInputElement>(null);
  const [chipPopoverAnchor, setChipPopoverAnchor] =
    useState<HTMLElement | null>(null);
  const [activeSetIndex, setActiveSetIndex] = useState<number>(-1);

  const { accessToken } = useAuthStore();
  const { regionId, typeId } = useMenuStore();
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const getMaxBetAmount = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return MAX_BET_AMOUNTS.XIEN_2;
      case 1:
        return MAX_BET_AMOUNTS.XIEN_3;
      case 2:
        return MAX_BET_AMOUNTS.XIEN_4;
      default:
        return MAX_BET_AMOUNTS.XIEN_2;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset all states when modal is closed
      setSelectedTab(0);
      setSelectedNumbers([]);
      setBetAmount("");
      setCompletedSets([]);
      setCompletedSets([]);
      setChipPopoverAnchor(null);
    }
  }, [isOpen]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleNumberClick = (number: string) => {
    if (!selectedNumbers.includes(number)) {
      const newSelectedNumbers = [...selectedNumbers, number];
      const requiredNumbers = selectedTab + 2;

      if (newSelectedNumbers.length === requiredNumbers) {
        // Add the completed set to the list and reset selected numbers
        const newCompletedSets = [
          ...completedSets,
          { numbers: newSelectedNumbers, betAmount: "" },
        ];
        setCompletedSets(newCompletedSets);
        setSelectedNumbers([]);

        // Set active index to the newly created set
        const newIndex = newCompletedSets.length - 1;
        setActiveSetIndex(newIndex);

        // Use setTimeout to ensure the DOM has updated before focusing
        setTimeout(() => {
          if (latestInputRef.current) {
            latestInputRef.current.focus();
            setChipPopoverAnchor(latestInputRef.current);
          }
        }, 100);
      } else {
        setSelectedNumbers(newSelectedNumbers);
      }
    }
  };

  const handleBetAmountChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    const numberValue = parseInt(value) || 0;
    const maxAmount = getMaxBetAmount(selectedTab);

    const newCompletedSets = [...completedSets];
    newCompletedSets[index] = {
      ...newCompletedSets[index],
      betAmount: numberValue > maxAmount ? maxAmount.toString() : value,
    };
    setCompletedSets(newCompletedSets);
  };

  const handleChipClick = (amount: number) => {
    if (activeSetIndex >= 0) {
      const newCompletedSets = [...completedSets];
      const currentAmount =
        parseInt(newCompletedSets[activeSetIndex].betAmount) || 0;
      const newAmount = currentAmount + amount;
      const maxAmount = getMaxBetAmount(selectedTab);
      newCompletedSets[activeSetIndex] = {
        ...newCompletedSets[activeSetIndex],
        betAmount:
          newAmount > maxAmount ? maxAmount.toString() : newAmount.toString(),
      };

      setCompletedSets(newCompletedSets);
    }
  };

  const handleInputFocus = (
    index: number,
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setActiveSetIndex(index);
    setChipPopoverAnchor(event.currentTarget);
  };

  const handleCloseChipPopover = () => {
    setChipPopoverAnchor(null);
  };

  const handleInputBlur = () => {
    // Use a small timeout to allow chip clicks to register before closing
    setTimeout(() => {
      setChipPopoverAnchor(null);
    }, 200);
  };

  const handleCancel = () => {
    setSelectedNumbers([]);
    setCompletedSets([]);
    setChipPopoverAnchor(null);
  };

  const totalAmount = useMemo(() => {
    return completedSets.reduce(
      (sum, set) => sum + (parseInt(set.betAmount) || 0),
      0
    );
  }, [completedSets]);

  const handleSubmitBets = () => {
    if (completedSets.length === 0) {
      setMessage("Vui lòng thêm ít nhất một đơn cược");
      openModal(MODAL.ERROR);
      return;
    }

    openModal(MODAL.LO_XIEN_CONFIRM);
  };

  const handleConfirm = async () => {
    if (!currentDraw?.id) {
      setMessage("No active draw found");
      openModal(MODAL.ERROR); // You'll need to add a state for error modal
      return;
    }

    try {
      setIsSubmitting(true);

      // Process each set and submit them one by one
      for (const set of completedSets) {
        // For Xiên bets, we need different bet type IDs based on the type
        let betTypeId;
        if (regionId === 1) {
          switch (selectedTab) {
            case 0:
              betTypeId = 111;
              break;
            case 1:
              betTypeId = 112;
              break;
            case 2:
              betTypeId = 113;
              break;
            default:
              betTypeId = 111;
          }
        } else {
          switch (selectedTab) {
            case 0:
              betTypeId = 121;
              break;
            case 1:
              betTypeId = 122;
              break;
            case 2:
              betTypeId = 123;
              break;
            default:
              betTypeId = 121;
          }
        }

        // Format numbers array as digits string
        const digits = set.numbers.join(",");

        const res = await sellLotto({
          digits: digits,
          bet_point: parseInt(set.betAmount) || 0,
          amount: parseInt(set.betAmount) || 0,
          total_amount: totalAmount,
          drawId: currentDraw.id,
          betTypeId: betTypeId,
          jwt_key: accessToken ?? "",
          region_id: regionId ?? 1,
          lotto_type: typeId ?? 1,
        });

        if (res.status !== 1) {
          setMessage(res.description || `Lỗi đặt cược cho số ${digits}`);
          openModal(MODAL.ERROR);
          closeModal(MODAL.LO_XIEN_CONFIRM);
          return;
        }

        // All bets were successful
        closeModal(MODAL.LO_XIEN_CONFIRM);
        openModal(MODAL.SUCCESS);
        fetchBalance();
        handleClose();

        // Reset state
        setSelectedNumbers([]);
        setCompletedSets([]);
        setChipPopoverAnchor(null);
      }
    } catch (error: any) {
      console.error("Failed to submit bet:", error);
      setMessage(error.message || "Failed to submit bet. Please try again.");
      openModal(MODAL.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSet = (indexToDelete: number) => {
    const newCompletedSets = completedSets.filter(
      (_, index) => index !== indexToDelete
    );
    setCompletedSets(newCompletedSets);

    // Reset active set index if needed
    if (activeSetIndex === indexToDelete) {
      setActiveSetIndex(-1);
      setChipPopoverAnchor(null);
    } else if (activeSetIndex > indexToDelete) {
      // Adjust active set index if we've deleted a set before it
      setActiveSetIndex(activeSetIndex - 1);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "700px" },
          maxWidth: "700px",
          maxHeight: { xs: "100dvh", md: "90vh" },
          background:
            "linear-gradient(137.93deg, rgba(97,206,255,.024) 7.21%,#f6faff 49.31%,rgba(97,206,255,.024) 96.05%),#fff",
          position: "relative",
          overflow: "hidden",
          margin: 0,
        },
      }}
      open={isOpen}
      TransitionComponent={Grow}
      onClose={handleClose}
    >
      <Box
        sx={{
          border: "4px solid #c2ccd5",
          borderRadius: "8px",
          padding: "0 15px 15px",
        }}
      >
        <CustomText
          sx={{
            minHeight: "55px",
            lineHeight: "55px",
            borderBottom: "1px solid #bbbbbb",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Lô Xiên cược nhanh
        </CustomText>
        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: 0,
              flex: 1,
              border: "1px solid #ccc",
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const row = Math.floor(i / 10);
              const col = i % 10;
              return (
                <CustomText
                  key={i}
                  sx={{
                    width: "40px",
                    textAlign: "center",
                    lineHeight: "40px",
                    minWidth: "auto",
                    borderRadius: 0,
                    cursor: "pointer",
                    backgroundColor: selectedNumbers.includes(
                      i.toString().padStart(2, "0")
                    )
                      ? "#feb2b2"
                      : "#fff",
                    border: "none",
                    borderBottom: row < 9 ? "1px solid #ccc" : "none",
                    borderRight: col < 9 ? "1px solid #ccc" : "none",
                    "&:focus": {
                      outline: "2px solid #4bacff",
                      outlineOffset: "-2px",
                    },
                  }}
                  onClick={() =>
                    handleNumberClick(i.toString().padStart(2, "0"))
                  }
                >
                  {i.toString().padStart(2, "0")}
                </CustomText>
              );
            })}
          </Box>
          <Box
            sx={{
              width: "40%",
              position: "relative",
              justifyContent: "space-around",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                marginBottom: "20px",
                padding: "8px",
                minHeight: "auto",
                backgroundColor: "#b3d2f1",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#b3d2f1",
                  minHeight: "auto",
                },
                "& .MuiTab-root": {
                  borderRadius: "0",
                  backgroundColor: "#b3d2f1",
                  padding: "2px 10px",
                  minHeight: "auto",
                  color: "#000",
                  "&.Mui-selected": {
                    backgroundColor: "#fff",
                    color: "#0084ff",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    borderBottom: "0",
                  },
                },
              }}
            >
              <Tab label="Xiên 2" />
              <Tab label="Xiên 3" />
              <Tab label="Xiên 4" />
            </Tabs>
            <Box sx={{ marginBottom: "20px" }}>
              {completedSets.map((set, index) => (
                <Flex
                  key={index}
                  sx={{
                    marginBottom: "10px",
                    paddingLeft: "10px",
                    paddingBottom: "5px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <CustomText
                    sx={{
                      display: "block",
                      paddingRight: "10px",
                      color: "#0078ff",
                    }}
                  >
                    {set.numbers.join(", ")}
                  </CustomText>
                  <CustomText
                    sx={{
                      display: "block",
                      paddingRight: "10px",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    @{" "}
                    <span className="text-[#fe0000]">
                      {regionId === 1
                        ? set.numbers.length === 2
                          ? "17"
                          : set.numbers.length === 3
                          ? "74"
                          : "251"
                        : set.numbers.length === 2
                        ? "34"
                        : set.numbers.length === 3
                        ? "188"
                        : "970"}
                    </span>
                  </CustomText>
                  <TextField
                    placeholder="1-1000"
                    value={set.betAmount}
                    onChange={(event) => handleBetAmountChange(event, index)}
                    onFocus={(event) => handleInputFocus(index, event)}
                    // onBlur={handleInputBlur}
                    inputRef={
                      index === completedSets.length - 1 ? latestInputRef : null
                    }
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "3px",
                        backgroundColor: "#fff",
                        borderColor: "#bbbbbb",
                        padding: "0 5px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3088e2",
                        },
                        "& .MuiInputBase-input": {
                          padding: "5px",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3088e2",
                          borderWidth: "1px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                        "&.Mui-focused": {
                          color: "#3088e2",
                        },
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#c2daef",
                        top: 0,
                      },
                      "& .MuiOutlinedInput-notchedOutline legend": {
                        display: "none",
                      },
                    }}
                  />
                  <Button
                    sx={{
                      minWidth: "30px",
                      width: "30px",
                      height: "30px",
                      marginLeft: "10px",
                      color: "#ccc",
                      fontSize: "2em",
                    }}
                    onClick={() => handleDeleteSet(index)}
                  >
                    ×
                  </Button>
                </Flex>
              ))}
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                backgroundColor: "#b3d2f1",
                padding: "10px 20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <CustomText>Gồm {completedSets.length} đơn</CustomText>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  sx={{
                    backgroundColor: "#898989",
                    border: "0",
                    color: "#fff",
                  }}
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#336aab",
                    color: "#fff",
                    "&.Mui-disabled": {
                      backgroundColor: "gray",
                      color: "#fff",
                    },
                  }}
                  variant="contained"
                  onClick={handleSubmitBets}
                  disabled={
                    isSubmitting ||
                    completedSets.length === 0 ||
                    completedSets.some((set) => !set.betAmount)
                  }
                >
                  Xác nhận gửi đi
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Popover
        open={Boolean(chipPopoverAnchor)}
        anchorEl={chipPopoverAnchor}
        onClose={handleCloseChipPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableRestoreFocus
        disableAutoFocus
      >
        <Box
          sx={{
            p: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            maxWidth: "300px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
          }}
        >
          {[1, 5, 10, 100, 500, 1000].map((amount) => (
            <Box
              key={amount}
              onClick={() => handleChipClick(amount)}
              className={`chip_Text icon_chip_${amount}`}
              sx={{
                backgroundSize: "56px 42px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                cursor: "pointer",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>{amount}</span>
            </Box>
          ))}
        </Box>
      </Popover>
      <PopupLoXienConfirm
        drawName={currentDraw?.name || ""}
        drawNo={currentDraw?.draw_no || ""}
        title={`Lô Xiên ${selectedTab + 2}`}
        regionId={regionId ?? 1}
        sets={completedSets.map((set) => ({
          numbers: set.numbers.join(", "),
          betAmount: set.betAmount,
        }))}
        totalAmount={totalAmount}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
      <PopupError message={message} />
    </Dialog>
  );
};

export default LoXien;
