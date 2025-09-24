import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  styled,
  Chip,
  Divider,
} from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { getDailyReport } from "@/apis/lotto";
import Flex from "@/components/utils/Flex";
import { useSearchParams } from "next/navigation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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

// Styled components for consistent styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px",
  fontWeight: 500,
  backgroundColor: "#fff",
  borderRight: "1px solid #e4e5e6",
  fontSize: "13px",
  "&:first-of-type": {
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
  },
  "&:last-of-type": {
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
    borderRight: "none",
  },
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#e8ecf0",
  color: "#333",
  fontWeight: "500",
  padding: "8px 10px",
  border: "0",
  borderRight: "1px solid #e4e5e6",
  "&:last-child": {
    borderRight: "none",
  },
}));

const ProviderTitle = styled(Box)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "600",
  padding: "10px 15px",
  backgroundColor: "#d9e6f7",
  borderRadius: "5px 5px 0 0",
  marginTop: "20px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "#c8daef",
  },
}));

const DailyReportDesktop = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "";

  const [reportData, setReportData] = useState<LotteryProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const [expandedProviders, setExpandedProviders] = useState<{
    [key: number]: boolean;
  }>({});

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

  // Format time from string like "03-03 23:59:46"
  const formatTime = (dateTimeStr: string): string => {
    // The string format is already DD-MM HH:MM:SS
    const parts = dateTimeStr.split(" ");
    if (parts.length === 2) {
      return parts[1]; // Return just the time part
    }
    return dateTimeStr; // Return original if not in expected format
  };

  // Format currency values
  const formatCurrency = (value: number | string) => {
    const numValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Function to determine text color based on value
  const getValueColor = (value: number | string) => {
    let numValue;
    if (typeof value === "string") {
      // Remove commas and convert to number
      numValue = parseFloat(value.replace(/,/g, ""));
    } else {
      numValue = value;
    }
    return numValue >= 0 ? "#4caf50" : "#f44336";
  };

  // Calculate the grand totals across all providers
  const calculateGrandTotals = () => {
    let totalWinBalance = 0;
    let totalWinRate = 0;
    let totalWinAmount = 0;
    let totalResultAmount = 0;

    reportData.forEach((provider) => {
      provider.details.forEach((bet) => {
        if (bet.win_balance) {
          const winBalance =
            typeof bet.win_balance === "string"
              ? parseFloat(bet.win_balance.replace(/,/g, ""))
              : bet.win_balance;

          totalWinBalance += winBalance;
        }
        if (bet.win_rate) {
          const winRate =
            typeof bet.win_rate === "string"
              ? parseFloat(bet.win_rate.replace(/,/g, ""))
              : bet.win_rate;

          totalWinRate += winRate;
        }
        if (bet.win_amount) {
          const winAmount = bet.win_amount;

          totalWinAmount += winAmount;
        }
        if (bet.win_amount) {
          const resultAmount = bet.win_amount;
          totalResultAmount += resultAmount;
        }
      });
    });

    return {
      bet: reportData.reduce((sum, provider) => sum + provider.total_bet, 0),
      winrateProvider: reportData.reduce(
        (sum, provider) => sum + provider.total_win_rate,
        0
      ),
      refund: reportData.reduce(
        (sum, provider) => sum + provider.total_refund,
        0
      ),
      win_amount: reportData.reduce(
        (sum, provider) => sum + provider.total_result,
        0
      ),
      winBalance: totalWinBalance,
      winRate: totalWinRate,
      winAmount: totalWinAmount,
      resultAmount: totalResultAmount,
    };
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
          schedule: "",
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

  useEffect(() => {
    if (reportData.length > 0) {
      const initialExpanded = reportData.reduce((acc, _, index) => {
        acc[index] = false; // Set all to expanded initially
        return acc;
      }, {} as { [key: number]: boolean });

      setExpandedProviders(initialExpanded);
    }
  }, [reportData]);

  const toggleProviderExpansion = (providerIndex: number) => {
    setExpandedProviders((prev) => ({
      ...prev,
      [providerIndex]: !prev[providerIndex],
    }));
  };

  // Calculate grand totals
  const grandTotals = calculateGrandTotals();

  return (
    <Box
      sx={{
        backgroundColor: "#e8ecf0",
        minHeight: "100vh",
        width: "1100px",
        margin: "0 auto",
      }}
    >
      <Flex
        sx={{
          backgroundColor: "#30679f",
          height: "80px",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#fff", mb: 0 }}
        >
          Lịch sử đặt cược
        </Typography>
      </Flex>

      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: 2,
          boxShadow: 0,
          backgroundColor: "#e8ecf0",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography
            variant="body1"
            color="error"
            sx={{ textAlign: "center", my: 3 }}
          >
            {error}
          </Typography>
        ) : reportData.length > 0 ? (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#e8ecf0",
                mb: 1,
                boxShadow: 0,
              }}
            >
              <Table
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: "0px 3px",
                }}
              >
                {/* Provider Title Row */}
                <TableHead>
                  <TableRow>
                    <HeaderTableCell align="center" width={220}>
                      Thông tin
                    </HeaderTableCell>
                    <HeaderTableCell align="center">
                      Nội dung đặt cược
                    </HeaderTableCell>
                    <HeaderTableCell width={90} align="center">
                      Tiền cược
                    </HeaderTableCell>
                    <HeaderTableCell width={90} align="center">
                      Số dư
                    </HeaderTableCell>
                    <HeaderTableCell width={90} align="center">
                      Tiền thắng
                    </HeaderTableCell>
                    <HeaderTableCell width={90} align="center">
                      Hoàn trả
                    </HeaderTableCell>
                    <HeaderTableCell width={90} align="right">
                      Kết quả
                    </HeaderTableCell>
                    <HeaderTableCell width={90} align="center">
                      Tiền nhận
                    </HeaderTableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            {/* Loop through each lottery provider */}
            {reportData.map((provider, index) => (
              <Box key={index} sx={{ mb: 0 }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#e8ecf0",
                    mb: 2,
                    boxShadow: 0,
                  }}
                >
                  <Table
                    sx={{
                      borderCollapse: "separate",
                      borderSpacing: "0px 3px",
                    }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#d9e6f7",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#c8daef",
                          },
                        }}
                        onClick={() => toggleProviderExpansion(index)}
                      >
                        <TableCell
                          colSpan={2}
                          width={360}
                          sx={{
                            fontWeight: 600,
                            fontSize: "16px",
                            padding: "8px",
                            borderBottom: 0,
                            borderRight: "1px solid #b9c2c8",
                          }}
                        >
                          <Flex sx={{ justifyContent: "flex-start" }}>
                            {expandedProviders[index] ? (
                              <KeyboardArrowUpIcon sx={{ mr: 1 }} />
                            ) : (
                              <KeyboardArrowDownIcon sx={{ mr: 1 }} />
                            )}
                            {provider.title}
                          </Flex>
                        </TableCell>
                        <TableCell
                          align="right"
                          width={90}
                          sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            padding: "8px",
                            borderBottom: 0,
                            borderRight: "1px solid #b9c2c8",
                          }}
                        >
                          {formatCurrency(provider.total_bet)}
                        </TableCell>
                        <TableCell
                          align="right"
                          width={90}
                          sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            padding: "8px",
                            borderBottom: 0,
                            borderRight: "1px solid #b9c2c8",
                          }}
                        ></TableCell>
                        <TableCell
                          align="right"
                          width={90}
                          sx={{
                            fontSize: "14px",
                            padding: "8px",
                            borderBottom: 0,
                            borderRight: "1px solid #b9c2c8",
                          }}
                        >
                          {formatCurrency(provider.total_win_rate)}
                        </TableCell>
                        <TableCell
                          align="right"
                          width={90}
                          sx={{
                            fontSize: "14px",
                            padding: "8px",
                            borderBottom: 0,
                            borderRight: "1px solid #b9c2c8",
                          }}
                        >
                          {formatCurrency(provider.total_result)}
                        </TableCell>
                        <TableCell
                          align="right"
                          width={90}
                          sx={{
                            fontSize: "14px",
                            padding: "8px",
                            borderBottom: 0,
                            borderRight: "1px solid #b9c2c8",
                            color: getValueColor(provider.total_win_balance),
                          }}
                        >
                          {formatCurrency(provider.total_win_balance)}
                        </TableCell>
                        <TableCell
                          align="right"
                          width={90}
                          sx={{
                            fontWeight: 600,
                            fontSize: "14px",
                            padding: "8px",
                            borderBottom: 0,
                            color: getValueColor(provider.total_result),
                          }}
                        >
                          0.0{/* {formatCurrency(provider.total_result)} */}
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    {/* Only show detail rows if expanded */}
                    {expandedProviders[index] && (
                      <>
                        <TableBody>
                          {provider.details.map((bet) => (
                            <TableRow key={bet.id} hover>
                              <StyledTableCell>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ color: "#495d71", fontSize: "13px" }}
                                  >
                                    Đặt cược: {bet.create_time}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ color: "#495d71", fontSize: "13px" }}
                                  >
                                    Phát thưởng:{" "}
                                    <span className="text-[#ff0000]">
                                      {bet.win_time}
                                    </span>
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ color: "#495d71", fontSize: "13px" }}
                                  >
                                    Mã số: {bet.bill_number}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: "bold", fontSize: "13px" }}
                                >
                                  {provider.title} Kỳ {bet.draw_no}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "#495d71", fontSize: "13px" }}
                                >
                                  {bet.lotto_type}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    width: "260px",
                                    wordBreak: "break-word",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                    border: "1px solid #ccc",
                                    padding: "2px 5px",
                                  }}
                                >
                                  {bet.code}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: "#495d71",
                                    fontSize: "13px",
                                    paddingTop: "5px",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Gồm{" "}
                                    {bet.code ? bet.code.split(",").length : 0}{" "}
                                    tổ hợp
                                  </span>{" "}
                                  ${bet.bet_point} X {bet.rate}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="right" width={75}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: "600" }}
                                >
                                  {formatCurrency(bet.bet_amount)}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="right" width={75}>
                                {bet.balance}
                              </StyledTableCell>
                              <StyledTableCell align="right" width={75}>
                                <Typography variant="subtitle2">
                                  {formatCurrency(bet.win_rate)}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="right" width={75}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "#20b715" }}
                                >
                                  {formatCurrency(bet.win_amount)}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="right" width={75}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: getValueColor(bet.win_balance),
                                  }}
                                >
                                  {bet.win_balance}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="right" width={75}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: "#4254b0" }}
                                >
                                  {bet.result_amount}
                                </Typography>
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </>
                    )}
                  </Table>
                </TableContainer>
              </Box>
            ))}
            {/* Summary box at the top - Grand Total */}
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#c4ccd3",
                boxShadow: 0,
              }}
            >
              <Table
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: "0px 3px",
                }}
              >
                {/* Provider Title Row */}
                <TableHead>
                  <TableRow>
                    <HeaderTableCell
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: "#495d71",
                      }}
                      align="right"
                      colSpan={2}
                      width={520}
                    >
                      Tổng cộng
                    </HeaderTableCell>
                    <HeaderTableCell
                      width={90}
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: "#495d71",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                      align="right"
                    >
                      {formatCurrency(grandTotals.bet)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      width={90}
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                      }}
                      align="center"
                    ></HeaderTableCell>
                    <HeaderTableCell
                      width={90}
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                      }}
                      align="center"
                    >
                      {formatCurrency(grandTotals.winRate)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      width={90}
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: getValueColor(grandTotals.winAmount),
                      }}
                      align="right"
                    >
                      {formatCurrency(grandTotals.winAmount)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      width={90}
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: getValueColor(grandTotals.winBalance),
                      }}
                      align="right"
                    >
                      {formatCurrency(grandTotals.winBalance)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      width={90}
                      sx={{ backgroundColor: "#c4ccd3" }}
                      align="center"
                    >
                      {" "}
                    </HeaderTableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", my: 3, color: "#666" }}
          >
            Không có dữ liệu cho ngày này
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DailyReportDesktop;
