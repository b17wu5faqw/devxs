import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import NewButton from "../button/NewButton";
import CustomText from "../text/CustomText";
import { memo, useMemo } from "react";
import ButtonConfirm from "../button/ButtonConfirm";
import ButtonCancel from "../button/ButtonCancel";
import Flex from "../utils/Flex";

interface PopupConfirmProps {
  drawName: string;
  drawNo: string;
  title: string;
  regionId: number;
  sets: { numbers: string; betAmount: string }[];
  totalAmount: number;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

const PopupLoXienConfirm: React.FC<PopupConfirmProps> = ({
  drawName,
  drawNo,
  title,
  regionId,
  sets,
  totalAmount,
  onConfirm,
  isSubmitting,
}) => {
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.LO_XIEN_CONFIRM)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  const groupedSets = useMemo(() => {
    const grouped = {
      "2": [] as { numbers: string; betAmount: string }[],
      "3": [] as { numbers: string; betAmount: string }[],
      "4": [] as { numbers: string; betAmount: string }[],
    };

    sets.forEach((set) => {
      const count = set.numbers.split(",").length;
      if (count >= 2 && count <= 4) {
        grouped[count as 2 | 3 | 4].push(set);
      }
    });

    return grouped;
  }, [sets]);

  const subtotals = useMemo(() => {
    return {
      "2": groupedSets["2"].reduce(
        (sum, set) => sum + (parseInt(set.betAmount) || 0),
        0
      ),
      "3": groupedSets["3"].reduce(
        (sum, set) => sum + (parseInt(set.betAmount) || 0),
        0
      ),
      "4": groupedSets["4"].reduce(
        (sum, set) => sum + (parseInt(set.betAmount) || 0),
        0
      ),
    };
  }, [groupedSets]);

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "410px" },
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
        }}
      >
        <CustomText
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#3088e2",
          }}
        >
          {drawName} : Số kỳ <span className="text-[#ffc800]">{drawNo}</span>
        </CustomText>
        <Box>
          <Flex
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            {groupedSets["2"].length > 0 && (
              <Box sx={{ width: "100%" }}>
                <CustomText
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "left",
                    padding: "10px 20px 0",
                    color: "#666",
                    backgroundColor: "#f5f9ff",
                  }}
                >
                  2D - Lô Xiên 2
                </CustomText>
                <Flex
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    paddingBottom: "10px",
                  }}
                >
                  {groupedSets["2"].map((set, index) => (
                    <Flex
                      key={index}
                      sx={{
                        fontSize: "0.96em",
                        fontWeight: "600",
                        textAlign: "left",
                        padding: "0 20px",
                        color: "#0078ff",
                        width: "auto",
                        margin: "5px 0",
                      }}
                    >
                      {set.numbers} <span className="text-[#999]">@</span>
                      <span className="text-[#f00]">
                        {regionId === 1 ? "17" : "34"}
                      </span>
                      <span className="text-[#000]">${set.betAmount}</span>
                    </Flex>
                  ))}
                </Flex>
                <hr />
              </Box>
            )}

            {/* Xiên 3 Section */}
            {groupedSets["3"].length > 0 && (
              <Box sx={{ width: "100%" }}>
                <CustomText
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "left",
                    padding: "10px 20px 0",
                    color: "#666",
                    backgroundColor: "#f5f9ff",
                  }}
                >
                  2D - Lô Xiên 3
                </CustomText>
                <Flex
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    paddingBottom: "10px",
                  }}
                >
                  {groupedSets["3"].map((set, index) => (
                    <Flex
                      key={index}
                      sx={{
                        fontSize: "0.96em",
                        fontWeight: "600",
                        textAlign: "left",
                        padding: "0 20px",
                        color: "#0078ff",
                        width: "auto",
                        margin: "5px 0",
                      }}
                    >
                      {set.numbers} <span className="text-[#999]">@</span>
                      <span className="text-[#f00]">{regionId === 1 ? "74" : "188"}</span>
                      <span className="text-[#000]">${set.betAmount}</span>
                    </Flex>
                  ))}
                </Flex>
                <hr />
              </Box>
            )}

            {/* Xiên 4 Section */}
            {groupedSets["4"].length > 0 && (
              <Box sx={{ width: "100%" }}>
                <CustomText
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "left",
                    padding: "10px 20px 0",
                    color: "#666",
                    backgroundColor: "#f5f9ff",
                  }}
                >
                  2D - Lô Xiên 4
                </CustomText>
                <Flex
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    paddingBottom: "10px",
                  }}
                >
                  {groupedSets["4"].map((set, index) => (
                    <Flex
                      key={index}
                      sx={{
                        fontSize: "0.96em",
                        fontWeight: "600",
                        textAlign: "left",
                        padding: "0 20px",
                        color: "#0078ff",
                        width: "auto",
                        margin: "5px 0",
                      }}
                    >
                      {set.numbers} <span className="text-[#999]">@</span>
                      <span className="text-[#f00]">{regionId === 1 ? "251" : "970"}</span>
                      <span className="text-[#000]">${set.betAmount}</span>
                    </Flex>
                  ))}
                </Flex>
                <hr />
              </Box>
            )}
          </Flex>
          <hr />
          <CustomText
            sx={{
              fontSize: "15px",
              fontWeight: "600",
              textAlign: "left",
              padding: "6px 10px 0",
              color: "#666",
            }}
          >
            Gồm <span className="text-[#3287e4]">{sets.length}</span> đơn
          </CustomText>
          <CustomText
            sx={{
              fontSize: "15px",
              fontWeight: "600",
              textAlign: "left",
              padding: "4px 10px",
              color: "#666",
            }}
          >
            T.tiền cược:{" "}
            <span className="text-[20px] text-[#000]">{totalAmount}</span>
          </CustomText>
        </Box>
        <Flex sx={{ gap: "20px", justifyContent: "center", padding: "10px" }}>
          <ButtonCancel
            sx={{ flex: 1, fontWeight: "bold" }}
            onClick={() => closeModal()}
          >
            Hủy
          </ButtonCancel>
          <ButtonConfirm
            onClick={handleConfirm}
            disabled={isSubmitting}
            sx={{ flex: 1, fontWeight: "bold" }}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </ButtonConfirm>
        </Flex>
      </FlexReverse>
    </Dialog>
  );
};

export default memo(PopupLoXienConfirm);
