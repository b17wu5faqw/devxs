"use client";

import Header from "@/layout/header/mobile/Header";
import { Box, Input } from "@mui/material";
import DrawHeader from "./components/DrawHeader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LiveVideo from "./components/LiveVideo";
import {
  getBetType,
  getBetTypeList,
  sellLottoA,
  sellLottoC,
} from "@/apis/ku-lotto";
import CustomText from "@/components/text/CustomText";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import PopupKuLiveType from "@/components/modal/PopupKuLiveType";
import ButtonCancel from "@/components/button/ButtonCancel";
import Flex from "@/components/utils/Flex";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import PopupConfirmMobile from "@/components/modal/PopupConfirmMobile";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupError from "@/components/modal/PopupError";
import useBalanceStore from "@/stores/balanceStore";
import { useAuthStore } from "@/stores/authStore";
import ResultOverlay from "./components/ResultOverlay";
import InputType1 from "@/components/game-input/InputType1";
import InputType2 from "@/components/game-input/InputType2";
import InputType4 from "@/components/game-input/InputType4";
import InputType5 from "@/components/game-input/InputType5";
import InputType7 from "@/components/game-input/InputType7";
import InputType6 from "@/components/game-input/InputType6";
import { useLottoKu } from "@/hooks/useLottoKu";
import { useParams, useRouter } from "next/navigation";
import PopupResult from "@/components/modal/_components/KuLotto/PopupResult";

type Button = {
  id: number;
  help: string;
  name: string;
};

type ButtonGroup = {
  groupTitle: string;
  buttons: Button[];
};

type Tabs = {
  [key: string]: ButtonGroup[];
};

type SubType = {
  id: number;
  name: string;
  rate: string;
  price_rate: string;
  prize_rate: string;
  title: string;
  help: string;
  description: string;
  example: string;
  input_type: number;
  max_bet: number;
  max_number: number;
};

type RowKey = "C.Ngan" | "Ngan" | "Tram" | "Chuc" | "Donvi";

const LottoA = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const params = useParams();
  const gIndex = params.gIndex as string;
  const gameIdNumber = gIndex ? parseInt(gIndex, 10) : 162;
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState(2);
  const [showVideo, setShowVideo] = useState(true);
  const [betType, setBetType] = useState<Tabs | null>(null);
  const [selectedButton, setSelectedButton] = useState<Button | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Hậu nhị");
  const [subType, setSubType] = useState<SubType | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [betChip, setBetChip] = useState(0);
  const [totalChip, setTotalChip] = useState(0);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resetCombination, setResetCombination] = useState(false);
  const [totalPrize, setTotalPrize] = useState(0);
  const [hundred, setHundred] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const { gameState } = useLottoKu(gameIdNumber);
  const { accessToken } = useAuthStore();
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const tabRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const router = useRouter();

  const winningCodes = gameState.winningCodes;

  const [selectedType7, setSelectedType7] = useState<{
    trungNhi: number[];
    soDon: number[];
  }>({
    trungNhi: [],
    soDon: [],
  });

  const tabs: Tabs = betType || {};

  const [selectedArrNumbers, setSelectedArrNumbers] = useState<
    Record<RowKey, number[]>
  >({
    "C.Ngan": [],
    Ngan: [],
    Tram: [],
    Chuc: [],
    Donvi: [],
  });

  const fetchBetTypeList = useCallback(async () => {
    const resp = await getBetTypeList();
    if (resp.status == 1) {
      setBetType(resp.data);
      setSelectedButton(resp.data[activeTab][0]?.buttons[0]);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBetTypeList();
  }, [fetchBetTypeList]);

  const handleBetTypeChange = useCallback(
    async (betTypeId: number) => {
      const resp = await getBetType({ betTypeId });
      if (resp.status === 1) {
        setSubType(resp.data);
      }
    },
    [subType]
  );

  const fetchBetType = useCallback(async () => {
    const resp = await getBetType(
      selectedButton?.id ? { betTypeId: selectedButton.id } : { betTypeId: 1 }
    );
    if (resp.status == 1) {
      setSubType(resp.data);
    }
  }, [selectedButton]);

  useEffect(() => {
    fetchBetType();
  }, [fetchBetType]);

  const handleVideoToggle = () => {
    setShowVideo(!showVideo);
  };

  const handleChangeType = (button: Button) => {
    setSelectedButton(button);
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      const chars = [];
      for (let i = 0; i < value.length; i++) {
        chars.push(value[i]);
        if ((i + 1) % inputType === 0 && i + 1 !== value.length) {
          chars.push(" ");
        }
      }

      setInput(chars.join(""));
    },
    [inputType]
  );

  const handleBalanceClick = () => {
    // Handle balance click
  };

  const tabMapping: { [key: string]: number } = {
    "5 Tinh": 5,
    "Hậu tứ": 4,
    "Tiền tam": 3,
    "Trung tam": 3,
    "Hậu tam": 3,
    "Tiền nhị": 2,
    "Hậu nhị": 2,
  };

  const validNumbers = useMemo(() => {
    let numbersFromInput: string[] = [];
    let numbersFromSelection: string[] = [];

    if (input.trim()) {
      numbersFromInput = [...new Set(input.trim().split(/[\s,;]+/))].filter(
        (num) => num.length === inputType && /^\d+$/.test(num)
      );
    }

    switch (subType?.input_type) {
      case 2:
        // Input type 2: 3-digit numbers
        if (selected.length > 0) {
          numbersFromSelection = selected
            .sort((a, b) => a - b)
            .map((n) => n.toString().padStart(3, "0"));
        }
        break;

      case 4:
        // Input type 4: 2-digit numbers
        if (selected.length > 0) {
          numbersFromSelection = selected
            .sort((a, b) => a - b)
            .map((n) => n.toString().padStart(2, "0"));
        }
        break;

      case 5:
        // Input type 5: Array numbers
        if (Object.values(selectedArrNumbers).some((arr) => arr.length > 0)) {
          numbersFromSelection = Object.entries(selectedArrNumbers)
            .filter(([_, values]) => values.length > 0)
            .map(([key, values]) => `${key}:${values.join(",")}`);
        }
        break;

      case 6:
        if (selected.length === 5) {
          numbersFromSelection = selected.sort((a, b) => a - b).map(String);
        }
        break;

      case 7:
        const isValidType7 =
          selectedType7.trungNhi.length >= 1 && selectedType7.soDon.length >= 3;
        if (isValidType7) {
          numbersFromSelection = [
            `trungNhi:${selectedType7.trungNhi.join(
              ","
            )}|soDon:${selectedType7.soDon.join(",")}`,
          ];
        }
        break;

      default:
        // Input type 1 hoặc các type khác chỉ dùng input text
        break;
    }

    const allNumbers = [...numbersFromInput, ...numbersFromSelection];
    return [...new Set(allNumbers)];
  }, [
    input,
    inputType,
    selected,
    selectedArrNumbers,
    selectedType7,
    subType?.input_type,
  ]);

  const toggleNumber = (num: number) => {
    setSelected((prev) => {
      const newSelected = prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num];

      if (subType?.input_type === 2) {
        const formattedNumbers = newSelected
          .sort((a, b) => a - b)
          .map((n) => n.toString().padStart(3, "0"))
          .join(" ");

        setInput(formattedNumbers);
      }

      if (subType?.input_type === 4) {
        const formattedNumbers = newSelected
          .sort((a, b) => a - b)
          .map((n) => n.toString().padStart(2, "0"))
          .join(" ");

        setInput(formattedNumbers);
      }

      if (subType?.input_type === 6) {
        const formattedNumbers = selected
          .sort((a, b) => a - b)
          .map((n) => n.toString().padStart(5, "0"))
          .join("-");

        setInput(formattedNumbers);
      }

      return newSelected;
    });
  };

  useEffect(() => {
    if (subType?.input_type === 2 && input) {
      const numbersFromInput = input
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter((s) => s.length === 3 && /^\d+$/.test(s))
        .map((s) => parseInt(s, 10));

      setSelected(numbersFromInput);
    }
  }, [input, subType?.input_type]);

  const handleSubType = (tab: string) => {
    setActiveTab(tab);
    setInputType(tabMapping[tab] || 2);
    setInput("");
    setTimeout(() => {
      const activeTabElement = tabRefs.current[tab];
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 100);
    // setNumbers([]);
  };

  const handleCancel = () => {
    setSelected([]);
    setNumbers([]);
    setInput("");
    setBetChip(0);
    setTotalChip(0);
    setHundred(0);
  };

  const handleClose = async () => {
    closeModal();
    openModal(MODAL.CONFIRM);
  };

  const handleSubmit = async () => {
    if (!subType?.max_number || validNumbers.length > subType.max_number) {
      setMessage("Con số đã chọn vượt quá qui định 1 kỳ");
      openModal(MODAL.ERROR);
      return;
    }

    if (validNumbers.length === 0) {
      setMessage("Vui lòng chọn ít nhất một số");
      openModal(MODAL.ERROR);
      return;
    }

    switch (subType?.input_type) {
      case 5:
        const numbersFromSelectedArr = convertSelectedArrToNumbers();
        setNumbers(numbersFromSelectedArr);
        openModal(MODAL.CONFIRM);
        return;

      case 6:
        if (selected.length !== 5) {
          setMessage("Vui lòng chọn đúng 5 số");
          openModal(MODAL.ERROR);
          return;
        }
        setNumbers(selected.map(String));
        openModal(MODAL.CONFIRM);
        return;

      case 7:
        // Input type 7: Trùng nhị + Số đơn
        if (selectedType7.trungNhi.length < 1) {
          setMessage("Vui lòng chọn tối thiểu 1 số ở nhóm Trùng Nhị");
          openModal(MODAL.ERROR);
          return;
        }
        if (selectedType7.soDon.length < 3) {
          setMessage("Vui lòng chọn tối thiểu 3 số ở nhóm Số Đơn");
          openModal(MODAL.ERROR);
          return;
        }
        setNumbers(validNumbers);
        openModal(MODAL.CONFIRM);
        return;

      case 2:
      case 4:
        // Input type 2 và 4: Chỉ dùng validNumbers
        setNumbers(validNumbers);
        openModal(MODAL.CONFIRM);
        return;

      case 1:
      default:
        if (!input.trim()) {
          setMessage("Vui lòng nhập số");
          openModal(MODAL.ERROR);
          return;
        }

        const newNumbers = input.trim().split(" ");
        let uniqueNumbers = [...numbers];
        let duplicatesNumber: string[] = [];

        if (uniqueNumbers.length + newNumbers.length > subType.max_bet) {
          setMessage("Con số đã chọn vượt quá qui định 1 kỳ");
          openModal(MODAL.ERROR);
          return;
        }

        newNumbers.forEach((num) => {
          if (uniqueNumbers.includes(num) || num.length < inputType) {
            duplicatesNumber.push(num);
          } else {
            uniqueNumbers.push(num);
          }
        });

        setNumbers(uniqueNumbers);
        if (duplicatesNumber.length > 0) {
          setDuplicates(duplicatesNumber);
          openModal(MODAL.INFO_MOBILE);
        } else {
          openModal(MODAL.CONFIRM);
        }
        break;
    }
  };

  const handleConfirm = async (value: number, betChip: number) => {
    try {
      setIsSubmitting(true);
      if (!gameState.currentDraw?.id) return;
      let res;
      if (gameIdNumber == 162) {
        res = await sellLottoA({
          digits: numbers.join("-"),
          amount: value,
          drawId: gameState.currentDraw.id,
          betTypeId: subType?.id ?? 0,
          betPoint: betChip,
          drawCount: 1,
          jwt_key: accessToken ?? "",
        });
      } else {
        res = await sellLottoC({
          digits: numbers.join("-"),
          amount: value,
          drawId: gameState.currentDraw.id,
          betTypeId: subType?.id ?? 0,
          betPoint: betChip,
          drawCount: 1,
          jwt_key: accessToken ?? "",
        });
      }
      setNumbers([]);
      setInput("");
      setBetChip(0);
      setTotalChip(0);
      setSelectedNumbers([]);
      setResetCombination(true);
      closeModal();

      setTimeout(() => {
        setResetCombination(false);
      }, 100);

      if (res.status == 1) {
        openModal(MODAL.SUCCESS);
        fetchBalance();
      } else {
        setMessage(res.description);
        openModal(MODAL.ERROR);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleNumber5 = (row: RowKey, num: number) => {
    setSelectedArrNumbers((prev) => {
      const current = prev[row];
      const newArr = current.includes(num)
        ? current.filter((n) => n !== num)
        : [...current, num];
      return { ...prev, [row]: newArr };
    });
  };

  const toggleNumber7 = (group: "trungNhi" | "soDon", num: number) => {
    setSelectedType7((prev) => {
      const current = prev[group];
      const newArr = current.includes(num)
        ? current.filter((n) => n !== num)
        : [...current, num];
      return { ...prev, [group]: newArr };
    });
  };

  const convertSelectedArrToNumbers = useCallback(() => {
    const result: string[] = [];

    Object.entries(selectedArrNumbers).forEach(([key, values]) => {
      if (values.length > 0) {
        const combination = `${key}:${values.join(",")}`;
        result.push(combination);
      }
    });

    return result;
  }, [selectedArrNumbers]);

  const MaintenanceOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1a1a1a",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          maxWidth: "450px",
          width: "95%",
          border: "2px solid #ff6b35",
          boxShadow: "0 10px 30px rgba(255, 107, 53, 0.3)",
        }}
      >
        {/* Title */}
        <CustomText
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ff6b35",
            marginBottom: "16px",
          }}
        >
          Hệ thống đang bảo trì
        </CustomText>

        {/* Description */}
        <CustomText
          sx={{
            fontSize: "16px",
            color: "#cccccc",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Hệ thống đang được nâng cấp để mang đến trải nghiệm tốt hơn.
          <br />
          Vui lòng quay lại sau ít phút.
        </CustomText>

        {/* Status text */}
        <CustomText
          sx={{
            fontSize: "14px",
            color: "#888",
            marginBottom: "20px",
          }}
        >
          Đang xử lý... Xin vui lòng chờ.
        </CustomText>
        <Box
          onClick={() => router.push("/")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#ff6b35",
            color: "white",
            padding: "8px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            border: "2px solid transparent",
            "&:hover": {
              backgroundColor: "#e55a2b",
              border: "2px solid #ff6b35",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 15px rgba(255, 107, 53, 0.4)",
            },
            "&:active": {
              transform: "translateY(0px)",
            },
          }}
        >
          <span>Quay về trang chủ</span>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ background: "#000", minHeight: "100vh" }}>
      {isMaintenance && <MaintenanceOverlay />}
      {!isMaintenance && (
        <>
          <Header
            type={6}
            name={Number(gIndex) === 162 ? "Lotto A" : "Lotto C"}
          />
          <DrawHeader
            onVideoToggle={handleVideoToggle}
            onBalanceClick={handleBalanceClick}
            gType={gameIdNumber || 162}
          />
          <LiveVideo
            gType={gameIdNumber || 162}
            winningCodes={winningCodes}
            gamePhase={gameState.gamePhase}
          />
          <Box
            sx={{
              backgroundColor: "#000",
              borderBottom: "1px solid #333",
              height: "42px",
              lineHeight: "42px",
              position: "relative",
              display: "table",
              transition: "0.35s ease-in-out",
              paddingRight: "2%",
              width: "100%",
            }}
          >
            <Box
              sx={{
                height: "42px",
                lineHeight: "42px",
                display: "table-cell",
                position: "relative",
                verticalAlign: "middle",
              }}
            >
              <Box
                sx={{
                  display: "block",
                  color: "#fff",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflowY: "hidden",
                  overflowX: "auto",
                  position: "absolute",
                  left: "0",
                  right: "5%",
                  top: "0",
                  bottom: "0",
                  fontSize: "0",
                }}
              >
                {Object.keys(tabs).map((tab) => (
                  <Box
                    key={tab}
                    ref={(el: HTMLElement | null) => {
                      tabRefs.current[tab] = el;
                    }}
                    onClick={() => handleSubType(tab)}
                    sx={{
                      display: "inline-block",
                      height: "100%",
                      width: "33%",
                      padding: "0 20px",
                      fontSize: "1.1rem",
                      textAlign: "center",
                      cursor: "pointer",
                      color: "#fff",
                      lineHeight: "42px",
                      borderBottom:
                        activeTab === tab
                          ? "3px solid #258d5c"
                          : "3px solid transparent",
                    }}
                  >
                    {tab}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: "table-cell",
                width: "1%",
                position: "relative",
                verticalAlign: "middle",
              }}
            >
              <CustomText
                sx={{
                  fontSize: "1em",
                  minWidth: "55px",
                  display: "block",
                  padding: "0 10px",
                  height: "23px",
                  lineHeight: "23px",
                  borderRadius: "20px",
                  backgroundColor: "#588872",
                  color: "#fff",
                }}
              >
                Thêm
              </CustomText>
            </Box>
          </Box>
          <Box sx={{ background: "#000" }}>
            <Box sx={{ display: "table", width: "96%", margin: "5px auto" }}>
              <Box
                sx={{
                  display: "table",
                  height: "30px",
                  lineHeight: "30px",
                  color: "#fff",
                  textAlign: "center",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Box
                  onClick={() => openModal(MODAL.KU_LIVE_TYPE)}
                  sx={{
                    width: "73%",
                    float: "left",
                    fontSize: "1em",
                    textAlign: "center",
                    paddingLeft: "5px",
                    margin: "0 1% 0 0",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "5px",
                    position: "relative",
                    "&:after": {
                      content: "''",
                      position: "absolute",
                      right: "5.5%",
                      top: "-4px",
                      bottom: "0",
                      borderTop: "2px solid rgba(255,255,255)",
                      borderRight: "2px solid rgba(255,255,255)",
                      width: "7px",
                      height: "7px",
                      margin: "auto",
                      transform: "rotate(135deg)",
                    },
                  }}
                >
                  {subType?.title}
                </Box>
                <Box
                  sx={{
                    width: "26%",
                    fontSize: "1em",
                    float: "right",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    textAlign: "center",
                    padding: 0,
                    color: "#fff",
                  }}
                >
                  Chọn
                  <Box
                    sx={{
                      borderStyle: "solid",
                      borderWidth: "8px 5px 0 5px",
                      borderColor: "#fff transparent transparent transparent",
                      transform: "rotate(0deg)",
                      display: "inline-block",
                      margin: "0 0 2px 3px",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              margin: "0",
              display: "table",
              overflowY: "auto",
              paddingBottom: "30px",
            }}
          >
            {subType?.input_type == 1 && (
              <InputType1 input={input} onChange={handleChange} />
            )}

            {subType?.input_type == 2 && (
              <InputType2
                selected={selected}
                hundred={hundred}
                onToggleNumber={toggleNumber}
                onSetHundred={setHundred}
              />
            )}

            {subType?.input_type == 4 && (
              <InputType4 selected={selected} onToggleNumber={toggleNumber} />
            )}

            {subType?.input_type == 5 && (
              <InputType5
                selectedArrNumbers={selectedArrNumbers}
                onToggleNumber={toggleNumber5}
              />
            )}
            {subType?.input_type == 6 && (
              <InputType6 selected={selected} onToggleNumber={toggleNumber} />
            )}
            {subType?.input_type == 7 && (
              <InputType7
                selectedType7={selectedType7}
                onToggleNumber={toggleNumber7}
              />
            )}
          </Box>

          {gameState.countdownSeconds <= 0 && (
            <>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.46)",
                  position: "fixed",
                  left: 0,
                  top: 0,
                  zIndex: "11",
                }}
              />
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  margin: "auto",
                  borderRadius: "17px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "75%",
                  height: "140px",
                  padding: "35px 0",
                  zIndex: "200",
                  "&:before": {
                    content: "''",
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    right: "8px",
                    bottom: "8px",
                    background: "#101010",
                    zIndex: "-1",
                    borderRadius: "12px",
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: "1.5em",
                    color: "#ff0100",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  Kỳ{" "}
                  <span style={{ color: "#f8c214" }}>
                    {gameState.currentDraw?.draw_no}
                  </span>
                  <br />
                  Kèo đã đóng
                </Box>
              </Box>
            </>
          )}

          {/* <ResultOverlay
        isVisible={gameState.showResultOverlay}
        winningCodes={winningCodes}
        revealedCodes={gameState.resultAnimation.revealedCodes}
        isAnimating={gameState.resultAnimation.isAnimating}
        onClose={() => {}}
      /> */}

          {validNumbers.length > 0 && (
            <Flex
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                backgroundColor: "#000",
                width: "100%",
                zIndex: "11",
                height: "74px",
              }}
            >
              <ButtonCancel
                sx={{
                  height: "54px",
                  backgroundColor: "#888",
                  width: "31%",
                  margin: "10px 3% 10px 5%",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
                onClick={() => handleCancel()}
              >
                Hủy
              </ButtonCancel>
              <Flex
                sx={{
                  backgroundColor: "#69ac8e",
                  color: "#fff600",
                  width: "56%",
                  margin: "10px 5% 10px 0",
                  textAlign: "center",
                  float: "left",
                  height: "54px",
                  borderRadius: "8px",
                }}
                onClick={() => handleSubmit()}
              >
                <CustomText
                  sx={{
                    float: "left",
                    marginLeft: "5%",
                    color: "#fff",
                    lineHeight: "52px",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  <span style={{ color: "#fff600" }}>
                    {validNumbers.length}
                  </span>{" "}
                  đơn
                </CustomText>
                <CustomText
                  sx={{
                    float: "right",
                    marginRight: "5%",
                    color: "#fff600",
                    fontSize: "16px",
                  }}
                >
                  Xác nhận
                </CustomText>
              </Flex>
            </Flex>
          )}

          <PopupInfoMobile duplicates={duplicates} onConfirm={handleClose} />
          <PopupConfirmMobile
            drawName={gameIdNumber == 162 ? "Lotto A" : "Lotto C"}
            drawId={gameState.currentDraw?.id ?? 0}
            drawNo={gameState.currentDraw?.draw_no ?? ""}
            subtypeId={subType?.id ?? 0}
            inputType={subType?.input_type ?? 1}
            maxBet={subType?.max_bet ?? 1000}
            title={subType?.title ?? ""}
            numbers={numbers}
            betChip={betChip}
            totalChip={totalChip}
            rate={subType?.rate ? Number(subType.rate) : 0}
            prizeRate={subType?.prize_rate ? Number(subType.prize_rate) : 0}
            totalPrize={totalPrize}
            disabled={isSubmitting}
            onConfirm={handleConfirm}
          />
          <PopupSuccess />
          <PopupError message={message} />
          <PopupKuLiveType
            tabActive={tabs[activeTab]}
            selectedButton={selectedButton?.id ?? 0}
            onChangeType={handleChangeType}
          />
          <PopupResult gType={gameIdNumber} />
        </>
      )}
    </Box>
  );
};

export default LottoA;
