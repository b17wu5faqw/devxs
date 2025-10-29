import React from "react";
import { Box, Dialog, Grow } from "@mui/material";
import useModalStore from "@/stores/modalStore";
import { MODAL } from "@/constant/modal";
import { SicboLastDraw } from "@/hooks/useSicbo";
import CustomText from "../text/CustomText";
import Flex from "../utils/Flex";
import FlexReverse from "../utils/FlexReverse";
import { renderDrawResult } from "@/view/page/home/desktop/main/XocDia/DiceRenderer";

interface PopupXocDiaResultsMobileProps {
  recentDraws: SicboLastDraw[];
}



// Helper function to determine game result
const getGameResult = (result: string | number[]) => {
  if (!result) return { taiXiu: '', leChan: '' };

  let diceArray: string[] = [];

  if (typeof result === 'string') {
    if (result.includes(',')) {
      diceArray = result.split(',');
    } else {
      diceArray = [result];
    }
  } else if (Array.isArray(result)) {
    diceArray = result.map(String);
  }

  const redCount = diceArray.filter(dice => dice === 'R' || dice === 'r').length;
  const whiteCount = diceArray.filter(dice => dice === 'W' || dice === 'w').length;

  // Determine Tài/Xỉu based on red count
  const taiXiu = redCount >= 2 ? 'Tài' : 'Xỉu';

  // Determine Lẻ/Chẵn based on red count
  const leChan = redCount % 2 === 0 ? 'Chẵn' : 'Lẻ';

  return { taiXiu, leChan };
};

// Helper function to format timestamp
const formatTimestamp = (endTime: string) => {
  try {
    const date = new Date(endTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return endTime;
  }
};

const PopupXocDiaResultsMobile: React.FC<PopupXocDiaResultsMobileProps> = ({
  recentDraws,
}) => {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.XOCDIA_RESULTS_MOBILE)
  );
  const closeModal = useModalStore((state) => state.closeModal);

  const handleClose = () => {
    closeModal();
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "310px" },
          height: "90vh",
          maxHeight: "90vh",
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
        {/* Header - sử dụng chính xác style của PopupConfirmMobile */}
        <CustomText
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#206B61",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          Kết quả
        </CustomText>

        {/* Close button - sử dụng chính xác style của PopupConfirmMobile */}
        <Flex
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: "10px",
            top: "5px",
            background: "url(/images/main/icon_close.png) no-repeat center",
            backgroundSize: "auto 55%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            opacity: "0.8",
            zIndex: 2,
          }}
        />

        {/* Content - sử dụng Box như PopupConfirmMobile với scroll */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "calc(90vh - 50px)", // Trừ đi chiều cao header
          }}
        >
          {recentDraws.map((draw, index) => {
            const gameResult = getGameResult(draw.result);
            return (
              <Box key={draw.id || index}>
                {/* Draw header với style giống PopupConfirmMobile */}
                <Box
                  sx={{
                    paddingLeft: "6.5%",
                    paddingTop: "2%",
                    paddingBottom: "2%",
                    paddingRight: "6.5%",
                    width: "100%",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <CustomText
                      sx={{
                        fontSize: "0.9em",
                        fontWeight: "600",
                        textAlign: "left",
                        color: "#0078ff",
                      }}
                    >
                      Số kỳ {draw.draw_no}
                    </CustomText>
                    <CustomText
                      sx={{
                        fontSize: "0.8em",
                        fontWeight: "400",
                        textAlign: "right",
                        color: "#666",
                      }}
                    >
                      {formatTimestamp(draw.end_time)}
                    </CustomText>
                  </Flex>
                </Box>

                <hr />

                {/* Dice result */}
                <Box
                  sx={{
                    paddingLeft: "6.5%",
                    paddingTop: "4%",
                    paddingBottom: "4%",
                    paddingRight: "6.5%",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Flex sx={{ gap: "8px", justifyContent: "center", alignItems: "center" }}>
                    {renderDrawResult(draw.result, 40)}
                  </Flex>
                </Box>

                <hr />

                {/* Game results với style giống PopupConfirmMobile */}
                <Flex
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1% 6.5%",
                  }}
                >
                  <CustomText
                    sx={{
                      fontSize: "12px",
                      fontWeight: "600",
                      textAlign: "left",
                    }}
                  >
                    TàiXỉu: <span style={{ color: '#00c851' }}>{gameResult.taiXiu}</span>                  </CustomText>
                  <CustomText
                    sx={{
                      fontSize: "12px",
                      fontWeight: "600",
                      textAlign: "right",
                    }}
                  >
                    LẻChẵn: <span style={{ color: '#0099cc' }}>{gameResult.leChan}</span>
                  </CustomText>
                </Flex>

                {index < recentDraws.length - 1 && <hr style={{ margin: "10px 0", borderColor: "#ddd" }} />}
              </Box>
            );
          })}

          {recentDraws.length === 0 && (
            <Box
              sx={{
                padding: "20px",
                textAlign: "center",
              }}
            >
              <CustomText
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                Không có dữ liệu kết quả
              </CustomText>
            </Box>
          )}
        </Box>
      </FlexReverse>
    </Dialog>
  );
};

export default PopupXocDiaResultsMobile;
