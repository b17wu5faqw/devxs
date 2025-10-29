import { MODAL } from "@/constant/modal";
import {
  useListLastDraw
} from "@/hooks/useSicbo";
import useModalStore from "@/stores/modalStore";
import { Dialog, Grow } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import FlexReverse from "../../../utils/FlexReverse";
import ChatroomBar from "../common/ChatroomBar";

const blinkingStyle = `
  @keyframes blink-result {
    0%, 50% { background-color: #FFD700; }
    51%, 100% { background-color: #FF4500; }
  }
  .blink-result {
    animation: blink-result 0.5s infinite;
  }
  
  @keyframes result-notification-flicker {
    0%, 49% { background-color: transparent; }
    50%, 100% { background-color: rgba(179, 160, 94, 0.5); } /* Semi-transparent #B3A05E */
  }
  .result-notification-flicker-bg {
    animation: result-notification-flicker 0.5s infinite;
  }
  
  .final_sic_a {
    width: 11vw;
    height: auto;
    position: absolute;
    top: 14vw;
    left: 35vw;
  }
  
  .final_sic_b {
    width: 12vw;
    height: auto;
    position: absolute;
    top: 25vw;
    left: 47vw;
  }
  
  .final_sic_c {
    width: 10vw;
    height: auto;
    position: absolute;
    top: 9vw;
    left: 46vw;
  }
  
  .final_sic_d {
    width: 11vw;
    height: auto;
    position: absolute;
    top: 17vw;
    left: 56vw;
  }
`;

interface Props {
  isOpen?: boolean;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

enum GamePhase {
  BETTING = "betting",
  BETTING_ENDING = "betting_ending",
  CLOSED = "closed",
  PLAYING_VIDEO = "playing_video",
  SHOWING_RESULT = "showing_result",
  NEW_ROUND_STARTING = "new_round_starting",
}

const useCountdown = (
  onComplete: () => void,
  resetTrigger: number,
  gamePhase: GamePhase
) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 25,
  });
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft({ hours: 0, minutes: 0, seconds: 25 });
    setHasCompleted(false);
  }, [resetTrigger]);

  useEffect(() => {
    if (
      gamePhase === GamePhase.PLAYING_VIDEO ||
      gamePhase === GamePhase.SHOWING_RESULT ||
      gamePhase === GamePhase.CLOSED
    ) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.minutes * 60 + prev.seconds;

        if (totalSeconds > 1) {
          const newTotal = totalSeconds - 1;
          const minutes = Math.floor(newTotal / 60);
          const seconds = newTotal % 60;
          return { hours: 0, minutes, seconds };
        } else if (totalSeconds === 1) {
          return { hours: 0, minutes: 0, seconds: 0 };
        } else if (totalSeconds === 0 && !hasCompleted) {
          setHasCompleted(true);
          onComplete();
          return { hours: 0, minutes: 0, seconds: 0 };
        } else {
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete, hasCompleted, gamePhase]);

  useEffect(() => {
    if (
      gamePhase === GamePhase.PLAYING_VIDEO ||
      gamePhase === GamePhase.SHOWING_RESULT ||
      gamePhase === GamePhase.CLOSED
    ) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [gamePhase]);

  return timeLeft;
};

function PopupAnyTimeKUMobile({ isOpen: propIsOpen }: Props) {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.ANYTIME_KU_MOBILE)
  );
  const modalData = useModalStore((state) => state.getModalData());
  const closeModal = useModalStore((state) => state.closeModal);
  const gameTitle = modalData?.gameTitle || "Xóc Đĩa KU";
  const {
    data: lastDrawsData,
    isLoading: isLastDrawsLoading,
    error: lastDrawsError,
  } = useListLastDraw();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.BETTING);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState("");
  const [lastResult, setLastResult] = useState<any>(null);
  const [blinkingResults, setBlinkingResults] = useState<string[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<Date>(new Date());
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [flopInputValue, setFlopInputValue] =
    useState<string>("Nhập số lật bài");
  const [showClearButton, setShowClearButton] = useState(false);
  const [showSelectPopup, setShowSelectPopup] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    value: "0",
    label: "200 Kỳ",
  });

  const [currentDraw, setCurrentDraw] = useState<{
    id?: number;
    draw_no?: string;
    end_time?: string;
    name?: string;
  }>({
    id: 1,
    draw_no: "XD250608385",
    end_time: "2024-12-31T23:59:59",
    name: "Xóc Đĩa KU",
  });

  const countdown = useCountdown(
    () => {
      handleCountdownComplete();
    },
    resetTrigger,
    gamePhase
  );

  const recentDraws =
    lastDrawsData && !isLastDrawsLoading
      ? Array.isArray(lastDrawsData)
        ? lastDrawsData
        : lastDrawsData.data
      : [];

  const handleCountdownComplete = useCallback(() => {
    if (
      gamePhase !== GamePhase.BETTING &&
      gamePhase !== GamePhase.BETTING_ENDING
    ) {
      return;
    }

    setShowOverlay(true);
    setOverlayText(`Kỳ ${currentDraw.draw_no?.slice(-4)} Kèo đã đóng`);

    setGamePhase(GamePhase.PLAYING_VIDEO);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.loop = false;
        videoRef.current.muted = true;

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {})
            .catch((error) => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current
                  .play()
                  .catch((e) => console.error("Second attempt failed:", e));
              }
            });
        }
      } else {
      }

      setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
    }, 200);
  }, [gamePhase, currentDraw.draw_no]);

  const handleFlopInputFocus = () => {
    if (flopInputValue === "Nhập số lật bài") {
      setFlopInputValue("");
    }
    setShowClearButton(true);
  };

  const handleFlopInputBlur = () => {
    if (flopInputValue === "") {
      setFlopInputValue("Nhập số lật bài");
      setShowClearButton(false);
    }
  };

  const handleFlopInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlopInputValue(e.target.value);
  };

  const handleClearFlopInput = () => {
    setFlopInputValue("");
    setShowClearButton(false);
  };

  const handleStraightFlop = () => {
  };

  const handleSelectClick = () => {
    setShowSelectPopup(true);
  };

  const handleSelectOption = (value: string, label: string) => {
    setSelectedPeriod({ value, label });
    setShowSelectPopup(false);
  };

  const handleCloseSelectPopup = () => {
    setShowSelectPopup(false);
  };

  return (
    <>
      <style>{blinkingStyle}</style>
      <Dialog
        fullScreen
        open={isOpen}
        TransitionComponent={Grow}
        onClose={closeModal}
        PaperProps={{
          sx: {
            background: "#111111",
            paddingBottom: "46px",
          },
        }}
      >
        <FlexReverse>
          {/* Header */}
          <div className="header_top relative w-full h-[55px] border-b border-b-[rgb(53,66,62)] bg-[rgb(31,71,51)] text-black text-base font-arial text-center flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div
                id="divBackUrl"
                className="btn_home block static w-[45px] h-[55px] ml-[5px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_home.svg')] bg-[length:auto_55%] bg-no-repeat bg-center opacity-50 float-left cursor-pointer"
              ></div>
              <div
                id="divBtn_Results"
                className="btn_lotteryResult block static w-[45px] h-[55px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_lotteryResult.svg')] bg-[length:auto_56%] bg-no-repeat bg-center opacity-50 float-left cursor-pointer"
              ></div>
            </div>

            <div className="w-fit h-[35px] my-[10px] flex items-center justify-center gap-1 px-[10px] border border-[rgba(255,255,255,0.5)] rounded-[5px] text-white text-base font-arial leading-[35px] text-nowrap">
              {gameTitle}
              <ChevronRight className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between">
              <div
                id="divBtnReportBet"
                className="btn_betRecord block static w-[45px] h-[55px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_betRecord.svg')] bg-[length:auto_48%] bg-no-repeat bg-center opacity-50 float-left cursor-pointer"
              ></div>
              <div className="btn_menu block static w-[45px] h-[55px] mr-[5px] border-0 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_menu.svg')] bg-[length:auto_48%] bg-no-repeat bg-center opacity-50 float-left cursor-pointer"></div>
            </div>
          </div>

          {/* User Header */}
          <div
            id="divUserHeader"
            className="headerPage_down showVideo table static w-full h-[39px] px-[12.8906px] border-0 bg-[rgb(16,31,26)] bg-repeat bg-[0%_0%] text-black text-base font-normal text-center leading-[38px] overflow-visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[215px_19.5px] transition-all outline-none align-baseline border-separate"
          >
            <div className="header_phase table-cell static w-[141.469px] h-[39px] border-0 bg-repeat bg-[0%_0%] text-white text-[21.6px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[70.7344px_19.5px] transition-all outline-none align-middle border-separate">
              <div
                id="divBetBtn_Video"
                className="btn_Camera block static w-[45px] h-[38px] border-0 bg-[url('https://cuvnin.gs6168.com/images/graph/common/btn_camera_on.svg')] bg-[length:auto_80%] bg-no-repeat bg-[50%_50%] text-white text-[21.6px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible float-left box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[22.5px_19px] transition-all cursor-pointer outline-none align-middle border-separate"
              ></div>
              <span
                id="liGid"
                className="header_phaseNum inline static mr-[3px] border-0 bg-repeat bg-[0%_0%] text-[#FF0000] text-[21.6px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[0px_0px] transition-all outline-none align-baseline border-separate"
              >
                <span className="inline static border-0 bg-repeat bg-[0%_0%] text-white text-[21.6px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[0px_0px] transition-all outline-none align-baseline border-separate">
                  Kỳ
                </span>{" "}
                {currentDraw.draw_no?.slice(-4)}
                <span className="inline static border-0 bg-repeat bg-[0%_0%] text-[#FF0000] text-[21.6px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[0px_0px] transition-all outline-none align-baseline border-separate"></span>
              </span>
            </div>
            <div
              id="divCountDownBet"
              className="header_time table-cell static w-[125.297px] h-[39px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[62.6484px_19.5px] transition-all outline-none align-middle border-separate"
            >
              <div className="timeBox flex static w-[125.297px] h-[38px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[62.6484px_19px] transition-all outline-none align-baseline border-separate">
                <span
                  id="spnBetMM"
                  className={`timeT flex static w-[46px] h-[38px] border-0 bg-[url('https://cuvnin.gs6168.com/images/graph/common/bg_time.svg')] bg-[length:91%] bg-no-repeat bg-[50%_50%] text-[30.72px] font-bold text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[23px_19px] transition-all outline-none align-baseline border-separate ${
                    gamePhase === GamePhase.BETTING_ENDING
                      ? "text-[#FF0000]"
                      : "text-black"
                  }`}
                >
                  {String(countdown.minutes).padStart(2, "0")}
                </span>
                <span
                  className={`white_t flex static w-[18px] h-[38px] border-0 bg-repeat bg-[0%_0%] text-[30.72px] font-bold text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[9px_19px] transition-all outline-none align-baseline border-separate ${
                    gamePhase === GamePhase.BETTING_ENDING
                      ? "text-[#FF0000]"
                      : "text-white"
                  }`}
                >
                  {" "}
                  :{" "}
                </span>
                <span
                  id="spnBetSS"
                  className={`timeT flex static w-[46px] h-[38px] border-0 bg-[url('https://cuvnin.gs6168.com/images/graph/common/bg_time.svg')] bg-[length:91%] bg-no-repeat bg-[50%_50%] text-[30.72px] font-bold text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible box-content flex-row flex-nowrap justify-center items-center flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[23px_19px] transition-all outline-none align-baseline border-separate ${
                    gamePhase === GamePhase.BETTING_ENDING
                      ? "text-[#FF0000]"
                      : "text-black"
                  }`}
                >
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div
              id="fonBalance"
              className="header_money showArrow flex relative w-[38.0312px] h-[38px] pr-[15px] border-0 bg-repeat bg-[0%_0%] text-[rgb(255,228,0)] text-[21.6px] font-normal text-center leading-[38px] whitespace-nowrap overflow-visible opacity-100 visible float-right box-content flex-row flex-nowrap justify-center items-baseline flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[26.5156px_19px] transition-all outline-none align-middle border-separate"
            >
              $ 1
            </div>
          </div>
          {/* Video Section */}
          <div className="loadVideo_in flex items-center justify-center h-[217px] w-[100%]">
            <div className="flex flex-col items-center justify-center">
              <div className="bg_loadVideo w-[140px] h-[70px] flex items-center justify-center">
                <img
                  className="loadVideo_logo w-[60%] h-[60%] object-contain"
                  src="https://cuvncf.qiabbkj.com/images/graph/common/logoLightLoading.png"
                />
              </div>
              <div
                id="loadVideo_text"
                className="loadVideo_text mt-[5px] text-white text-[14.4px] font-normal text-center"
                style={{
                  textShadow:
                    "rgba(255, 255, 255, 0.3) 0px 0px 1px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 5px, rgb(0, 204, 255) 0px 0px 10px",
                }}
              >
                Đang tải video
              </div>
            </div>
          </div>

          {/* playBarTop section */}
          <div className="longLineScroll playBarTop table relative w-full h-[46px] pr-[8.59375px] border-0 border-t-0 border-r-0 border-b border-l-0 border-b-[rgb(51,51,51)] bg-black bg-repeat bg-[0%_0%] text-black text-base font-normal text-left overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[215px_23px] transition-[0.35s_ease-in-out] align-baseline list-outside">
            <div className="longLine table-cell relative w-[351.406px] h-[45px] border-0 bg-repeat bg-[0%_0%] text-black text-base font-normal text-left leading-[45px] overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[175.703px_22.5px] transition-all align-middle list-outside">
              <div
                id="divTypeSelect"
                className="longLine_sel block absolute top-0 right-[17.5625px] w-[333.844px] h-[45px] border-0 bg-repeat bg-[0%_0%] text-white font-normal text-center leading-[45px] whitespace-nowrap overflow-x-auto overflow-y-hidden opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[166.922px_22.5px] transition-all align-baseline list-outside"
              >
                <div
                  data-kind="Star5"
                  className="btn_playLine vn inline-block static w-[87px] h-[45px] px-[20.0156px] border-t-0 border-r-0 border-b-4 border-l-0 border-b-[rgb(37,141,92)] bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center no-underline leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[43.5px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  5 tinh
                </div>
                <div
                  data-kind="Star4"
                  className="btn_playLine vn inline-block static w-[98.7812px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[49.3906px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Hậu tứ
                </div>
                <div
                  data-kind="StarPre3"
                  className="btn_playLine vn inline-block static w-[114.016px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[57.0078px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Tiền tam
                </div>
                <div
                  data-kind="StarMid3"
                  className="btn_playLine vn inline-block static w-[126.828px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[63.4141px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Trung tam
                </div>
                <div
                  data-kind="StarBack3"
                  className="btn_playLine vn inline-block static w-[112.594px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[56.2969px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Hậu tam
                </div>
                <div
                  data-kind="StarPre2"
                  className="btn_playLine vn inline-block static w-[107.625px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[53.8125px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Tiền nhị
                </div>
                <div
                  data-kind="StarBack2"
                  className="btn_playLine on vn inline-block static w-[106.219px] h-[45px] px-[20.0156px] border-t-0 border-r-0 border-b-4 border-l-0 border-b-[rgb(37,141,92)] bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[53.1094px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Hậu nhị
                </div>
                <div
                  data-kind="Pack"
                  className="btn_playLine vn inline-block static w-[196.734px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[98.3672px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Tổng hợp hàng số
                </div>
                <div
                  data-kind="Star1"
                  className="btn_playLine vn inline-block static w-[124.375px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[62.1875px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  1 hàng số
                </div>
                <div
                  data-kind="NoSeat"
                  className="btn_playLine vn inline-block static w-[162.797px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[81.3984px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Không cố định
                </div>
                <div
                  data-kind="BSOE"
                  className="btn_playLine vn inline-block static w-[105.156px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[52.5781px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Kèo đôi
                </div>
                <div
                  data-kind="Sum5"
                  className="btn_playLine vn inline-block static w-[113.703px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[56.8516px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  T.5 banh
                </div>
                <div
                  data-kind="SumBull"
                  className="btn_playLine vn inline-block static w-[131.812px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[65.9062px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Ngầu Hầm
                </div>
                <div
                  data-kind="Sum3_Pre"
                  className="btn_playLine vn inline-block static w-[128.953px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[64.4766px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  T.Tiền tam
                </div>
                <div
                  data-kind="Sum3_Mid"
                  className="btn_playLine vn inline-block static w-[141.75px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[70.875px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  T.Trung tam
                </div>
                <div
                  data-kind="Sum3_Back"
                  className="btn_playLine vn inline-block static w-[127.531px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[63.7656px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  T.Hậu tam
                </div>
                <div
                  data-kind="Baccarat"
                  className="btn_playLine vn inline-block static w-[115.812px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[57.9062px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Baccarat
                </div>
                <div
                  data-kind="DragonGate"
                  className="btn_playLine vn inline-block static w-[147.828px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[73.9141px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Sút cầu môn
                </div>
                <div
                  data-kind="FunGamePlay"
                  className="btn_playLine vn inline-block static w-[92.3281px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[46.1641px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  Thú vị
                </div>
                <div
                  data-kind="LongBet"
                  className="btn_playLine vn inline-block static w-[97.6875px] h-[45px] px-[20.0156px] border-0 bg-repeat bg-[0%_0%] text-white text-[19.2px] font-normal text-center leading-[45px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[48.8438px_22.5px] transition-all cursor-pointer align-baseline list-outside"
                >
                  T.Long
                </div>
              </div>
            </div>
            <div
              id="divPopUpKindMenu"
              className="btn_playMore table-cell relative w-[70px] h-[45px] border-0 bg-repeat bg-[0%_0%] text-black text-[17.6px] font-normal text-left overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[35px_22.5px] transition-all align-middle list-outside"
            >
              <span className="block static w-[70px] h-[28px] min-w-[70px] px-[10px] border-0 rounded-[20px] bg-[rgb(88,136,114)] bg-repeat bg-[0%_0%] text-white text-[17.6px] font-normal text-center leading-[28px] whitespace-nowrap overflow-visible opacity-100 visible flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[35px_14px] transition-all cursor-pointer align-baseline list-outside">
                Thêm
              </span>
            </div>
          </div>

          {/* BetContent section */}
          <div
            id="BetContent"
            className="block static w-full h-[352.781px] border-0 bg-repeat bg-[0%_0%] text-black text-base font-arial font-normal text-left no-underline overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[215px_176.391px] transition-all outline-none align-baseline border-separate list-outside"
          >
            <div
              id="divDetailMenu"
              className="btn_playList block relative w-[412.797px] h-9 mr-[8.60938px] mb-[3px] ml-[8.59375px] border border-solid border-white/30 rounded-[5px] bg-repeat bg-[0%_0%] text-white text-[19.36px] font-arial font-normal text-center no-underline leading-9 overflow-visible opacity-100 visible box-border flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[206.398px_18px] transition-all cursor-pointer outline-none align-baseline border-separate list-outside z-10"
            >
              Hàng số 5 tinh - Nhập số
            </div>
            <textarea
              id="txbArea"
              className="inline-block static w-[378.391px] h-[168px] mr-[8.59375px] mb-0 ml-[8.59375px] pt-[8.59375px] pr-[17.1875px] pb-[8.59375px] pl-[17.1875px] border-0 bg-[rgb(236,255,246)] bg-repeat bg-[0%_0%] text-[rgb(89,89,89)] text-[21.84px] font-mono font-normal text-left no-underline whitespace-pre-wrap opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink order-0 origin-[206.383px_92.5938px] transition-all cursor-text outline-none align-baseline border-separate"
              placeholder="Nhập số đặt cược"
              onBlur={(e) => {
                /* Watermark logic */
              }}
              onFocus={(e) => {
                /* Watermark logic */
              }}
            ></textarea>

            {/* flopAreaBox */}
            <div className="flopAreaBox block static w-full py-[1px] px-0 border-0 bg-white/10 bg-repeat bg-[0%_0%] text-black text-base font-arial font-normal text-left no-underline overflow-visible opacity-100 visible box-content flex-row flex-nowrap flex-[0_1_auto] flex-grow-0 flex-shrink-1 order-0 origin-[215px_24.5px] transition-all outline-none align-baseline border-separate list-outside">
              <div className="flopArea flex items-center justify-between  mx-[8.59375px]">
                <div className="flop_Input flex-1">
                  <input
                    id="txbInputBB"
                    type="tel"
                    value={flopInputValue}
                    onFocus={handleFlopInputFocus}
                    onBlur={handleFlopInputBlur}
                    onChange={handleFlopInputChange}
                    maxLength={2}
                    className="bg-[#ecfff6] border-0 rounded-none w-full h-[30px] leading-[30px] text-[#595959] text-base px-[2%] py-0 float-left min-[400px]:h-[35px] min-[400px]:text-[1.15em]"
                  />
                  <a
                    id="aClearNumBB"
                    className="btn_clear"
                    style={{ display: showClearButton ? "block" : "none" }}
                    onClick={handleClearFlopInput}
                  ></a>
                </div>
                <input
                  type="button"
                  className="btn_enterNum bg-white/30 rounded-none float-left w-[27%] ml-[1%] h-[30px] leading-[30px] text-white text-center text-base cursor-pointer border-0 p-0 min-[350px]:w-[24%] min-[400px]:w-[25%] min-[400px]:h-[35px] min-[400px]:text-[1.15em]"
                  value="Lật bài"
                  onClick={handleStraightFlop}
                />
              </div>
              <div className="AT_textT text-[12.48px] text-[#ffcc00] w-full my-3 px-[8.59375px]">
                ※Mỗi tổ hợp hãy dùng khoảng trắng, dấu phẩy, chấm phẩy để cách
                ra
              </div>
              <div className="AT_textT text-[12.48px] text-[#ffcc00] w-full mb-3 px-[8.59375px]">
                Ví dụ đặt cược：
                <span id="spnBetExample">00,01,02,03,04,05,06</span>
              </div>
            </div>
          </div>

          {/* Result section select */}
          <div
            id="divSelect"
            className="HotCold rdList_Top02 w-full h-[40.75px] m-0 py-[5.875px] px-0 text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal bg-[rgb(235,235,235)] grid grid-cols-2"
          >
            <div
              id="divType"
              className="h-[28px] m-0 ml-[7.82812px] p-0 border-solid text-black text-[15.2px] font-[Arial,微軟正黑體] font-normal leading-[28px] rounded-[5px] border border-[#d2d2d2] bg-white flex items-center justify-center"
            >
              Chưa mở
            </div>
            <div
              data-id="selNoCount"
              data-val={selectedPeriod.value}
              id="selNoCount2"
              className="betCar h-[28px] m-0 ml-[7.82812px] p-0 border border-solid border-[#d2d2d2] bg-white text-black text-[15.2px] font-[Arial,微軟正黑體] font-normal leading-[28px] rounded-[5px] flex items-center justify-between px-2 cursor-pointer relative"
              onClick={handleSelectClick}
            >
              <span>{selectedPeriod.label}</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Select Popup */}
          {showSelectPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="popUp_frame Pop_Select fixed z-[100] top-1/2 -translate-y-1/2 left-0 right-0 mx-auto w-[70%] bg-[#f5f5f5] cursor-default rounded-lg">
                <span className="Pop_title block relative py-[5%] px-0 text-black text-center border-b border-solid border-[#ddd] font-bold text-[1.1em]">
                  Thống kê
                  <span
                    className="btn_close absolute top-0 bottom-0 right-[6%] my-auto w-5 h-5 bg-[url('https://cuvncf.qiabbkj.com/images/graph/common/btn_close_ku.svg')] bg-no-repeat bg-center bg-[length:70%] opacity-30 cursor-pointer"
                    onClick={handleCloseSelectPopup}
                  ></span>
                </span>
                <ul className="p-0 m-0">
                  <li
                    data-val="2"
                    className={`w-[70%] text-black leading-[2em] text-center my-[5%] mx-auto rounded-[50px] cursor-pointer ${
                      selectedPeriod.value === "2"
                        ? "bg-[#dcfef0] border border-solid border-[#9cc9b8] box-border"
                        : "border-0"
                    }`}
                    onClick={() => handleSelectOption("2", "50 Kỳ")}
                  >
                    &nbsp;50 Kỳ
                  </li>
                  <li
                    data-val="1"
                    className={`w-[70%] text-black leading-[2em] text-center my-[5%] mx-auto rounded-[50px] cursor-pointer ${
                      selectedPeriod.value === "1"
                        ? "bg-[#dcfef0] border border-solid border-[#9cc9b8] box-border"
                        : "border-0"
                    }`}
                    onClick={() => handleSelectOption("1", "100 Kỳ")}
                  >
                    100 Kỳ
                  </li>
                  <li
                    data-val="0"
                    className={`w-[70%] text-black leading-[2em] text-center my-[5%] mx-auto rounded-[50px] cursor-pointer ${
                      selectedPeriod.value === "0"
                        ? "bg-[#dcfef0] border border-solid border-[#9cc9b8] box-border"
                        : "border-0"
                    }`}
                    onClick={() => handleSelectOption("0", "200 Kỳ")}
                  >
                    200 Kỳ
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* divHotColdMiss section */}
          <div
            id="divHotColdMiss"
            className="rdList_Bot w-full h-[132.281px] m-0 p-0 border-0 bg-[rgb(240,240,240)] text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal"
          >
            <div className="betCar_wrap anytime grid grid-cols-5 w-[352.797px] h-[58.3125px] my-[5.875px] mx-[19.6094px] mb-[3.90625px] ml-[19.5938px] p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(229,80,80)] bg-transparent text-[rgb(229,80,80)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  03
                </span>
                <span className="w-[29.375px] h-[21px] mt-[0.3125px] mb-0 mx-[1.3125px] p-0 border-0 bg-transparent text-[rgb(255,0,0)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  200
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(229,80,80)] bg-transparent text-[rgb(229,80,80)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  06
                </span>
                <span className="w-[29.375px] h-[21px] mt-[0.3125px] mb-0 mx-[1.3125px] p-0 border-0 bg-transparent text-[rgb(255,0,0)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  200
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(229,80,80)] bg-transparent text-[rgb(229,80,80)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  14
                </span>
                <span className="w-[29.375px] h-[21px] mt-[0.3125px] mb-0 mx-[1.3125px] p-0 border-0 bg-transparent text-[rgb(255,0,0)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  200
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(229,80,80)] bg-transparent text-[rgb(229,80,80)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  19
                </span>
                <span className="w-[29.375px] h-[21px] mt-[0.3125px] mb-0 mx-[1.3125px] p-0 border-0 bg-transparent text-[rgb(255,0,0)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  200
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(229,80,80)] bg-transparent text-[rgb(229,80,80)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  32
                </span>
                <span className="w-[29.375px] h-[21px] mt-[0.3125px] mb-0 mx-[1.3125px] p-0 border-0 bg-transparent text-[rgb(255,0,0)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  200
                </span>
              </div>
            </div>
            <div className="betCar_wrap anytime grid grid-cols-5 w-[352.797px] h-[58.3125px] my-[5.875px] mx-[19.6094px] mb-[3.90625px] ml-[19.5938px] p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(79,154,255)] bg-transparent text-[rgb(79,154,255)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  72
                </span>
                <span className="blue_t w-[9.79688px] h-[21px] mt-[0.3125px] mb-0 mx-[11.1094px] ml-[11.0938px] p-0 border-0 bg-transparent text-[rgb(0,126,255)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  0
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(79,154,255)] bg-transparent text-[rgb(79,154,255)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  79
                </span>
                <span className="blue_t w-[9.79688px] h-[21px] mt-[0.3125px] mb-0 mx-[11.1094px] ml-[11.0938px] p-0 border-0 bg-transparent text-[rgb(0,126,255)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  1
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(79,154,255)] bg-transparent text-[rgb(79,154,255)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  12
                </span>
                <span className="blue_t w-[9.79688px] h-[21px] mt-[0.3125px] mb-0 mx-[11.1094px] ml-[11.0938px] p-0 border-0 bg-transparent text-[rgb(0,126,255)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  2
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(79,154,255)] bg-transparent text-[rgb(79,154,255)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  24
                </span>
                <span className="blue_t w-[9.79688px] h-[21px] mt-[0.3125px] mb-0 mx-[11.1094px] ml-[11.0938px] p-0 border-0 bg-transparent text-[rgb(0,126,255)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  3
                </span>
              </div>
              <div className="betCar_list w-8 h-[58.3125px] mx-[19.2656px] my-0 p-0 border-0 bg-transparent text-black text-base font-[Arial,微軟正黑體] font-normal leading-normal">
                <span className="rounded-full w-8 h-8 mt-[0.3125px] mb-[5px] mx-0 p-0 border-4 border-solid border-[rgb(79,154,255)] bg-transparent text-[rgb(79,154,255)] text-[17.6px] font-[Arial,微軟正黑體] font-bold leading-[26px] flex items-center justify-center">
                  78
                </span>
                <span className="blue_t w-[9.79688px] h-[21px] mt-[0.3125px] mb-0 mx-[11.1094px] ml-[11.0938px] p-0 border-0 bg-transparent text-[rgb(0,126,255)] text-[17.6px] font-[Arial,微軟正黑體] font-normal leading-normal">
                  4
                </span>
              </div>
            </div>
          </div>

          {/* ChatroomBar */}
          <ChatroomBar />
        </FlexReverse>
      </Dialog>
    </>
  );
}

export default PopupAnyTimeKUMobile;
