import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import type { LiveKuGameState } from "@/hooks/useLiveKu";
import useBalanceStore from "@/stores/balanceStore";
import useModalStore from "@/stores/modalStore";
import { Box } from "@mui/material";

interface CurrentDrawHeaderProps {
  gType: number;
  onVideoToggle: () => void;
  onBalanceClick: () => void;
  gameState: LiveKuGameState;
}

const DrawHeader = ({
  gType,
  onVideoToggle,
  onBalanceClick,
  gameState,
}: CurrentDrawHeaderProps) => {
  const balanceUser = useBalanceStore((s) => s.balance);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const getSafeCountdown = () => {
    return Math.max(0, gameState.countdownSeconds || 0);
  };

  const formatDrawNo = (drawNo: string | undefined) => {
    if (!drawNo) return "";

    if (/^\d+$/.test(drawNo)) {
      return drawNo;
    }

    return drawNo.length > 4 ? drawNo.slice(-4) : drawNo;
  };

  return (
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <span className="block w-[18px] h-[18px] bg-[url('https://cuvnin.gs6168.com/images/graph/common/btn_camera_on.svg')]"></span>
        Kỳ
        <span className="text-[#ff7d7d] ml-[5px]">
          {formatDrawNo(gameState.currentDraw?.draw_no)}
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
            display: "flex",
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
              color: getSafeCountdown() <= 10 ? "#FF0000" : "#000",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {gameState.gamePhase === "finished"
              ? "00"
              : String(Math.floor(getSafeCountdown() / 60)).padStart(
                  2,
                  "0"
                )}
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
              color: getSafeCountdown() <= 10 ? "#FF0000" : "#000",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {gameState.gamePhase === "finished"
              ? "00"
              : String(getSafeCountdown() % 60).padStart(2, "0")}
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
  );
};

export default DrawHeader;
