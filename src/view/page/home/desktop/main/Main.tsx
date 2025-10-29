"use client";
export const dynamic = "force-dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
import { baseColors } from "@/utils/colors";
import CustomButton, { CustomButton2 } from "@/components/button/CustomButton";
import Img from "@/components/img/Img";
import { useHistory } from "@/hooks/useLotto";
import { getBetRule, getCurrentDraw, getTypeV2, sellLotto } from "@/apis/lotto";
import Result from "./Result";
import { z } from "zod";
import useModalStore from "@/stores/modalStore";
import { MODAL } from "@/constant/modal";
import PopupConfirm from "@/components/modal/PopupConfirm";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupError from "@/components/modal/PopupError";
import { useMenuStore } from "@/stores/useMenuStore";
import { useAuthStore } from "@/stores/authStore";
import useBalanceStore from "@/stores/balanceStore";
import PopupInfoMobile from "@/components/modal/PopupInfoMobile";
import LoXien from "@/components/game-input/LoXien";
import LoTruot from "@/components/game-input/LoTruot";
import PopupSuccessQuota from "@/components/modal/PopupSuccessQuota";

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
  max_bet: number;
  max_number: number;
};

export interface DrawType {
  id?: number;
  draw_no?: string;
  end_time?: string;
  name?: string;
}

function Main() {
  const { scheduleId, typeId, regionId } = useMenuStore();
  const [activeTab, setActiveTab] = useState<string>("2D");
  const [selectedButton, setSelectedButton] = useState<Button | null>(null);
  const [type, setType] = useState<Tabs | null>(null);
  const [subType, setSubType] = useState<SubType | null>(null);
  const [input, setInput] = useState("");
  const [betChip, setBetChip] = useState(0);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isDrawClosed, setIsDrawClosed] = useState(false);
  const [currentDraw, setCurrentDraw] = useState<DrawType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVisibleDescription, setIsVisibleDescription] = useState(false);
  const [isVisibleExample, setIsVisibleExample] = useState(false);
  const { accessToken } = useAuthStore();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const { reloadHistory } = useHistory(1, 20);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const [inputType, setInputType] = useState(2);
  const [duplicates, setDuplicates] = useState<string[]>([]);

  const fetch = useCallback(async () => {
    if (regionId === null) return;

    const resp = await getTypeV2({ regionId: regionId, schedulerId: Number(scheduleId), type: Number(typeId) });
    if (resp.status == 1) {
      setType(resp.data);
      if (activeTab === "4D") {
        setSelectedButton(resp.data[activeTab][0]?.buttons[2]);
      } else {
        setSelectedButton(resp.data[activeTab][0]?.buttons[4]);
      }
    }
  }, [regionId, activeTab]);

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
  }, [selectedButton]);

  useEffect(() => {
    fetchSubType();
  }, [fetchSubType]);

  const fetchCurrentDraw = useCallback(async () => {
    if (scheduleId === null || typeId === null) return;
    try {
      const data = await getCurrentDraw({
        schedule_id: scheduleId,
        lotto_type: typeId,
      });
      setCurrentDraw(data.data);
    } catch (err: any) {
      console.error("Error fetching current draw:", err);
    }
  }, [scheduleId, typeId]);

  useEffect(() => {
    fetchCurrentDraw();
  }, [fetchCurrentDraw]);

  const tabs: Tabs = type || {};

  const handleButtonClick = (button: Button) => {
    setBetChip(0);
    if (button.id === 8 || button.id === 64) {
      openModal(MODAL.LO_XIEN);
    } else if (button.id === 66) {
      openModal(MODAL.LO_TRUOT);
    } else {
      setSelectedButton(button);
      setInput("");
    }
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
      calculateTimeLeft(targetTime || "00:60:00")
    );

    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(targetTime || "00:60:00");
        setTimeLeft(newTimeLeft);

        if (
          newTimeLeft.hours === 0 &&
          newTimeLeft.minutes === 0 &&
          newTimeLeft.seconds === 0
        ) {
          setIsClosed(true);
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
    currentDraw?.end_time || "",
    fetchCurrentDraw
  );

  const tabMapping: { [key: string]: number } = {
    "2D": 2,
    "3D": 3,
    "4D": 4,
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const defaultButton = Array.isArray(tabs[tab])
      ? tabs[tab][0]?.buttons[4]
      : null;
    setSelectedButton(defaultButton);
    setInputType(tabMapping[tab] || 2);
    setInput("");
    setBetChip(0);
  };

  const handleClickChip = (num: number) => {
    setBetChip((prev) => {
      const newValue = prev + num;
      if (subType?.max_bet && newValue > subType.max_bet) {
        return subType.max_bet;
      }
      return newValue;
    });
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue === "") {
        setBetChip(0);
        return;
      }
      const numValue = Number(newValue);
      if (!isNaN(numValue)) {
        if (subType?.max_bet && numValue > subType.max_bet) {
          setBetChip(subType.max_bet);
        } else {
          setBetChip(numValue);
        }
      }
    },
    [subType]
  );

  const totalChip = useMemo(() => {
    if (numbers.length === 0 || !betChip) return 0;

    const rate = subType?.rate ? Number(subType.rate) : 0;
    return betChip * rate * numbers.length;
  }, [betChip, numbers.length, subType?.rate]);

  const totalPrize = useMemo(() => {
    const prizeRate = subType?.prize_rate ? Number(subType.prize_rate) : 0;
    return totalChip * prizeRate;
  }, [totalChip, subType?.prize_rate]);

  useEffect(() => {
    handleTabChange(activeTab);
  }, [activeTab]);

  const handleAddNumbers = () => {
    if (!subType?.max_number || validNumbers.length > subType.max_number) {
      setMessage("Con số đã chọn vượt quá qui định 1 kỳ");
      openModal(MODAL.ERROR);
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
    }
  };

  const handleCancel = () => {
    setNumbers([]);
    setBetChip(0);
    // setTotalChip(0);
  };

  const handleSubmit = async () => {
    openModal(MODAL.CONFIRM);
  };

  const handleConfirm = useCallback(async () => {
    if (!currentDraw?.id) {
      setMessage("No active draw found");
      openModal(MODAL.ERROR);
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await sellLotto({
        digits: numbers.join("-"),
        bet_point: betChip,
        amount: totalChip,
        total_amount: totalChip,
        drawId: currentDraw.id,
        betTypeId: subType?.id ?? 0,
        jwt_key: accessToken ?? "",
        region_id: regionId ?? 1,
        lotto_type: typeId ?? 1,
      });

      // Reset state regardless of response
      setNumbers([]);
      setBetChip(0);
      setInput("");
      closeModal();

      // Handle response
      if (res.status === 1) {
        await reloadHistory();
        openModal(MODAL.SUCCESS);
        fetchBalance();
      } else if (res.status === 2) {
        await reloadHistory();
        setMessage(res.description);
        openModal(MODAL.SUCCESS_QUOTA);
        fetchBalance();
      } else {
        setMessage(res.description || "Unknown error occurred");
        openModal(MODAL.ERROR);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        setMessage(errorMessage);
      } else {
        setMessage("Failed to submit bet. Please try again.");
        console.error("Failed to create post:", error);
      }
      openModal(MODAL.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentDraw?.id,
    numbers,
    betChip,
    totalChip,
    subType?.id,
    accessToken,
    closeModal,
    openModal,
    reloadHistory,
    fetchBalance,
  ]);

  useEffect(() => {
    if (timeLeft.hours == 0 && timeLeft.minutes == 0 && timeLeft.seconds == 0) {
      setIsDrawClosed(true);
      setNumbers([]);
      fetchCurrentDraw();
    } else {
      setIsDrawClosed(false);
    }
  }, [timeLeft, fetchCurrentDraw]);

  //Optimized handleChangeInput function
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Remove all non-numeric characters
      const value = e.target.value.replace(/[^0-9]/g, "");

      // Format with spaces based on inputType (2D, 3D, or 4D)
      const chars = [];
      for (let i = 0; i < value.length; i++) {
        chars.push(value[i]);
        // Add space after every 2, 3, or 4 digits (based on inputType)
        if ((i + 1) % inputType === 0 && i + 1 !== value.length) {
          chars.push(" ");
        }
      }

      setInput(chars.join(""));
    },
    [inputType]
  );

  const validNumbers = [...new Set(input.trim().split(" "))].filter(
    (num) => num.length === inputType
  );

  const handleClose = async () => {
    closeModal();
  };

  return (
    <Flex
      sx={{
        width: "1012px",
        padding: "5px 5px 0 5px",
        alignItems: "flex-start",
      }}
    >
      <Flex sx={{ flex: "1", flexDirection: "column" }}>
        <Flex>
          <Result timeLeft={timeLeft} />
        </Flex>
        <Flex
          sx={{
            background: "#f3f3f3",
            width: "800px",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Flex
            sx={{
              background: "#4984bf",
              paddingX: "12px",
              paddingY: "4px",
              fontSize: "14px",
              color: baseColors.white,
              width: "100%",
            }}
          >
            Đài chính: {currentDraw?.name}
            <CustomText sx={{ paddingX: "4px", color: baseColors.white }}>
              :
            </CustomText>
            <CustomText
              sx={{
                paddingX: "4px",
                color: baseColors.yellow,
                marginLeft: "4px",
                width: "90px",
              }}
            >
              Kỳ: {currentDraw?.draw_no}
            </CustomText>
            <Flex
              sx={{
                display: "inline-flex",
                justifyContent: "flex-start",
                height: "35px",
                flex: 1,
                marginLeft: "40px",
              }}
            >
              Đếm ngược：
              <CustomText
                sx={{
                  background:
                    "url(/images/common/bg_time.svg) no-repeat center",
                  display: "block",
                  backgroundSize: "100%",
                  width: "40px",
                  height: "28px",
                  lineHeight: "28px",
                  color: baseColors.black,
                  textAlign: "center",
                  fontSize: "24px",
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
                  fontSize: "24px",
                }}
              >
                :
              </CustomText>
              <CustomText
                sx={{
                  background:
                    "url(/images/common/bg_time.svg) no-repeat center",
                  display: "block",
                  backgroundSize: "100%",
                  width: "40px",
                  height: "28px",
                  lineHeight: "28px",
                  color: baseColors.black,
                  textAlign: "center",
                  fontSize: "24px",
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
                  fontSize: "24px",
                }}
              >
                :
              </CustomText>
              <CustomText
                sx={{
                  background:
                    "url(/images/common/bg_time.svg) no-repeat center",
                  display: "block",
                  backgroundSize: "100%",
                  width: "40px",
                  height: "28px",
                  lineHeight: "28px",
                  color: baseColors.black,
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {timeLeft.seconds.toString().padStart(2, "0")}
              </CustomText>
            </Flex>
            <CustomText
              onClick={() =>
                window.open("http://xosothudo.com.vn/#show-news", "_blank")
              }
              sx={{
                float: "right",
                paddingY: "4px",
                color: baseColors.white,
                fontSize: "13px",
                width: "80px",
                textAlign: "center",
                backgroundColor: "#fd8805",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Trang chủ
            </CustomText>
          </Flex>
          <Box sx={{ position: "relative" }}>
            {isDrawClosed && (
              <Box
                sx={{
                  position: "absolute",
                  top: "0",
                  width: "800px",
                  height: "470px",
                  backgroundImage: "url(/images/main/bg_cover.png)",
                  zIndex: "99",
                }}
              />
            )}
            <Box
              sx={{
                position: "absolute",
                width: "800px",
                height: "470px",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 99,
                display: numbers.length ? "block" : "none",
              }}
            ></Box>
            <Flex
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                gap: "4px",
                padding: "11px 4px 1px 5px",
              }}
            >
              {Object.keys(tabs).map((tab) => (
                <CustomButton
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    fontSize: "12px",
                    textTransform: "unset",
                    backgroundColor:
                      activeTab === tab ? "#fff" : baseColors.bgGray,
                    color: activeTab === tab ? "#106eb6" : baseColors.black,
                    borderTop:
                      activeTab === tab
                        ? "3px solid #106eb6"
                        : "3px solid #dddddd",
                  }}
                >
                  {tab}
                </CustomButton>
              ))}
              <CustomText
                sx={{
                  color: "#ff0000",
                  flex: "1",
                  textAlign: "right",
                  fontSize: "12px",
                }}
              >
                ※1 kỳ đặt cược tối đa {subType?.max_number ?? 65} con số
              </CustomText>
            </Flex>
            <Flex
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                paddingX: "5px",
                marginX: "5px",
                backgroundColor: baseColors.white,
              }}
            >
              {Array.isArray(tabs[activeTab]) &&
                tabs[activeTab].map((group, index) => (
                  <Flex
                    key={index}
                    sx={{
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "2px",
                      padding: "10px 0 0 10px",
                    }}
                  >
                    <CustomText sx={{ width: "82px", fontSize: "14px" }}>
                      {group.groupTitle}
                    </CustomText>
                    {group.buttons.map((button) => (
                      <CustomButton2
                        key={button.id}
                        onClick={() => handleButtonClick(button)}
                        sx={{
                          backgroundPosition:
                            selectedButton?.id === button.id ? "bottom" : "top",
                          color:
                            selectedButton?.id === button.id
                              ? baseColors.red
                              : baseColors.black,
                        }}
                      >
                        {button.name}
                      </CustomButton2>
                    ))}
                  </Flex>
                ))}

              <Box sx={{ backgroundColor: baseColors.white, margin: "0 5px" }}>
                <Flex
                  sx={{
                    justifyContent: "space-between",
                    padding: "10px 0 10px 10px",
                    alignItems: "center",
                  }}
                >
                  <CustomText
                    sx={{
                      color: "#106eb6",
                      lineHeight: "19px",
                      fontSize: "12px",
                    }}
                  >
                    Hướng dẫn：{selectedButton ? selectedButton.help : ""}
                  </CustomText>
                  <Flex>
                    <Flex
                      sx={{
                        cursor: "pointer",
                        gap: "4px",
                        paddingRight: "12px",
                        alignItems: "center",
                        textDecorationLine: "underline",
                      }}
                    >
                      <Img url="/images/lotto/icon_Gstar.png" sx={{}} />
                      <CustomText sx={{ fontSize: "12px" }}>Số nóng</CustomText>
                    </Flex>
                    <Flex
                      onMouseEnter={() => setIsVisibleExample(true)}
                      onMouseLeave={() => setIsVisibleExample(false)}
                      sx={{
                        cursor: "pointer",
                        gap: "4px",
                        paddingRight: "12px",
                        alignItems: "center",
                        textDecorationLine: "underline",
                        position: "relative",
                      }}
                    >
                      <Img url="/images/lotto/icon_cnATHint.png" sx={{}} />
                      <CustomText sx={{ fontSize: "12px" }}>Ví dụ</CustomText>
                      {isVisibleExample && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "20px",
                            right: "0",
                            backgroundColor: "#ffffcd",
                            padding: "10px",
                            border: "1px solid #b3b3b3",
                            width: "280px",
                            maxWidth: "370px",
                            fontSize: "14px",
                            zIndex: 99,
                          }}
                        >
                          {subType?.example != null &&
                            subType?.example
                              .split("<br>")
                              .map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                        </Box>
                      )}
                    </Flex>
                    <Flex
                      onMouseEnter={() => setIsVisibleDescription(true)}
                      onMouseLeave={() => setIsVisibleDescription(false)}
                      sx={{
                        cursor: "pointer",
                        gap: "4px",
                        paddingRight: "12px",
                        alignItems: "center",
                        textDecorationLine: "underline",
                        position: "relative",
                      }}
                    >
                      <Img url="/images/lotto/icon_ay2Hint.png" sx={{}} />
                      <CustomText sx={{ fontSize: "12px" }}>
                        Trợ giúp
                      </CustomText>
                      {isVisibleDescription && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "20px",
                            right: "0",
                            backgroundColor: "#ffffcd",
                            padding: "10px",
                            border: "1px solid #b3b3b3",
                            width: "300px",
                            maxWidth: "370px",
                            fontSize: "14px",
                            zIndex: 99,
                          }}
                        >
                          {subType &&
                            subType?.description
                              .split("<br>")
                              .map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
                <Box
                  sx={{
                    height: "210px",
                    border: "1px solid #c4c4c4",
                    backgroundColor: "#efefef",
                    padding: "3px 0 2px 0",
                    position: "relative",
                  }}
                >
                  <Flex sx={{ alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        margin: "7px 10px 5px 10px",
                        width: "610px",
                        height: "150px",
                        border: "1px solid #c4c4c4",
                      }}
                    >
                      <textarea
                        className="w-full h-full p-2 border-0 focus-visible:outline-none"
                        placeholder="Nhập số đặt cược"
                        value={input}
                        onChange={handleChangeInput}
                      ></textarea>
                    </Box>
                    <Flex
                      sx={{
                        alignItems: "center",
                        marginTop: "7px",
                        marginRight: "7px",
                        flex: "1",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button className="w-full h-[35px] bg-[#898989] text-white leading-[35px] rounded-[3px] text-sm">
                        Xóa
                      </button>
                      <button
                        onClick={handleAddNumbers}
                        disabled={!input.trim()}
                        className="w-full h-[35px] disabled:bg-[#898989] bg-[#336aab] text-white leading-[35px] rounded-[3px] text-sm cursor-pointer"
                      >
                        Thêm vào D.sách
                      </button>
                      <span className="text-sm">
                        Đã nhập{" "}
                        <span className="text-[#007eff]">
                          {validNumbers.length}
                        </span>{" "}
                        đơn
                      </span>
                    </Flex>
                  </Flex>
                  <div className="px-3 py-2 flex gap-3">
                    <div className="flex gap-2">
                      <span>Nhập số：</span>
                      <input className="w-[65px]" />
                      <div className="bg-[#00b2b9] text-white text-sm h-[26px] leading-[28px] text-center cursor-pointer px-2 rounded-[3px]">
                        Lật bài
                      </div>
                    </div>
                    <div>
                      <span className="btn_change">Chọn</span>
                      <div className="btn_changeBox">
                        <table className="selectCox vn">
                          <tbody>
                            <tr>
                              <td className="w-16 h-8">Số đầu</td>
                              <td className="h-8">
                                <ul>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    0
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    1
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    2
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    3
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    4
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    5
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    6
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    7
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    8
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    9
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="w-16 h-8">Số đuôi</td>
                              <td className="h-8">
                                <ul>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    0
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    1
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    2
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    3
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    4
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    5
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    6
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    7
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    8
                                  </li>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    9
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="w-16 h-8">Số đôi</td>
                              <td className="h-8">
                                <ul>
                                  <li className="w-[25px] h-[25px] bg-[#008aff] text-white rounded-[3px] cursor-pointer inline-block text-center ml-2">
                                    10
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Box sx={{ width: "200px", backgroundColor: baseColors.white }}>
        <Flex
          sx={{
            backgroundColor: "#4984bf",
            height: "35px",
            lineHeight: "35px",
            color: "#fff",
            fontSize: "14px",
            padding: "0 10px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText sx={{ fontSize: "14px", color: "#fff" }}>
            Danh sách đơn cược
          </CustomText>
        </Flex>
        <Box>
          <Box
            sx={{
              backgroundColor: "#f3f3f3",
              padding: "8px 0",
              color: "#0073de",
              textAlign: "center",
              borderBottom: "1px solid #cccccc",
              width: "100%",
            }}
          >
            <CustomText sx={{ fontSize: "16px", color: "#0073de" }}>
              {subType?.title}
            </CustomText>
          </Box>
          <Box sx={{ height: "442px", padding: "8px" }}>
            <CustomText>Chọn số</CustomText>
            <Box sx={{ color: "#f00", fontSize: "16px", fontWeight: "600" }}>
              {numbers.join(", ")}
            </Box>
          </Box>
        </Box>
        <div className="bg-[#b3d2f2] border-b-[1px] border-b-[#7b9fc5] p-[5px_10px]">
          <div className="text-sm">
            Đơn cược：<span className="color_blue">{numbers.length}</span>
          </div>
          <div className="relative flex items-center gap-2">
            <label className="text-sm">
              Tiền cược：
              <input
                value={betChip}
                onChange={handleChange}
                className="w-[58px] h-[30px] rounded-[3px] px-[7px] border border-[#fff] bg-white"
              />
            </label>
            <span className="text-[#fe0000] text-sm">X{subType?.rate}</span>
          </div>
          <div className="bg-white border boder-[#ccc] my-2">
            <div className="relative">
              <div className="chipWraps">
                <span className="chip_close"></span>
                <div id="divAllChip" className="allChipBox">
                  <div className="chipBoxItem">
                    <div
                      onClick={() => handleClickChip(1)}
                      className="chip_Text icon_chip_1"
                    >
                      <span>1</span>
                    </div>
                    <div
                      onClick={() => handleClickChip(5)}
                      className="chip_Text icon_chip_5"
                    >
                      <span>5</span>
                    </div>
                    <div
                      onClick={() => handleClickChip(10)}
                      className="chip_Text icon_chip_10"
                    >
                      <span>10</span>
                    </div>
                  </div>
                  <div className="chipBoxItem">
                    <div
                      onClick={() => handleClickChip(100)}
                      className="chip_Text icon_chip_100"
                    >
                      <span>100</span>
                    </div>
                    <div
                      onClick={() => handleClickChip(500)}
                      className="chip_Text icon_chip_500"
                    >
                      <span>500</span>
                    </div>
                    <div
                      onClick={() => handleClickChip(1000)}
                      className="chip_Text icon_chip_1000"
                    >
                      <span>1000</span>
                    </div>
                  </div>
                </div>
                <div id="divBetChip" className="betlistChip">
                  <div className="chip_Text icon_chip_1">
                    <span>1</span>
                  </div>
                  <div className="chip_Text icon_chip_5">
                    <span>5</span>
                  </div>
                  <div className="chip_Text icon_chip_10">
                    <span>10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-black h-[30px] leading-[30px] text-sm">
            T.tiền cược：
            <span>{totalChip}</span>
          </div>
        </div>
        <div className="bg-[#b3d2f2] border-t-[1px] border-t-[#fff] h-[110px] p-[8px_10px]">
          <div>
            <span>Tỉ lệ :</span>
            <span className="color_red">{subType?.prize_rate}</span>
          </div>
          <div>
            Tiền thắng：<span className="color_blue">{totalPrize}</span>
          </div>
          <div className="text-sm flex gap-2">
            <button
              onClick={() => handleCancel()}
              className="bg-[#898989] text-white text-center w-[60px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
            >
              Hủy
            </button>
            <button
              disabled={
                totalChip === 0 ||
                (timeLeft.hours === 0 &&
                  timeLeft.minutes === 0 &&
                  timeLeft.seconds === 0)
              }
              onClick={() => handleSubmit()}
              className="disabled:bg-[#898989] bg-[#336aab] text-white text-center w-[110px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
            >
              Xác nhận gửi đi
            </button>
          </div>
        </div>
      </Box>
      <PopupInfoMobile duplicates={duplicates} onConfirm={handleClose} />
      <PopupConfirm
        drawName={currentDraw?.name ?? ""}
        drawNo={currentDraw?.draw_no ?? ""}
        title={subType?.title ?? ""}
        numbers={numbers.map(Number)}
        betChip={betChip}
        totalChip={totalChip}
        rate={subType?.rate ? Number(subType.rate) : 0}
        prizeRate={subType?.prize_rate ? Number(subType.prize_rate) : 0}
        totalPrize={totalPrize}
        disabled={isSubmitting}
        onConfirm={handleConfirm}
      />
      <PopupSuccess />
      <PopupSuccessQuota message={message} />
      <PopupError message={message} />
      <LoXien currentDraw={currentDraw} />
      <LoTruot currentDraw={currentDraw} />
    </Flex>
  );
}

export default Main;
