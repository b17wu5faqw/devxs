import Flex from "@/components/utils/Flex";
import LiveVideo from "@/view/page/home/desktop/main/AnyTimePoker/components/LiveVideo";
import { useLiveKu } from "@/hooks/useLiveKu";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { baseColors } from "@/utils/colors";
import CustomText from "@/components/text/CustomText";
import {
  getBetType,
  getBetTypeList,
  sellLottoA,
  sellLottoC,
} from "@/apis/ku-lotto";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import CustomButton, { CustomButton2 } from "@/components/button/CustomButton";
import Img from "@/components/img/Img";
import PopupConfirm from "@/components/modal/_components/KuLive/PopupConfirm";
import { useAuthStore } from "@/stores/authStore";
import useBalanceStore from "@/stores/balanceStore";
import PopupSuccess from "@/components/modal/PopupSuccess";
import PopupError from "@/components/modal/PopupError";
import ResultOverlay from "./components/ResultOverlay";
import InputType3Digit from "./components/Input/InputType3Digit";
import InputType2Digit from "./components/Input/InputType2Digit";
import InputType5Digit from "./components/Input/InputType5Digit";
import InputTypeTaiXiu from "./components/Input/InputTypeTaiXiu";
import InputTypeT5 from "./components/Input/InputTypeT5";
import { useMenuStore } from "@/stores/useMenuStore";
import { useLottoKu } from "@/hooks/useLottoKu";

interface AnyTimePokerProps {
  gType?: number;
}

type Button = {
  id: number;
  help: string;
  name: string;
  description: string;
  input_type: number;
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
  options: BetOption[];
  groups: Group[];
};

type BetOption = {
  id: number;
  bet_type_id: number;
  option_key: string;
  option_label: string;
  odds: number;
  order_index: number;
  rule_condition: string;
};

type Group = {
  group_name: string;
  options: BetOption[];
};

const AnyTimeContent: React.FC<AnyTimePokerProps> = ({ gType = 166 }) => {
  const [subType, setSubType] = useState<SubType | null>(null);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [selectedButton, setSelectedButton] = useState<Button | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Hậu nhị");
  const [betChip, setBetChip] = useState(0);
  const [odds, setOdds] = useState(0);
  const [type, setType] = useState<Tabs | null>(null);
  const [input, setInput] = useState("");
  const [isVisibleExample, setIsVisibleExample] = useState(false);
  const [isVisibleDescription, setIsVisibleDescription] = useState(false);
  const [inputType, setInputType] = useState(2);
  const [message, setMessage] = useState<string>("");
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { accessToken } = useAuthStore();
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);

  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const { gameState } = useLottoKu(gType);
  const gameIdNumber = gType ? gType : 162;
  const winningCodes = gameState.winningCodes;

  const fetchBetTypeList = useCallback(async () => {
    const resp = await getBetTypeList();
    if (resp.status == 1) {
      setType(resp.data);
      setSelectedButton(resp.data[activeTab][0]?.buttons[0]);
    }
  }, [activeTab, gType]);

  useEffect(() => {
    fetchBetTypeList();
  }, [fetchBetTypeList]);

  const fetchBetType = useCallback(async () => {
    const resp = await getBetType(
      selectedButton?.id ? { betTypeId: selectedButton.id } : { betTypeId: 1 }
    );
    if (resp.status == 1) {
      setSubType(resp.data);
    }
  }, [selectedButton, gType]);

  useEffect(() => {
    fetchBetType();
  }, [fetchBetType]);

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

  const handleChangeInput = useCallback(
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

  const validNumbers = [...new Set(input.trim().split(" "))].filter(
    (num) => num.length === inputType
  );

  const handleClickChip = (num: number) => {
    setBetChip((prev) => {
      const newValue = prev + num;
      if (subType?.max_bet && newValue > subType.max_bet) {
        return subType.max_bet;
      }
      return newValue;
    });
  };

  const handleCancel = () => {
    setNumbers([]);
    setBetChip(0);
  };

  const totalChip = useMemo(() => {
    if (numbers.length === 0 || !betChip) return 0;

    const rate = subType?.price_rate ? Number(subType.price_rate) : 0;
    return betChip * rate * numbers.length;
  }, [betChip, numbers.length, subType?.price_rate]);

  const totalPrize = useMemo(() => {
    const prizeRate = subType?.prize_rate ? Number(subType.prize_rate) : 0;
    return totalChip * prizeRate;
  }, [totalChip, subType?.prize_rate]);

  const getSafeCountdown = () => {
    return Math.max(0, gameState.countdownSeconds || 0);
  };

  const handleSubmit = async () => {
    openModal(MODAL.CONFIRM_LIVE);
  };

  const tabs: Tabs = type || {};

  const handleButtonClick = (button: Button): void => {
    if (button.input_type === 2) {
      setBetChip(0);
      setSelectedButton(button);
      setInput("");
      openModal(MODAL.LIVE_INPUT_TYPE_3_DIGIT);
    } else if (button.input_type === 4) {
      setBetChip(0);
      setSelectedButton(button);
      setInput("");
      openModal(MODAL.LIVE_INPUT_TYPE_2_DIGIT);
    } else {
      setBetChip(0);
      setSelectedButton(button);
      setInput("");
    }
  };

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

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      if (!gameState.currentDraw?.id) return;
      let res;
      if (gameIdNumber == 166) {
        res = await sellLottoA({
          digits: numbers.join("-"),
          amount: totalChip,
          drawId: gameState.currentDraw.id,
          betTypeId: subType?.id ?? 0,
          betPoint: betChip,
          drawCount: 1,
          jwt_key: accessToken ?? "",
        });
      } else {
        res = await sellLottoC({
          digits: numbers.join("-"),
          amount: totalChip,
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
      closeModal();

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

  return (
    <Flex
      sx={{
        width: "1012px",
        padding: "5px 5px 0 5px",
        alignItems: "flex-start",
      }}
    >
      <Flex sx={{ flex: "1", flexDirection: "column" }}>
        <Flex
          sx={{
            background: "#4984bf",
            paddingX: "12px",
            paddingY: "0px",
            fontSize: "14px",
            color: baseColors.white,
            width: "100%",
            borderRight: "1px solid #fff",
          }}
        >
          Kỳ hiện tại
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
            {gameState.currentDraw?.draw_no}
          </CustomText>
          <Flex
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              height: "35px",
              flex: 1,
              marginLeft: "40px",
            }}
          >
            Đếm ngược：
            <CustomText
              sx={{
                background: "url(/images/common/bg_time.svg) no-repeat center",
                display: "block",
                backgroundSize: "100%",
                width: "40px",
                height: "28px",
                lineHeight: "28px",
                color: getSafeCountdown() <= 10 ? "#FF0000" : "#000",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {gameState.gamePhase === "finished"
                ? "00"
                : String(Math.floor(getSafeCountdown() / 60)).padStart(2, "0")}
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
                background: "url(/images/common/bg_time.svg) no-repeat center",
                display: "block",
                backgroundSize: "100%",
                width: "40px",
                height: "28px",
                lineHeight: "28px",
                color: getSafeCountdown() <= 10 ? "#FF0000" : "#000",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {gameState.gamePhase === "finished"
                ? "00"
                : String(getSafeCountdown() % 60).padStart(2, "0")}
            </CustomText>
          </Flex>
        </Flex>
        <LiveVideo
          gType={gType}
          winningCodes={winningCodes}
          gamePhase={gameState.gamePhase}
        />
        <Box sx={{ position: "relative", width: "800px" }}>
          {gameState.countdownSeconds <= 0 && gameState.showResultOverlay && (
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
          {gameState.gamePhase === "finished" && (
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
              display:
                numbers.length > 0 &&
                subType?.input_type !== 5 &&
                subType?.input_type !== 10
                  ? "block"
                  : "none",
            }}
          ></Box>
          <ResultOverlay
            isVisible={gameState.showResultOverlay}
            winningCodes={winningCodes}
            revealedCodes={gameState.resultAnimation.revealedCodes}
            isAnimating={gameState.resultAnimation.isAnimating}
            onClose={() => {}}
          />
          <Flex
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "4px",
              padding: "11px 4px 1px 0",
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
            <CustomText
              sx={{
                color: "#ff0000",
                flex: "1",
                textAlign: "right",
                fontSize: "12px",
                paddingTop: "10px",
              }}
            >
              ※1 kỳ đặt cược tối đa {subType?.max_number ?? 65} con số
            </CustomText>
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
                  <CustomText sx={{ width: "120px", fontSize: "14px" }}>
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

            <Box
              sx={{
                backgroundColor: baseColors.white,
                margin: "0 5px",
                paddingBottom: "20px",
              }}
            >
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
                  Hướng dẫn：{selectedButton ? selectedButton.description : ""}
                </CustomText>
                <Flex sx={{ width: "150px" }}>
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
                          subType?.example.split("<br>").map((line, index) => (
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
                    <CustomText sx={{ fontSize: "12px" }}>Trợ giúp</CustomText>
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
                          subType?.help.split("<br>").map((line, index) => (
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
                  height: "auto",
                  border: "1px solid #c4c4c4",
                  backgroundColor: "#efefef",
                  padding: "3px 0 2px 0",
                  position: "relative",
                }}
              >
                <Flex sx={{ alignItems: "flex-start" }}>
                  {subType?.input_type == 5 && (
                    <InputType5Digit setNumbers={setNumbers} />
                  )}
                  {subType?.input_type == 10 && (
                    <InputTypeTaiXiu setNumbers={setNumbers} />
                  )}
                  {subType?.input_type == 11 && (
                    <InputTypeT5
                      setNumbers={setNumbers}
                      groups={subType?.groups || []}
                      setOdds={setOdds}
                    />
                  )}
                  {subType?.input_type == 1 && (
                    <>
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
                    </>
                  )}
                </Flex>
                <div className="px-3 py-2 hidden gap-3">
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
            <span className="text-[#fe0000] text-sm">
              X{subType?.price_rate}
            </span>
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
            <span className="color_red">
              {odds ? odds : subType?.prize_rate}
            </span>
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
              disabled={totalChip === 0 || gameState.gamePhase === "finished"}
              onClick={() => handleSubmit()}
              className="disabled:bg-[#898989] bg-[#336aab] text-white text-center w-[110px] h-[35px] m-[5px_0px_2px] rounded-[3px]"
            >
              Xác nhận gửi đi
            </button>
          </div>
        </div>
      </Box>
      <PopupConfirm
        drawName={gameIdNumber == 166 ? "Live A" : "Live B"}
        drawNo={gameState.currentDraw?.draw_no ?? ""}
        title={subType?.title ?? ""}
        numbers={numbers}
        inputType={inputType}
        betChip={betChip}
        totalChip={totalChip}
        rate={subType?.rate ? Number(subType.rate) : 0}
        prizeRate={
          odds ? odds : subType?.prize_rate ? Number(subType.prize_rate) : 0
        }
        totalPrize={totalPrize}
        drawCount={1}
        lottoType={1}
        disabled={isSubmitting}
        onConfirm={handleConfirm}
      />
      <PopupSuccess />
      <PopupError message={message} />
      <InputType2Digit
        onConfirm={(numbers) => setNumbers(numbers)}
        title={subType?.title ?? ""}
      />
      <InputType3Digit
        onConfirm={(numbers) => setNumbers(numbers)}
        title={subType?.title ?? ""}
      />
    </Flex>
  );
};

export default AnyTimeContent;
