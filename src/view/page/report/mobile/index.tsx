import { getReport } from "@/apis/lotto";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { useAuthStore } from "@/stores/authStore";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface DayReport {
  date: string;
  bet: string | number;
  refund: string | number;
  result: string | number;
  formattedDate?: string;
  dayOfWeek?: string;
}

interface WeekReport {
  week: string;
  total_bet: number;
  total_refund: number;
  total_result: number;
  days: DayReport[];
}

// Styled table cells for mobile view
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 6px",
  fontSize: "0.9rem",
  color: "#ccc",
  borderRight: "1px solid #707070",
  borderLeft: "1px solid #707070",
  borderTop: "1px solid #707070",
  borderBottom: "0",
  height: "40px",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 6px",
  fontSize: "0.9rem",
  color: "#ccc",
  backgroundColor: "#515151",
  borderRight: "1px solid #707070",
  borderLeft: "1px solid #707070",
  borderTop: "1px solid #707070",
  borderBottom: "0",
  height: "40px",
}));

const ReportMobile = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState<WeekReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const [expandedWeeks, setExpandedWeeks] = useState<{
    [key: string]: boolean;
  }>({});

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
    let numValue;

    // Convert string to number, handling strings that may already have commas
    if (typeof value === "string") {
      // Replace any existing commas with nothing before parsing
      numValue = parseFloat(value.replace(/,/g, ""));
    } else {
      numValue = value;
    }

    // Check if the value is a valid number
    if (isNaN(numValue)) {
      return "0";
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Function to determine text color based on value
  const getValueColor = (value: number | string) => {
    let numValue;
    if (typeof value === "string") {
      numValue = parseFloat(value.replace(/,/g, ""));
    } else {
      numValue = value;
    }
    return numValue >= 0 ? "#4caf50" : "#f44336";
  };

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getReport({ jwt_key: accessToken || "" });

        if (response && response.status === 1 && Array.isArray(response.data)) {
          // Process data to format dates
          const processedData = response.data.map((week: WeekReport) => {
            const daysWithFormattedDates = week.days.map((day) => {
              const { formattedDate, dayOfWeek } = formatDate(day.date);
              return {
                ...day,
                formattedDate,
                dayOfWeek,
              };
            });

            return {
              ...week,
              days: daysWithFormattedDates,
            };
          });

          setReportData(processedData);
        } else {
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

  // Initialize all weeks as expanded (or you can set to collapsed by default)
  useEffect(() => {
    if (reportData.length > 0) {
      const initialExpanded = reportData.reduce((acc, week, index) => {
        acc[index] = true; // Set all to collapsed initially
        return acc;
      }, {} as { [key: string]: boolean });

      setExpandedWeeks(initialExpanded);
    }
  }, [reportData]);

  // Toggle function to expand/collapse weeks
  const toggleWeekExpansion = (weekIndex: number) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekIndex]: !prev[weekIndex],
    }));
  };

  // Navigate to daily report
  const handleDayClick = (day: DayReport) => {
    const dateObj = new Date(day.date);
    const formattedDate = dateObj.toISOString().split("T")[0];
    router.push(`/report/game?date=${formattedDate}`);
  };

  // Calculate grand totals
  const grandTotals = reportData.reduce(
    (totals, week) => {
      return {
        bet: totals.bet + week.total_bet,
        refund: totals.refund + week.total_refund,
        result: totals.result + week.total_result,
      };
    },
    { bet: 0, refund: 0, result: 0 }
  );

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
              onClick={() => router.push("/")}
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
              onClick={() => router.push("/history")}
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
        {/* Main Content - with padding to offset fixed header */}
        <Box sx={{ pt: "20px", px: 2, pb: 2 }}>
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
          ) : (
            <Box>
              {/* Table view of weeks and days */}
              {reportData.map((week, weekIndex) => (
                <Paper
                  key={weekIndex}
                  sx={{
                    mb: 2,
                    backgroundColor: "#383838",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* Week header as clickable row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: "10px",
                      backgroundColor: "#383838",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleWeekExpansion(weekIndex)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#fff", fontWeight: 600 }}
                      >
                        {week.week}
                      </Typography>
                      {expandedWeeks[weekIndex] ? (
                        <KeyboardArrowUpIcon sx={{ color: "#707070", mr: 1 }} />
                      ) : (
                        <KeyboardArrowDownIcon
                          sx={{ color: "#707070", mr: 1 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Days table - only show when expanded */}
                  {expandedWeeks[weekIndex] && (
                    <TableContainer
                      sx={{ padding: "0 10px", backgroundColor: "#383838" }}
                    >
                      <Table sx={{ borderBottom: "1px solid #707070" }}>
                        <TableHead>
                          <TableRow>
                            <StyledHeaderCell>Ngày kết toán</StyledHeaderCell>
                            <StyledHeaderCell align="right">
                              Tiền cược
                            </StyledHeaderCell>
                            <StyledHeaderCell align="right">
                              Kết quả
                            </StyledHeaderCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {week.days.map((day) => (
                            <TableRow
                              key={day.date}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { backgroundColor: "#1d3a2d" },
                              }}
                            >
                              <StyledTableCell component="th" scope="row">
                                {day.dayOfWeek} {day.formattedDate}
                              </StyledTableCell>
                              <StyledTableCell
                                align="right"
                                sx={{ color: "#fff" }}
                              >
                                {formatCurrency(day.bet)}
                              </StyledTableCell>
                              <StyledTableCell
                                align="right"
                                sx={{
                                  color: getValueColor(day.result),
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDayClick(day)}
                              >
                                {formatCurrency(day.result)}
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Week totals row - ALWAYS VISIBLE */}
                  <Box sx={{ padding: "0 10px 10px" }}>
                    <Box
                      sx={{
                        height: "1px",
                        width: "100%",
                        backgroundColor: "#707070",
                        marginBottom: "10px",
                      }}
                    />
                    <Flex>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "1em", color: "#a8a7a7" }}
                      >
                        Cược:{" "}
                        <span className="text-white">
                          {formatCurrency(week.total_bet)}
                        </span>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "1em", color: "#fff" }}
                      >
                        K.quả:{" "}
                        <span
                          style={{ color: getValueColor(week.total_result) }}
                        >
                          {formatCurrency(week.total_result)}
                        </span>
                      </Typography>
                    </Flex>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReportMobile;
