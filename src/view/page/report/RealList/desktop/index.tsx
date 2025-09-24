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
  TablePagination,
} from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { getRealTimeReport } from "@/apis/lotto"; // You'll need to create this API function
import Flex from "@/components/utils/Flex";
import { useRouter } from "next/navigation";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomText from "@/components/text/CustomText";
import { number } from "zod";

interface BetArray {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  totalBet: number;
  totalWin: number;
  totalResult: number;
  data: BetDetail[];
}

// Define types for real-time report data
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
  status: string;
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

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  backgroundColor: getStatusColor(status),
  color: "#fff",
  fontWeight: 500,
  fontSize: "12px",
  height: "24px",
}));

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "win":
      return "#4caf50";
    case "lost":
    case "lose":
      return "#f44336";
    case "pending":
      return "#ff9800";
    case "refunded":
      return "#2196f3";
    default:
      return "#757575";
  }
};

const RealListDesktop = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState<BetArray | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // Seconds
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { accessToken } = useAuthStore();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

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
    if (value === undefined || value === null) return "0.00";

    const numValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

    if (isNaN(numValue)) return "0.00";

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
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
    return numValue > 0 ? "#4caf50" : numValue < 0 ? "#f44336" : "#333";
  };

  // Fetch real-time report data
  const fetchRealTimeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getRealTimeReport({
        jwt_key: accessToken || "",
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      });

      if (response && response.status === 1 && response.data) {
        setReportData(response.data);
      } else {
        // Handle API error
        const errorMsg =
          response?.message || "Không thể tải dữ liệu báo cáo thời gian thực";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Error fetching real-time report data:", err);
      setError(
        "Không thể tải dữ liệu báo cáo thời gian thực. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchRealTimeData();
  }, [accessToken, page, rowsPerPage]);

  // Auto-refresh data
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRealTimeData();
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [accessToken, refreshInterval]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the grand totals across all providers
  // const calculateGrandTotals = () => {
  //   let totalBet = 0;
  //   let totalWin = 0;
  //   let totalPay = 0;
  //   let totalResult = 0;

  //   reportData.forEach((provider) => {
  //     totalBet +=
  //       typeof provider.bet_amount === "string"
  //         ? parseFloat(provider.bet_amount.replace(/,/g, ""))
  //         : Number(provider.bet_amount) || 0;
  //     totalWin += provider.win_amount || 0;
  //   });

  //   return {
  //     bet: totalBet,
  //     win: totalWin,
  //   };
  // };

  // Calculate grand totals
  // const grandTotals = calculateGrandTotals();

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
          Danh sách vừa đặt cược
        </Typography>
      </Flex>
      <Flex
        sx={{
          padding: "6px 24px",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "20px",
          backgroundColor: "#d4dae1",
        }}
      >
        <CustomText
          sx={{
            backgroundColor: "#4a779f",
            border: "1px solid #4a779f",
            color: "#fff",
            width: "110px",
            height: "32px",
            lineHeight: "32px",
            borderRadius: "3px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Vừa cược
        </CustomText>
        <CustomText
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #4a779f",
            color: "#4a779f",
            width: "110px",
            height: "32px",
            lineHeight: "32px",
            borderRadius: "3px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => router.push("/report")}
        >
          Sao kê
        </CustomText>
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
        {isLoading && (!reportData || reportData.data.length === 0) ? (
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
        ) : reportData && reportData.data.length > 0 ? (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#fff",
                mb: 2,
                boxShadow: 0,
              }}
            >
              <Table
                sx={{
                  borderCollapse: "separate",
                }}
              >
                <TableHead>
                  <TableRow>
                    <HeaderTableCell>Thông tin</HeaderTableCell>
                    <HeaderTableCell>Nội dung đặt cược</HeaderTableCell>
                    <HeaderTableCell align="right">Tiền cược</HeaderTableCell>
                    <HeaderTableCell align="center">Số dư</HeaderTableCell>
                    <HeaderTableCell align="right">Tiền thắng</HeaderTableCell>
                    <HeaderTableCell align="right">Hoàn trả</HeaderTableCell>
                    <HeaderTableCell align="right">Kết quả</HeaderTableCell>
                    <HeaderTableCell align="right">Tiền nhận</HeaderTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.data.map((bet: BetDetail) => (
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
                          {bet.draw_tile || `Xổ số kỳ ${bet.draw_no}`}
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
                            Gồm {bet.code ? bet.code.split(",").length : 0} tổ
                            hợp
                          </span>{" "}
                          ${bet.bet_point} X {bet.rate}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "600" }}
                        >
                          {formatCurrency(bet.bet_amount)}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography variant="subtitle2">
                          {formatCurrency(bet.balance)}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography variant="subtitle2">
                          {formatCurrency(bet.win_rate || 0)}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#4caf50" }}
                        >
                          {formatCurrency(bet.win_amount || 0)}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color:
                              bet.win_amount -
                                (typeof bet.bet_amount === "string"
                                  ? parseFloat(bet.bet_amount)
                                  : bet.bet_amount) >
                              0
                                ? "#4caf50"
                                : "#ff0000",
                          }}
                        >
                          {formatCurrency(
                            bet.win_amount -
                              (typeof bet.bet_amount === "string"
                                ? parseFloat(bet.bet_amount)
                                : bet.bet_amount) || 0
                          )}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#4caf50" }}
                        >
                          {formatCurrency(0)}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <HeaderTableCell
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: "#495d71",
                      }}
                      colSpan={2}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Tổng cộng
                      </Typography>
                    </HeaderTableCell>
                    <HeaderTableCell
                      align="right"
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: "#495d71",
                        fontWeight: 600,
                      }}
                    >
                      {formatCurrency(reportData.totalBet)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      align="center"
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                      }}
                    ></HeaderTableCell>
                    <HeaderTableCell
                      align="right"
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: "#4caf50",
                      }}
                    >
                      {formatCurrency(reportData.totalWin)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      align="right"
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: "#4caf50",
                      }}
                    >
                      {formatCurrency(0)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      align="right"
                      sx={{
                        backgroundColor: "#c4ccd3",
                        borderRightColor: "#aab2ba",
                        color: getValueColor(reportData.totalResult),
                      }}
                    >
                      {formatCurrency(reportData.totalResult)}
                    </HeaderTableCell>
                    <HeaderTableCell
                      align="right"
                      sx={{
                        backgroundColor: "#c4ccd3",
                      }}
                    ></HeaderTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={reportData.totalRecord}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Hiển thị:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", my: 3, color: "#666" }}
          >
            Không có dữ liệu cược nào
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default RealListDesktop;
