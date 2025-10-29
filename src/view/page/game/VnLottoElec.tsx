"use client";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { Box, Button, Input, TextareaAutosize } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useLastDraw, useListDraw } from "@/hooks/useLotto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import {
  getCurrentDraw,
  getDraw,
  getBetRule,
  getTypeV2,
  sellLotto,
  getLastDraw,
  repeat,
} from "@/apis/lotto";
import { useAuthStore } from "@/stores/authStore";
import ButtonCancel from "@/components/button/ButtonCancel";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import PopupConfirmMobile from "@/components/modal/PopupConfirmMobile";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupError from "@/components/modal/PopupError";
import PopupLottoType from "@/components/modal/PopupLottoType";
import useBalanceStore from "@/stores/balanceStore";
import { useMenuStore } from "@/stores/useMenuStore";
import { CombinationInput } from "@/components/game-input/CombinationInput";
import PopupMakeTransfer from "@/components/modal/PopupMakeTransfer";
import { CombinationInputType3 } from "@/components/game-input/CombinationInputType3";
import ConfirmMobile from "@/components/modal/mobile/VnLottoElec/ConfirmMobile";

const StyledTableRowResult = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fff",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#f3f3f3",
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#b9d6f5",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#86bbf2",
  },
}));

type LastDrawType = {
  id?: number;
  draw_no?: string;
  end_time?: string;
  next_draw: number;
  prev_draw: number;
  result?: any;
  groupedNumbers?: any;
};

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

type DrawType = {
  id: number;
  draw_no: string;
  end_time: string;
  name: string;
};

export interface HistoryItem {
  id?: number;
  title?: string;
  draw_no?: string;
  type?: string;
  bet_point: number;
  money?: number;
  code?: string;
  bet_type_id: number;
}

const VnLottoElec = () => {
  const router = useRouter();
  const { scheduleId, regionId, typeId } = useMenuStore();
  const [selectDraw, setSelectDraw] = useState<number | undefined>();
  const [result, setResult] = useState<LastDrawType | null>(null);
  const [repeatHistory, setRepeatHistory] = useState<HistoryItem[] | null>(
    null
  );
  const [hoveredNumbers, setHoveredNumbers] = useState<string>("");
  const [type, setType] = useState<Tabs | null>(null);
  const [subType, setSubType] = useState<SubType | null>(null);
  const [selectedButton, setSelectedButton] = useState<Button | null>(null);
  const [activeTab, setActiveTab] = useState<string>("2D");
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState(2);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [betChip, setBetChip] = useState(0);
  const [totalChip, setTotalChip] = useState(0);
  const [totalPrize, setTotalPrize] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resetCombination, setResetCombination] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const { accessToken } = useAuthStore();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [region, setRegion] = useState(1);
  const balanceUser = useBalanceStore((s) => s.balance);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const [visibleRows, setVisibleRows] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 0,
  ]);
  const [isResetting, setIsResetting] = useState(false);
  const [showGroupedNumbers, setShowGroupedNumbers] = useState(false);
  const [showRepeatBox, setShowRepeatBox] = useState(false);
  const hasReset = useRef(false);

  const [currentDraw, setCurrentDraw] = useState<DrawType | null>(null);

  const params = useParams();
  const { id } = params;

  // console.log("regionId", regionId);

  const showOrder = useMemo(
    () =>
      regionId === 1 ? [1, 2, 3, 4, 5, 6, 7, 0] : [1, 2, 3, 4, 5, 6, 7, 8, 0],
    [regionId]
  );

  const imgMap: Record<number, number> =
    regionId === 1
      ? {
          0: 5,
          1: 5,
          2: 5,
          3: 5,
          4: 4,
          5: 4,
          6: 3,
          7: 2,
          8: 2,
        }
      : {
          0: 5,
          1: 5,
          2: 5,
          3: 5,
          4: 5,
          5: 4,
          6: 4,
          7: 3,
          8: 2,
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

  const validNumbers = useMemo(() => {
    if (subType?.input_type === 2 || subType?.input_type === 3) {
      // For combination input type
      return selectedNumbers;
    }
    // For regular input type
    return [...new Set(input.trim().split(" "))].filter(
      (num) => num.length === inputType
    );
  }, [input, inputType, selectedNumbers, subType?.input_type]);

  // Add the handler for CombinationInput
  const handleCombinationsChange = useCallback((combinations: string[]) => {
    setSelectedNumbers(combinations);
    setNumbers(combinations);
  }, []);

  const handleBetTypeChange = useCallback(
    async (betTypeId: number) => {
      const resp = await getBetRule({ betTypeId });
      if (resp.status === 1) {
        setSubType(resp.data);
      }
    },
    [subType, id]
  );

  const fetchDraw = useCallback(async () => {
    const resp = await getCurrentDraw({
      schedule_id: Number(id),
      lotto_type: 2,
    });
    if (resp.status == 1) {
      setRegion(resp.data.region_id);
      setCurrentDraw(resp.data);
    }
  }, [id]);

  useEffect(() => {
    fetchDraw();
  }, [id]);

  const fetchRepeat = useCallback(async () => {
    const resp = await repeat({
      jwt_key: accessToken ?? "",
      schedulerId: Number(id) ?? 0,
    });
    if (resp.status == 1) {
      setRepeatHistory(resp.data);
    }
  }, [id]);

  useEffect(() => {
    fetchRepeat();
  }, [id]);

  const fetchLastDraw = useCallback(async () => {
    const resp = await getLastDraw({
      draw_id: selectDraw ? Number(selectDraw) : 0,
      lotto_type: 2,
      scheduler_id: Number(id),
    });
    if (resp.status == 1) {
      setResult(resp.data);
    }
  }, [selectDraw, selectedButton]);

  useEffect(() => {
    fetchLastDraw();
    setVisibleRows(showOrder);
  }, [fetchLastDraw]);

  const tabs: Tabs = type || {};

  const fetch = useCallback(async () => {
    const resp = await getTypeV2({ regionId: Number(regionId), schedulerId: Number(id), type: 2 });
    if (resp.status == 1) {
      setType(resp.data);
      if (activeTab === "4D") {
        setSelectedButton(resp.data[activeTab][0]?.buttons[2]);
      } else {
        setSelectedButton(resp.data[activeTab][0]?.buttons[4]);
      }
    }
  }, [activeTab, region]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const fetchSubType = useCallback(async () => {
    const resp = await getBetRule(
      selectedButton?.id ? { betTypeId: selectedButton.id } : { betTypeId: 1 }
    );
    if (resp.status == 1) {
      setSubType(resp.data);
    }
  }, [selectedButton, id]);

  useEffect(() => {
    fetchSubType();
  }, [fetchSubType]);

  const tabMapping: { [key: string]: number } = {
    "2D": 2,
    "3D": 3,
    "4D": 4,
  };

  const handleSubType = (tab: string) => {
    setActiveTab(tab);
    setInputType(tabMapping[tab] || 2);
    setInput("");
    setNumbers([]);
  };

  function chunkArray(array: any[], size: number) {
    const result = [];
    if (array.length == 4) {
      for (let i = 0; i < array.length; i += size + 1) {
        result.push(array.slice(i, i + size + 1));
      }
    } else {
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
    }
    return result;
  }

  const highlightLastTwo = (text: string) => {
    if (text.length <= 2) {
      return (
        <span
          style={{
            color: hoveredNumbers.includes(text.slice(0, 1))
              ? "#fff"
              : "#106eb6",
            fontWeight: "bold",
            backgroundColor: hoveredNumbers.includes(text.slice(0, 1))
              ? "#106eb6"
              : "transparent",
            padding: hoveredNumbers.includes(text.slice(0, 1)) ? "0 4px" : "0",
            borderRadius: hoveredNumbers.includes(text.slice(0, 1))
              ? "10px"
              : "0",
          }}
        >
          {text}
        </span>
      );
    }

    const mainText = text.slice(0, -2);
    const lastTwo = text.slice(-2);

    return (
      <>
        {mainText}
        <span
          style={{
            color: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "#fff"
              : "#106eb6",
            fontWeight: "bold",
            backgroundColor: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "#106eb6"
              : "transparent",
            padding: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "0 4px"
              : "0",
            borderRadius: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "10px"
              : "0",
          }}
        >
          {lastTwo}
        </span>
      </>
    );
  };

  const handleSubmit = async () => {
    if (!subType?.max_number || validNumbers.length > subType.max_number) {
      setMessage("Con số đã chọn vượt quá qui định 1 kỳ");
      openModal(MODAL.ERROR);
      return;
    }

    if (subType?.input_type === 2 || subType?.input_type === 3) {
      openModal(MODAL.CONFIRM);
      return;
    }
    const newNumbers = input.trim().split(" ");
    let uniqueNumbers = [...numbers];
    let duplicatesNumber: string[] = [];

    if (uniqueNumbers.length + newNumbers.length > subType.max_number) {
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
  };

  const handleClose = async () => {
    closeModal();
    openModal(MODAL.CONFIRM);
  };

  const handleConfirm = async (value: number, betChip: number) => {
    try {
      setIsSubmitting(true);
      if (!currentDraw?.id) return;
      const res = await sellLotto({
        digits: numbers.join("-"),
        bet_point: betChip,
        amount: value,
        total_amount: value,
        drawId: currentDraw.id,
        betTypeId: subType?.id ?? 0,
        jwt_key: accessToken ?? "",
        region_id: region ?? 1,
        lotto_type: 2,
      });
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
      console.log("Failed to create post. Please try again." + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNumbers([]);
    setInput("");
    setBetChip(0);
    setTotalChip(0);
  };

  const handleChangeType = (button: Button) => {
    setSelectedButton(button);
  };

  const useCountdown = (
    targetTime: string | undefined,
    onComplete: () => void
  ) => {
    const calculateTimeLeft = useCallback((targetDatetime: string) => {
      if (!targetDatetime) return { hours: 0, minutes: 0, seconds: 0 };

      try {
        // Create a date object - handles various formats
        const targetDate = new Date(targetDatetime);

        // Check if the date is valid
        if (isNaN(targetDate.getTime())) {
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

        return {
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      } catch (error) {
        console.error("Error parsing date:", error);
        return { hours: 0, minutes: 0, seconds: 0 };
      }
    }, []);

    const [timeLeft, setTimeLeft] = useState(() =>
      calculateTimeLeft(targetTime || "00:00:60")
    );

    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
      if (visibleRows.length < result?.result.length && !isResetting) {
        const timer = setTimeout(() => {
          const nextIndex = showOrder[visibleRows.length];
          setVisibleRows((prev) => [...prev, nextIndex]);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (visibleRows.length === result?.result.length) {
        const timer = setTimeout(() => {
          setShowGroupedNumbers(true);
          setIsResetting(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [visibleRows, isResetting]);

    useEffect(() => {
      if (
        timeLeft.hours !== 0 ||
        timeLeft.minutes !== 0 ||
        timeLeft.seconds !== 0
      ) {
        hasReset.current = false;
        setVisibleRows(showOrder);
        setShowGroupedNumbers(true);
      }
    }, [timeLeft, showOrder]);

    useEffect(() => {
      if (
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0 &&
        !hasReset.current
      ) {
        hasReset.current = true;
        setShowGroupedNumbers(false);
        setVisibleRows([]);
        setIsResetting(true);
        setTimeout(() => setIsResetting(false), 1000);
      }
    }, [timeLeft, visibleRows]);

    useEffect(() => {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(targetTime || "00:00:60");
        setTimeLeft(newTimeLeft);

        if (
          newTimeLeft.hours === 0 &&
          newTimeLeft.minutes === 0 &&
          newTimeLeft.seconds === 0
        ) {
          setIsClosed(true);
          fetchLastDraw();
          setSelectDraw(0);
          onComplete();
        } else {
          setIsClosed(false);
        }
      }, 1000);

      return () => clearInterval(timer);
    }, [targetTime, calculateTimeLeft, onComplete]);

    return { timeLeft, isClosed };
  };

  const { timeLeft, isClosed } = useCountdown(
    currentDraw?.end_time || "00:00:60",
    fetchDraw
  );

  const handleRepeat = (code: string = "", bet_type_id: number) => {
    const normalizedCode = code.replace(/;/g, ",");
    const nums = normalizedCode
      .split(/[ ,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    console.log("nums", nums);

    const numsString = nums.join(",");

    setNumbers(nums);
    setInput(numsString);
    setDuplicates([]);
    openModal(MODAL.CONFIRM);
  };

  return (
    <Box sx={{ background: "#000", minHeight: "100vh" }}>
      <Box
        sx={{
          backgroundColor: "#1f4733",
          height: "45px",
          borderBottom: "1px solid #35423e",
          position: "relative",
          zIndex: "99",
        }}
      >
        <Flex>
          <Flex>
            <Flex
              sx={{
                background: "url(/images/main/btn_home.svg) no-repeat center",
                backgroundSize: "auto 55%",
                width: "38px",
                height: "40px",
                cursor: "pointer",
                opacity: "0.5",
              }}
              onClick={() => router.push(`/`)}
            />
            <Flex
              sx={{
                background:
                  "url(/images/main/btn_lotteryResult.svg) no-repeat center",
                backgroundSize: "auto 50%",
                width: "38px",
                height: "45px",
                cursor: "pointer",
                opacity: "0.5",
              }}
            />
          </Flex>
          <Flex>
            <CustomText
              onClick={() => openModal(MODAL.GAME_LO)}
              sx={{
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "5px",
                color: "#fff",
                fontSize: " 0.95em",
                paddingRight: "30px",
                paddingLeft: "10px",
                lineHeight: "27px",
                position: "relative",
                margin: "9px auto",
                display: "inline-block",
                "&:after": {
                  content: "''",
                  position: "absolute",
                  right: "10px",
                  top: "-2px",
                  bottom: "0",
                  borderTop: "1.5px solid rgba(255,255,255,1)",
                  borderRight: "1.5px solid rgba(255,255,255,1)",
                  borderBottom: "none",
                  borderLeft: "none",
                  width: "8px",
                  height: "8px",
                  borderWidth: "2px",
                  transform: "rotate(45deg)",
                  margin: "auto",
                },
              }}
            >
              {currentDraw?.name}
            </CustomText>
          </Flex>
          <Flex>
            <Flex
              sx={{
                background:
                  "url(/images/main/btn_betRecord.svg) no-repeat center",
                backgroundSize: "auto 55%",
                width: "38px",
                height: "40px",
                cursor: "pointer",
                opacity: "0.5",
              }}
              onClick={() => router.push(`/history`)}
            />
            <Flex
              sx={{
                background: "url(/images/main/btn_menu.svg) no-repeat center",
                backgroundSize: "auto 50%",
                width: "38px",
                height: "45px",
                cursor: "pointer",
                opacity: "0.5",
              }}
            />
          </Flex>
        </Flex>
      </Box>
      <Flex
        sx={{
          backgroundColor: "#101f1a",
          height: "39px",
          lineHeight: "32px",
          padding: "0 5px",
        }}
      >
        <CustomText
          sx={{
            fontSize: "1.1em",
            color: "#fff",
            width: "80px",
            textAlign: "center",
          }}
        >
          Kỳ
          <span className="text-[#ff7d7d] ml-[5px]">
            {currentDraw?.draw_no.slice(-4)}
          </span>
        </CustomText>
        <Box
          sx={{
            display: "table-cell",
            color: "#fff",
            textAlign: "text-align",
            whiteSpace: "nowrap",
            fontSize: "1em",
          }}
        >
          <Flex
            sx={{
              display: "inline-flex",
              justifyContent: "flex-start",
              height: "35px",
              flex: 1,
            }}
          >
            <CustomText
              sx={{
                background: "url(/images/common/bg_time.svg) no-repeat center",
                display: "block",
                backgroundSize: "100%",
                width: "40px",
                height: "28px",
                lineHeight: "28px",
                color: "#000",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              {timeLeft.hours.toString().padStart(2, "0")}
            </CustomText>
            <CustomText
              sx={{
                color: "#fff",
                textAlign: "center",
                width: "18px",
                height: "38px",
                fontWeight: "bold",
                fontSize: "22px",
              }}
            >
              :
            </CustomText>
            <CustomText
              sx={{
                background: "url(/images/common/bg_time.svg) no-repeat center",
                display: "block",
                backgroundSize: "100%",
                width: "40px",
                height: "28px",
                lineHeight: "28px",
                color: "#000",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              {timeLeft.minutes.toString().padStart(2, "0")}
            </CustomText>
            <CustomText
              sx={{
                color: "#fff",
                textAlign: "center",
                width: "18px",
                height: "38px",
                fontWeight: "bold",
                fontSize: "22px",
              }}
            >
              :
            </CustomText>
            <CustomText
              sx={{
                background: "url(/images/common/bg_time.svg) no-repeat center",
                display: "block",
                backgroundSize: "100%",
                width: "40px",
                height: "28px",
                lineHeight: "28px",
                color: "#000",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              {timeLeft.seconds.toString().padStart(2, "0")}
            </CustomText>
          </Flex>
        </Box>
        <Flex
          onClick={() => openModal(MODAL.MAKE_TRANSFER)}
          sx={{
            fontSize: "1.1em",
            position: "relative",
            color: "#ffe400",
            float: "right",
            alignItems: "baseline",
            justifyContent: "center",
            paddingRight: "15px",
            "&:after": {
              content: "''",
              position: "relative",
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "5px 4px 0 4px",
              borderColor: "#fff transparent transparent transparent",
              top: 0,
              bottom: 0,
              left: "11px",
              margin: "auto",
            },
          }}
        >
          $ {balanceUser}
        </Flex>
      </Flex>
      <Box
        sx={{
          backgroundColor: "#484848",
          height: "40px",
          fontSize: "1.1em",
          lineHeight: "40px",
          marginBottom: "0",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Box
          onClick={() => setSelectDraw(result?.prev_draw)}
          sx={{
            float: "left",
            width: "20%",
            border: "none",
            height: "30px",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              display: "block",
              borderStyle: "solid solid solid solid",
              borderColor:
                "transparent rgba(255,255,255,1) transparent transparent",
              borderWidth: "10px",
              height: 0,
              width: 0,
              top: 0,
              left: "-50%",
              right: 0,
              bottom: 0,
              margin: "auto",
              lineHeight: "30px",
            }}
          ></span>
        </Box>
        Kỳ {result?.draw_no}
        <Box
          onClick={
            result?.next_draw === 0
              ? undefined
              : () => setSelectDraw(result?.next_draw)
          }
          sx={{
            float: "right",
            width: "20%",
            border: "none",
            height: "30px",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              display: "block",
              borderStyle: "solid solid solid solid",
              borderColor:
                result?.next_draw === 0
                  ? "transparent transparent transparent #888"
                  : "transparent transparent transparent rgba(255,255,255,1)",
              borderWidth: "10px",
              height: 0,
              width: 0,
              top: 0,
              right: "-50%",
              left: 0,
              bottom: 0,
              margin: "auto",
              lineHeight: "30px",
            }}
          ></span>
        </Box>
      </Box>
      <Flex sx={{ alignItems: "flex-start" }}>
        <Box sx={{ width: "65%" }}>
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table sx={{ width: "100%" }}>
              <TableBody>
                {result?.result.map((row: any, rowIndex: number) => {
                  const isRowVisible = isResetting
                    ? true
                    : visibleRows.includes(rowIndex);
                  return (
                    <StyledTableRowResult key={rowIndex}>
                      <TableCell
                        sx={{
                          width: "70px",
                          paddingX: "0",
                          paddingY: "2px",
                          borderBottom: "1px solid #fff",
                          textAlign: "center",
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          paddingX: "0",
                          paddingY: "2px",
                          borderBottom: "1px solid #fff",
                          "&:nth-of-type(2)": {
                            borderLeft: "1px solid #fff",
                          },
                        }}
                      >
                        <Flex
                          sx={{
                            textAlign: "center",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          {chunkArray(row.value, 3).map(
                            (group: any[], index: number) => (
                              <Flex
                                key={index}
                                sx={{
                                  justifyContent: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {typeId === 2
                                  ? isRowVisible
                                    ? group
                                        .map((item, idx) => (
                                          <CustomText
                                            key={idx}
                                            sx={{
                                              margin: "0 4px",
                                              display: "inline-block",
                                              width: "auto",
                                              height: "22px",
                                            }}
                                            fs="14px"
                                            fw="500"
                                            letterSpacing="1px"
                                          >
                                            {highlightLastTwo(item)}
                                            {idx < group.length - 1 && " -"}
                                          </CustomText>
                                        ))
                                        .reduce((acc, curr, i) => {
                                          if (i === 0) return [curr];
                                          return [
                                            ...acc,
                                            <span key={`sep-${i}`}>
                                              {i !== 4}
                                            </span>,
                                            curr,
                                          ];
                                        }, [] as React.ReactNode[])
                                    : group
                                        .map((item, idx) => (
                                          <CustomText
                                            key={idx}
                                            sx={{
                                              margin: "0 4px",
                                              display: "inline-block",
                                              width: "auto",
                                              height: "22px",
                                            }}
                                            fs="14px"
                                            fw="500"
                                            letterSpacing="1px"
                                          >
                                            <img
                                              className="flex h-full w-auto object-cover"
                                              src={`/images/main/${imgMap[rowIndex]}.gif`}
                                              alt=""
                                            />
                                          </CustomText>
                                        ))
                                        .reduce((acc, curr, i) => {
                                          if (i === 0) return [curr];
                                          return [
                                            ...acc,
                                            <span key={`sep-${i}`}>
                                              {i !== 4 && "-"}
                                            </span>,
                                            curr,
                                          ];
                                        }, [] as React.ReactNode[])
                                  : group.map((item, idx) => (
                                      <CustomText
                                        key={idx}
                                        sx={{
                                          margin: "0 4px",
                                          display: "inline-block",
                                          width: "auto",
                                          height: "22px",
                                        }}
                                        fs="14px"
                                        fw="500"
                                        letterSpacing="1px"
                                      >
                                        {highlightLastTwo(item)}
                                        {idx < group.length - 1 && " -"}
                                      </CustomText>
                                    ))}
                              </Flex>
                            )
                          )}
                        </Flex>
                      </TableCell>
                    </StyledTableRowResult>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ width: "35%" }}>
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table sx={{ width: "100%" }}>
              <TableBody>
                <StyledTableRow
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#106eb6",
                      color: "#fff",
                    },
                    "&:hover td": {
                      color: "#fff",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      width: "25px",
                      padding: "0",
                      borderBottom: "1px solid #fff",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      height: "30px",
                    }}
                  >
                    Đầu
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "40px",
                      paddingY: "0",
                      borderBottom: "1px solid #fff",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      height: "30px",
                      "&:nth-of-type(2)": {
                        borderLeft: "1px solid #fff",
                      },
                    }}
                  >
                    Đuôi
                  </TableCell>
                </StyledTableRow>
                {result?.groupedNumbers.map((row: any, key: number) => (
                  <StyledTableRow
                    key={key}
                    onMouseEnter={() => setHoveredNumbers(key.toString())}
                    onMouseLeave={() => setHoveredNumbers("")}
                    sx={{
                      cursor: "pointer",
                      height: "26px",
                      "&:hover": {
                        backgroundColor: "#106eb6",
                        color: "#fff",
                      },
                      "&:hover td": {
                        color: "#fff",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        width: "25px",
                        paddingY: "0",
                        borderBottom: "1px solid #fff",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        textAlign: "center",
                        height: "26px",
                      }}
                    >
                      {key}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        paddingY: "0",
                        borderBottom: "1px solid #fff",
                        fontFamily: "Arial",
                        fontSize: "15px",
                        height: "26px",
                        "&:nth-of-type(2)": {
                          borderLeft: "1px solid #fff",
                        },
                      }}
                    >
                      {typeId === 1
                        ? row.join(",")
                        : showGroupedNumbers
                        ? row.join(",")
                        : ""}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
      <Box
        sx={{
          backgroundColor: "rgba(134,134,134,0.5)",
          color: "#fff",
          textAlign: "center",
          fontSize: "0.9em",
          lineHeight: "25px",
          position: "relative",
        }}
      >
        <CustomText
          sx={{
            display: "block",
            fontSize: "1rem",
            color: "#fff",
            textAlign: "center",
            lineHeight: "25px",
          }}
        >
          Kết quả gần đây
        </CustomText>
        <Box
          sx={{
            borderStyle: "solid",
            borderWidth: "8px 8px 0px 8px",
            borderColor:
              "rgba(255,255,255,1) transparent transparent transparent",
            float: "right",
            width: 0,
            height: 0,
            position: "absolute",
            margin: "auto 0",
            top: 0,
            bottom: 0,
            right: "10px",
            transform: "rotate(180deg)",
          }}
        />
      </Box>
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
              <CustomText
                key={tab}
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
              </CustomText>
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
              onClick={() => openModal(MODAL.LOTTO_TYPE)}
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
        {subType?.input_type == 2 && (
          <CombinationInput
            onCombinationsChange={handleCombinationsChange}
            onBetTypeChange={handleBetTypeChange}
            resetState={resetCombination}
          />
        )}
        {subType?.input_type == 3 && (
          <CombinationInputType3
            onCombinationsChange={handleCombinationsChange}
            onBetTypeChange={handleBetTypeChange}
            resetState={resetCombination}
          />
        )}
        {subType?.input_type != 2 && subType?.input_type != 3 && (
          <>
            <textarea
              style={{
                height: "119px",
                margin: "0 2%",
                width: "96%",
                backgroundColor: "#ecfff6",
                padding: "2% 3%",
                marginBottom: "-4px",
                color: "#595959",
                fontSize: "1.3em",
                border: 0,
                resize: "none",
              }}
              placeholder="Nhập số đặt cược"
              value={input}
              onChange={handleChange}
            ></textarea>
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "1px 0",
              }}
            >
              <Box sx={{ width: "96%", margin: "6px auto", height: "29px" }}>
                <Box
                  sx={{
                    position: "static",
                    width: "25%",
                    marginRight: "1.5%",
                    height: "30px",
                    lineHeight: "30px",
                    textAlign: "center",
                    fontSize: "1em",
                    marginBottom: "3px",
                    border: "#3b5247 1px solid",
                    borderRadius: "3px",
                    color: "#fff",
                    float: "left",
                  }}
                >
                  Số nóng
                </Box>
                <Box
                  sx={{
                    width: "47%",
                    marginRight: "0.5%",
                    position: "relative",
                    float: "left",
                  }}
                >
                  <Input
                    sx={{
                      backgroundColor: "#ecfff6",
                      color: "#595959",
                      border: 0,
                      borderRadius: "0",
                      width: "100%",
                      height: "30px",
                      float: "left",
                      padding: "0 2.5%",
                    }}
                    placeholder="Nhập số lật bài"
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.3)",
                    width: "25%",
                    borderRadius: 0,
                    float: "left",
                    marginLeft: "1%",
                    height: "30px",
                    lineHeight: "30px",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1em",
                    cursor: "pointer",
                    border: 0,
                    padding: 0,
                  }}
                >
                  Lật bài
                </Box>
              </Box>
            </Box>
            <CustomText
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#ffcc00",
                fontSize: "0.75em",
                padding: "8px 3.5%",
              }}
            >
              ※Mỗi tổ hợp hãy dùng khoảng trắng, dấu phẩy, chấm phẩy để cách ra
            </CustomText>
            <CustomText
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#ffcc00",
                fontSize: "0.75em",
                padding: "0 3.5% 8px 3.5%",
              }}
            >
              Ví dụ đặt cược: 11,12,13,14,15,16
            </CustomText>
          </>
        )}
      </Box>

      {/* Repeat */}
      {showRepeatBox && (
        <Box
          sx={{
            position: "absolute",
            bottom: "35px",
            backgroundColor: "#f3f3f3",
            zIndex: "10",
            width: "100%",
            height: "471px",
          }}
        >
          <Box
            sx={{
              overflow: "auto",
              overflowY: "auto",
              height: "calc(100% - 10px)",
              paddingBottom: "6px",
            }}
          >
            {repeatHistory &&
              repeatHistory.map((item: HistoryItem) => (
                <Box
                  key={item.id}
                  sx={{
                    position: "relative",
                    width: "96%",
                    border: "1px solid #dfdfdf",
                    margin: "2% auto 0",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ padding: "5px 8px" }}>
                    <CustomText
                      sx={{
                        fontSize: "0.8em",
                        fontWeight: "bold",
                        lineHeight: "23px",
                        color: "#000",
                      }}
                    >
                      {item.title}
                    </CustomText>
                    <CustomText
                      sx={{
                        fontSize: "0.8em",
                        fontWeight: "bold",
                        lineHeight: "23px",
                        color: "#000",
                      }}
                    >
                      {item.type}
                    </CustomText>
                    <Flex>
                      <CustomText
                        sx={{
                          fontSize: "0.8em",
                          fontWeight: "bold",
                          lineHeight: "23px",
                          color: "#ff4747",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.code}
                      </CustomText>
                      <Image
                        onClick={() =>
                          handleRepeat(item.code, item.bet_type_id)
                        }
                        src="/images/main/icon_reapet.svg"
                        alt="Live"
                        width={18}
                        height={18}
                      />
                    </Flex>
                    <CustomText
                      sx={{
                        fontSize: "0.8em",
                        fontWeight: "bold",
                        lineHeight: "23px",
                        color: "#000",
                      }}
                    >
                      {item.code?.split(";").length} Tổ hợp
                    </CustomText>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          backgroundColor: "#000",
          width: "100%",
          zIndex: "10",
          height: "35px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 10px",
        }}
      >
        <Image
          src="/images/main/icon_liveChat.svg"
          alt="Live"
          width={22}
          height={22}
        />
        <Box sx={{ width: "80%", position: "relative" }}>
          <Box
            sx={{
              backgroundColor: "#e5e5e5",
              borderRadius: "12px",
              padding: "2px 75px 0 8px",
            }}
          >
            Cùng trò chuyện
          </Box>
          <Box
            sx={{
              width: "35px",
              height: "27px",
              cursor: "pointer",
              position: "absolute",
              right: "0",
              top: "0",
            }}
            onClick={() => setShowRepeatBox((prev) => !prev)}
          >
            <Box
              className="btn_showIcon icon_repeat"
              sx={{ width: "18px", height: "18px" }}
            />
          </Box>
        </Box>
        <Box sx={{ width: "10%" }}>
          <Image
            src="/images/main/btn_talkSend_m.svg"
            alt="Live"
            width={25}
            height={25}
          />
        </Box>
      </Box>
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
              <span style={{ color: "#fff600" }}>{validNumbers.length}</span>{" "}
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
      <ConfirmMobile
        drawName={currentDraw?.name ?? ""}
        drawId={currentDraw?.id ?? 0}
        drawNo={currentDraw?.draw_no ?? ""}
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
        drawCount={drawCount}
        disabled={isSubmitting}
        onConfirm={handleConfirm}
      />
      <PopupSuccess />
      <PopupError message={message} />
      <PopupLottoType
        tabActive={tabs[activeTab]}
        selectedButton={selectedButton?.id ?? 0}
        onChangeType={handleChangeType}
      />
      <PopupMakeTransfer />
      {timeLeft.hours == 0 &&
        timeLeft.minutes == 0 &&
        timeLeft.seconds == 0 && (
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
        )}
      {timeLeft.hours == 0 &&
        timeLeft.minutes == 0 &&
        timeLeft.seconds == 0 && (
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
              zIndex: "12",
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
              <span style={{ color: "#f8c214" }}>{currentDraw?.draw_no}</span>
              <br />
              Kèo đã đóng
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default VnLottoElec;
