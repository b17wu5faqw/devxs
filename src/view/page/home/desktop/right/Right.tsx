import { Box } from "@mui/material";
import FlexReverse from "@/components/utils/FlexReverse";
import Flex from "@/components/utils/Flex";
import { baseColors } from "@/utils/colors";
import CustomText from "@/components/text/CustomText";
import { useHistory } from "@/hooks/useLotto";

export interface HistoryType {
  id?: number;
  title?: string;
  draw_no?: string;
  type?: string;
  bet_point: number;
  bill_numbers?: string;
  money?: number;
  code?: string;
  rate?: number;
  created_time?: string;
}

function Right() {
  const { lottoHistory, isRefreshing } = useHistory(1, 20);

  return (
    <Box>
      <FlexReverse sx={{ width: "422px", padding: "5px 5px 0 5px" }}>
        <Flex
          sx={{
            background: baseColors.bgBlue,
            height: "35px",
            lineHeight: "35px",
            textAlign: "center",
            color: baseColors.white,
            fontSize: "14px",
            padding: "0 12px",
            gap: "12px",
            justifyContent: "start",
          }}
        >
          <CustomText
            sx={{ color: "#ffe306", borderBottom: "3px solid #ffe306" }}
          >
            Đơn cược mới
          </CustomText>
          <CustomText sx={{ color: baseColors.white }}>Trường Long</CustomText>
        </Flex>
        <Box sx={{ height: "573px", overflowY: "scroll" }}>
          <Flex sx={{ flexDirection: "column", gap: "5px", marginTop: "10px" }}>
            {isRefreshing && (
              <CustomText sx={{ color: "#ffe306", marginLeft: "auto" }}>
                Đang tải...
              </CustomText>
            )}
            {lottoHistory?.data &&
              Array.isArray(lottoHistory.data) &&
              lottoHistory.data.map((item: HistoryType) => (
                <Box
                  key={item.id}
                  sx={{
                    width: "100%",
                    border: "1px solid #cccccc",
                    background: "#f5f5f5",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  <Flex sx={{ justifyContent: "flex-start", gap: "15px" }}>
                    <CustomText
                      sx={{ fontWeight: "600", color: baseColors.black }}
                    >
                      {item.title}
                    </CustomText>
                    <CustomText
                      sx={{ fontWeight: "600", color: baseColors.black }}
                    >
                      Số kỳ {item.draw_no}
                    </CustomText>
                  </Flex>
                  <CustomText
                    sx={{ fontWeight: "600", color: baseColors.black }}
                  >
                    {item.type}
                  </CustomText>
                  <CustomText
                    sx={{
                      fontWeight: "600",
                      color: "#f00",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.code}
                  </CustomText>
                  <Flex>
                    <CustomText
                      sx={{ fontWeight: "600", color: baseColors.black }}
                    >
                      {item.bet_point}
                    </CustomText>
                    <CustomText
                      sx={{ fontWeight: "600", color: baseColors.black }}
                    >
                      Gồm ${item.money}
                    </CustomText>
                  </Flex>
                </Box>
              ))}
          </Flex>
        </Box>
      </FlexReverse>
    </Box>
  );
}

export default Right;
