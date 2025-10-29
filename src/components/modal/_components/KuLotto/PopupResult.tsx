import { getResult } from "@/apis/ku-lotto";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import { memo, useEffect, useState } from "react";

interface Result {
  id: number;
  draw_no: number;
  draw_time?: string;
  result: number[];
}

function PopupResult({ gType }: { gType?: number }) {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.KU_LOTTO_RESULT)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
  };

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchResults();
    }
  }, [isOpen]);

  const fetchResults = async () => {
    try {
      const response = await getResult({ gType: gType ?? 162 });
      if (response.status === 1) {
        setResults(response.data);
      }
    } catch (err) {
      console.error("Error fetching results", err);
    }
  };

  const getNumberImage = (code: string): string => {
    const digit = parseInt(code) % 10;
    return `/images/live/img_ATP${digit}.svg`;
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "310px" },
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
        Kết quả
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
      <Box sx={{ background: "#fff", padding: "8px", overflowX: "auto" }}>
        {results.map((item) => (
          <Box
            key={item.draw_no}
            sx={{
              borderBottom: "1px solid #ccc",
              borderRadius: "5px",
              border: "1px solid #cdcdcd",
              margin: "0 auto 2%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "#000",
                background: "#e5e5e5",
                fontSize: "0.9em",
                lineHeight: "2.3em",
              }}
            >
              <span className="pl-[3%]">Số kỳ {item.draw_no}</span>
              <span
                style={{ fontSize: "0.9em", color: "#666", paddingRight: "3%" }}
              >
                {item.draw_time}
              </span>
            </Box>

            <Flex sx={{ gap: "8px", justifyContent: "center", padding: "2.5% 0 2%", }}>
              {(item.result || []).map((num: number, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    width: "35px",
                    height: "35px",
                    lineHeight: "35px",
                    borderRadius: "50%",
                    background: "#961114",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {num}
                </Box>
              ))}
            </Flex>
          </Box>
        ))}
      </Box>
    </Dialog>
  );
}

export default memo(PopupResult);
