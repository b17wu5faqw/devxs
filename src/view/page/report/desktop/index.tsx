"use client";
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
} from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { getReport } from "@/apis/lotto";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
import { useRouter } from "next/navigation";

// Define types for our data structure
interface DayReport {
  date: string;
  bet: string;
  refund: string;
  result: string;
  formattedDate?: string; // For display
  dayOfWeek?: string; // For display
}

interface WeekReport {
  week: string;
  total_bet: number;
  total_refund: number;
  total_result: number;
  days: DayReport[];
}

// Styled components for consistent styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "12px 16px",
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
  },
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#e8ecf0",
  color: "#333",
  fontWeight: "500",
  padding: "14px 16px",
  border: "0",
  borderRight: "1px solid #e4e5e6",
}));

const WeekTotalRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#c4ccd3",
  "& .MuiTableCell-root": {
    borderTop: "1px solid #ddd",
    borderBottom: "2px solid #ddd",
    backgroundColor: "#c4ccd3",
  },
}));

const getRefundColor = (value: number | string) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return numValue < 0 ? "#f44336" : "#4caf50"; // Red for negative, green for zero or positive
};

const ReportDesktop = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState<DayReport[]>([]);
  const [weeklyTotals, setWeeklyTotals] = useState<{
    [week: string]: { bet: number; refund: number; result: number };
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  // Helper function to format date
  const formatDate = (
    dateStr: string
  ): { formattedDate: string; dayOfWeek: string } => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

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

    return {
      formattedDate: `${day}-${month}`,
      dayOfWeek,
    };
  };

  // Format currency values
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("vi-VN").format(numValue);
  };

  // Function to determine text color based on value
  const getValueColor = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return numValue >= 0 ? "#4caf50" : numValue < 0 ? "#f44336" : "inherit";
  };

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getReport({ jwt_key: accessToken || "" });

        if (response && response.status === 1 && Array.isArray(response.data)) {
          // Process data to flatten it and format dates
          const flattenedData: DayReport[] = [];
          const weekTotals: {
            [week: string]: { bet: number; refund: number; result: number };
          } = {};

          response.data.forEach((week: WeekReport) => {
            // Add week totals
            weekTotals[week.week] = {
              bet: week.total_bet,
              refund: week.total_refund,
              result: week.total_result,
            };

            // Add days with formatted dates
            const daysWithFormattedDates = week.days.map((day) => {
              const { formattedDate, dayOfWeek } = formatDate(day.date);
              return {
                ...day,
                formattedDate,
                dayOfWeek,
                weekName: week.week,
              };
            });

            flattenedData.push(...daysWithFormattedDates);
          });

          // Sort by date, newest first
          flattenedData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setReportData(flattenedData);
          setWeeklyTotals(weekTotals);
        } else {
          // Handle API error
          const errorMsg = response?.message || "Không thể tải dữ liệu báo cáo";
          throw new Error(errorMsg);
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [accessToken]);

  const handleDayClick = (day: DayReport) => {
    // Extract date in YYYY-MM-DD format from the original date string
    let formattedDate = "";

    if (day.date) {
      // Handle case where date is in format "2025-03-04 00:00:00"
      if (day.date.includes(" ")) {
        formattedDate = day.date.split(" ")[0]; // Gets the part before the space
      } else {
        // If it's already in the right format or a different format
        const dateObj = new Date(day.date);
        formattedDate = dateObj.toISOString().split("T")[0]; // Gets YYYY-MM-DD
      }
    }

    // Open a new window with the daily report
    window.open(
      `/report/daily?date=${formattedDate}`,
      "DailyReportWindow",
      "width=1050px,height=700,resizable=yes,scrollbars=yes"
    );
  };

  // Group data by week for display
  const groupedByWeek: { [week: string]: DayReport[] } = {};
  reportData.forEach((day) => {
    const weekName = (day as any).weekName || "Unknown";
    if (!groupedByWeek[weekName]) {
      groupedByWeek[weekName] = [];
    }
    groupedByWeek[weekName].push(day);
  });

  // Calculate grand totals
  const grandTotals = Object.values(weeklyTotals).reduce(
    (totals, week) => {
      return {
        bet: totals.bet + week.bet,
        refund: totals.refund + week.refund,
        result: totals.result + week.result,
      };
    },
    { bet: 0, refund: 0, result: 0 }
  );

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
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#fff", mb: 0, pl: 2 }}
        >
          Lịch sử đặt cược
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
          onClick={() => router.push("/report/RealList")}
        >
          Vừa cược
        </CustomText>
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
          Sao kê
        </CustomText>
      </Flex>
      <Paper
        elevation={3}
        sx={{
          px: 2,
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
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#e8ecf0",
                boxShadow: "0",
                padding: "0",
              }}
            >
              <Table
                sx={{
                  borderCollapse: "separate",
                  borderSpacing: "0px 3px",
                }}
              >
                <TableHead>
                  <TableRow sx={{ borderRadius: "6px" }}>
                    <HeaderTableCell>Ngày kết toán</HeaderTableCell>
                    <HeaderTableCell align="right">Tiền cược</HeaderTableCell>
                    <HeaderTableCell align="right">Hoàn trả</HeaderTableCell>
                    <HeaderTableCell align="right">Kết quả</HeaderTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Display data grouped by week */}
                  {Object.entries(groupedByWeek).map(([weekName, days]) => (
                    <>
                      {/* Days in the week */}
                      {days.map((day, dayIndex) => (
                        <TableRow
                          key={day.date}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleDayClick(day)}
                        >
                          <StyledTableCell sx={{ textAlign: "center" }}>
                            {day.dayOfWeek} {day.formattedDate}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            sx={{ fontSize: "16px", fontWeight: "600" }}
                          >
                            {formatCurrency(day.bet)}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            sx={{
                              color: getRefundColor(day.refund),
                              textDecoration: "underline",
                            }}
                          >
                            {formatCurrency(day.refund)}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            sx={{
                              color: getValueColor(day.result),
                              textDecoration: "underline",
                            }}
                          >
                            {formatCurrency(day.result)}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                      {/* Week total row */}
                      <WeekTotalRow key={`total-${weekName}`}>
                        <StyledTableCell sx={{ textAlign: "right" }}>
                          {weekName}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            textAlign: "right",
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          {formatCurrency(weeklyTotals[weekName]?.bet || 0)}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {formatCurrency(weeklyTotals[weekName]?.refund || 0)}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          sx={{
                            color: getValueColor(
                              weeklyTotals[weekName]?.result || 0
                            ),
                            fontWeight: "bold",
                          }}
                        >
                          {formatCurrency(weeklyTotals[weekName]?.result || 0)}
                        </StyledTableCell>
                      </WeekTotalRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ReportDesktop;
