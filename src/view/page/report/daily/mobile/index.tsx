import { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  Divider,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { getDailyReport } from "@/apis/lotto";
import Flex from "@/components/utils/Flex";
import { useRouter, useSearchParams } from "next/navigation";
import CustomText from "@/components/text/CustomText";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

// Define types for daily report data
interface BetDetail {
  id: number;
  draw_tile: string;
  draw_no: string;
  create_time: string;
  win_time: string;
  bill_number: string;
  lotto_type: string;
  code: string;
  bet_amount: string | number;
  win_amount: number;
  pay_amount: number;
  refund_amount: number;
  result_amount: string | number;
  bet_point: number;
  rate: number;
  win_rate: string | number;
  balance: number;
  win_balance: string | number;
}

interface LotteryProvider {
  title: string;
  draw_no: string;
  total_bet: number;
  total_refund: number;
  total_result: number;
  total_win_rate: number;
  total_win_balance: number;
  details: BetDetail[];
}

const DailyReportMobile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "";
  const schedule = searchParams.get("schedule") || "";

  const [reportData, setReportData] = useState<LotteryProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  // Toggle details expansion
  const toggleDetails = (id: number) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  // Format currency values
  const formatCurrency = (value: number | string) => {
    if (value === undefined || value === null) return "0";

    const numValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

    if (isNaN(numValue)) return "0";

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Function to determine text color based on value
  const getValueColor = (value: number | string) => {
    if (value === undefined || value === null) return "#333";

    let numValue;
    if (typeof value === "string") {
      // Remove commas and convert to number
      numValue = parseFloat(value.replace(/,/g, ""));
    } else {
      numValue = value;
    }

    if (isNaN(numValue)) return "#333";
    return numValue >= 0 ? "#40b401" : "#ff0101";
  };

  // Calculate the grand totals
  const calculateGrandTotals = () => {
    let totalBet = 0;
    let totalResult = 0;

    reportData.forEach((provider) => {
      totalBet += provider.total_bet || 0;
      totalResult += provider.total_win_balance || 0;
    });

    return {
      totalBet,
      totalResult,
    };
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const daysOfWeek = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  // Fetch daily report data
  useEffect(() => {
    const fetchDailyReportData = async () => {
      if (!date) {
        setError("Không tìm thấy ngày để hiển thị báo cáo");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Call the API to get daily report data
        const response = await getDailyReport({
          jwt_key: accessToken || "",
          paymentDate: date,
          schedule: schedule || "",
        });

        if (response && response.status === 1 && Array.isArray(response.data)) {
          setReportData(response.data);
        } else {
          // Handle API error
          const errorMsg =
            response?.message || "Không thể tải dữ liệu báo cáo ngày";
          throw new Error(errorMsg);
        }
      } catch (err) {
        console.error("Error fetching daily report data:", err);
        setError("Không thể tải dữ liệu báo cáo ngày. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyReportData();
  }, [accessToken, date]);

  // Calculate grand totals
  const grandTotals = calculateGrandTotals();

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#111", overflowY: "scroll" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: "99",
          backgroundSize: "100% auto",
        }}
      >
        <Flex
          sx={{
            height: "45px",
            backgroundColor: "#1f4733",
            textAlign: "center",
            position: "relative",
            borderBottom: "1px solid #35423e",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "0",
              top: "0",
              bottom: "0",
              height: "100%",
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                background: "url(/images/main/btn_back.svg) no-repeat center",
                backgroundSize: "auto 45%",
                width: "38px",
                height: "100%",
                cursor: "pointer",
                float: "left",
                opacity: "0.5",
              }}
              onClick={() => router.back()}
            />
          </Box>
          <Box
            sx={{
              display: "block",
              color: "#fff",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              position: "absolute",
              left: "6%",
              right: 0,
              top: "13px",
              bottom: 0,
              margin: "0 auto",
            }}
          >
            <CustomText
              sx={{
                fontSize: "0.9rem",
                display: "inline-block",
                width: "21.5%",
                margin: "0 0.6%",
                height: "96%",
                textAlign: "center",
                cursor: "pointer",
                color: "#fff",
              }}
              onClick={() => router.push("/realtime")}
            >
              Vừa cược
            </CustomText>
            <CustomText
              sx={{
                fontSize: "0.9rem",
                display: "inline-block",
                width: "21.5%",
                margin: "0 0.6%",
                height: "96%",
                textAlign: "center",
                cursor: "pointer",
                color: "#fff",
              }}
              onClick={() => router.push("/report/game")}
            >
              Hạng mục
            </CustomText>
            <CustomText
              sx={{
                fontSize: "0.9rem",
                display: "inline-block",
                width: "21.5%",
                margin: "0 0.6%",
                height: "96%",
                textAlign: "center",
                cursor: "pointer",
                color: "#fff",
                borderBottom: "3px solid #feb64e",
              }}
              onClick={() => router.push("/report")}
            >
              Sao kê
            </CustomText>
            <CustomText
              sx={{
                fontSize: "0.9rem",
                display: "inline-block",
                width: "21.5%",
                margin: "0 0.6%",
                height: "96%",
                textAlign: "center",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Tặng quà
            </CustomText>
          </Box>
        </Flex>

        <Flex
          sx={{ justifyContent: "flex-start", padding: "15px" }}
          onClick={() => router.back()}
        >
          <KeyboardArrowLeftIcon />
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#fff", marginBottom: "0" }}
          >
            Trở về
          </Typography>
        </Flex>
      </Box>

      <Box sx={{ padding: "90px 0px" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress sx={{ color: "#feb64e" }} />
          </Box>
        ) : error ? (
          <Typography
            variant="body1"
            color="error"
            sx={{ textAlign: "center", my: 3, color: "#f44336" }}
          >
            {error}
          </Typography>
        ) : reportData.length > 0 ? (
          <>
            {/* Loop through providers */}
            {reportData.map((provider) => (
              <>
                {/* Loop through provider details */}
                {provider.details.map((bet) => (
                  <Box key={bet.id}>
                    <Box
                      sx={{
                        width: "90%",
                        margin: "10px auto",
                        display: "table",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#383838",
                          position: "relative",
                          display: "table",
                          width: "100%",
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                        }}
                      >
                        <Box sx={{ padding: "10px 0 10px 10px" }}>
                          <CustomText
                            sx={{ fontSize: "0.95em", color: "#fff" }}
                          >
                            {provider.title} <span>Kỳ {bet.draw_no}</span>
                          </CustomText>
                        </Box>
                        <Box
                          sx={{
                            width: "12%",
                            position: "absolute",
                            top: 0,
                            right: 0,
                            marginTop: "15px",
                            "&:after": {
                              content: "''",
                              display: "block",
                              width: "18px",
                              height: "10px",
                              transform:
                                expandedItemId === bet.id
                                  ? "rotate(0deg)"
                                  : "rotate(180deg)",
                              margin: "auto",
                              background:
                                'url("/images/main/icon_arrow_bet.png") no-repeat center',
                              backgroundSize: "100%",
                            },
                          }}
                          onClick={() => toggleDetails(bet.id)}
                        />
                      </Box>
                      <Collapse
                        sx={{ padding: "0 5px", backgroundColor: "#383838" }}
                        in={expandedItemId === bet.id}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#515151",
                            padding: "15px 10px",
                            color: "#fff",
                            fontSize: "0.85em",
                            borderRadius: "5px",
                            marginBottom: "10px",
                          }}
                        >
                          <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                            Đặt cược:{" "}
                            <span className="text-white">
                              {bet.create_time || "N/A"}
                            </span>
                          </CustomText>

                          <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                            Phát thưởng:{" "}
                            <span className="text-[#ff7373]">
                              {bet.win_time || "N/A"}
                            </span>
                          </CustomText>

                          <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                            Mã số:{" "}
                            <span className="text-white">
                              {bet.bill_number || "N/A"}
                            </span>
                          </CustomText>

                          <Divider sx={{ borderColor: "#707070", my: 1 }} />

                          <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                            Tiền thắng:{" "}
                            <span className="text-white">
                              {formatCurrency(bet.win_rate || 0)}
                            </span>
                          </CustomText>

                          <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                            Số dư:{" "}
                            <span className="text-[#40b401]">
                              {formatCurrency(bet.balance || 0)}
                            </span>
                          </CustomText>

                          <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                            Tiền nhận:{" "}
                            <span className="text-[#0078ff]">
                              {formatCurrency(bet.result_amount || 0)}
                            </span>
                          </CustomText>
                        </Box>
                      </Collapse>
                      <Box
                        sx={{
                          backgroundColor: "#383838",
                          position: "relative",
                          display: "table",
                          width: "100%",
                          borderBottomLeftRadius: "5px",
                          borderBottomRightRadius: "5px",
                          paddingBottom: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "0.85em",
                            position: "relative",
                            color: "#ccc",
                            marginBottom: "10px",
                            padding: "0 10px",
                          }}
                        >
                          <Box
                            sx={{
                              marginBottom: "12px",
                              width: "100%",
                              height: "1px",
                              backgroundColor: "#707070",
                            }}
                          />
                          <Box sx={{ color: "#fff", lineHeight: "20px" }}>
                            {bet.lotto_type}
                            <br />
                            <span style={{ wordBreak: "break-word" }}>
                              {bet.code}
                            </span>
                            <Flex
                              sx={{
                                justifyContent: "start",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{ display: "table-cell", padding: "3px 0" }}
                              >
                                <span
                                  style={{
                                    color: "#4bacff",
                                    textDecoration: "underline",
                                  }}
                                >
                                  Gồm{" "}
                                  {bet.code ? bet.code.split(",").length : 0} tổ
                                  hợp
                                </span>
                                <span
                                  style={{
                                    color: "#fff600",
                                    lineHeight: "20px",
                                    padding: "0 5px",
                                  }}
                                >
                                  ${bet.bet_point}
                                </span>
                                <span>X{bet.rate}</span>
                              </Box>
                            </Flex>
                          </Box>
                        </Box>
                        <Box sx={{ padding: "0 10px" }}>
                          <Box
                            sx={{
                              marginBottom: "12px",
                              width: "100%",
                              height: "1px",
                              backgroundColor: "#707070",
                            }}
                          />
                          <Box
                            sx={{
                              fontSize: "0.95em",
                              color: "#fff",
                              float: "right",
                            }}
                          >
                            K.quả:
                            <span
                              style={{
                                color: getValueColor(bet.win_balance || 0),
                                fontSize: "0.95em",
                                marginLeft: "5px",
                              }}
                            >
                              {formatCurrency(bet.win_balance || 0)}
                            </span>
                          </Box>
                          <Box sx={{ color: "#fff", fontSize: "0.95em" }}>
                            Cược:{" "}
                            <span>{formatCurrency(bet.bet_amount || 0)}</span>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            ))}
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", my: 3, color: "#ccc" }}
          >
            Không có dữ liệu cho ngày này
          </Typography>
        )}
      </Box>

      {/* Fixed footer with totals */}
      <Box
        sx={{
          height: "50px",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#000",
          zIndex: "10",
          display: "table",
        }}
      >
        <Box
          sx={{
            borderRight: "1px solid #5c5c5c",
            fontSize: "0.96em",
            margin: "8px 0 0",
            height: "35px",
            lineHeight: "35px",
            width: "49%",
            color: "#fff",
            float: "left",
          }}
        >
          <Box sx={{ float: "left", marginLeft: "10%", color: "#fff" }}>
            Cược:
          </Box>
          <Box sx={{ float: "left", color: "#fff600", marginLeft: "5%" }}>
            {formatCurrency(grandTotals.totalBet)}
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: "0.96em",
            margin: "8px 0 0",
            height: "35px",
            lineHeight: "35px",
            width: "49%",
            color: "#fff",
            float: "left",
          }}
        >
          <Box sx={{ float: "left", marginLeft: "10%", color: "#fff" }}>
            K.quả:
          </Box>
          <Box
            sx={{
              float: "left",
              color: getValueColor(grandTotals.totalResult),
              marginLeft: "5%",
            }}
          >
            {formatCurrency(grandTotals.totalResult)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyReportMobile;
