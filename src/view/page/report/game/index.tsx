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
  Divider,
} from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { getGameReport } from "@/apis/lotto"; // You'll need to create this API function
import { useRouter, useSearchParams } from "next/navigation";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

interface GameReportItem {
  schedule_id: number;
  loai_hang_muc: string;
  tien_cuoc: string | number;
  ket_qua: number;
  date: string;
}

// Styled components for consistent styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "12px 8px",
  backgroundColor: "#515151",
  borderRight: "1px solid #707070",
  borderLeft: "1px solid #707070",
  borderTop: "1px solid #707070",
  borderBottom: "0",
  fontSize: "14px",
  color: "#fff",
}));

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  color: "#ccc",
  padding: "13px 0",
  textAlign: "center",
  borderBottom: "0",
}));

const ReportGame = () => {
  const [reportData, setReportData] = useState<GameReportItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  // Format currency values
  const formatCurrency = (value: number | string) => {
    if (value === undefined || value === null) return "0";

    const numValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

    if (isNaN(numValue)) return "0";

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

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call the API with the JWT token and date parameter
        const response = await getGameReport({
          jwt_key: accessToken || "",
          date: dateParam,
        });

        if (response && response.status === 1 && Array.isArray(response.data)) {
          setReportData(response.data);
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

    if (accessToken) {
      fetchReportData();
    }
  }, [accessToken, dateParam]);

  // Calculate the grand totals
  const calculateGrandTotals = () => {
    const totalBet = reportData.reduce((sum, item) => {
      const betAmount =
        typeof item.tien_cuoc === "string"
          ? parseFloat(item.tien_cuoc.replace(/,/g, ""))
          : item.tien_cuoc;
      return sum + (betAmount || 0);
    }, 0);

    const totalResult = reportData.reduce((sum, item) => {
      return sum + (item.ket_qua || 0);
    }, 0);

    return {
      tien_cuoc: totalBet,
      ket_qua: totalResult,
    };
  };

  // Calculate grand totals
  const grandTotals = calculateGrandTotals();

  // Format the date for display
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

        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            mb: 3,
            boxShadow: 0,
            backgroundColor: "#383838",
            margin: "0 15px 15px",
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
              <CircularProgress sx={{ color: "#30679f" }} />
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
            <Box>
              <TableContainer
                sx={{ borderRadius: "5px", padding: "0 10px 10px" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderTableCell>Loại hạng mục</HeaderTableCell>
                      <HeaderTableCell align="right">Tiền cược</HeaderTableCell>
                      <HeaderTableCell align="right">Kết quả</HeaderTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((item) => (
                      <TableRow key={item.schedule_id} hover>
                        <StyledTableCell>{item.loai_hang_muc}</StyledTableCell>
                        <StyledTableCell align="right">
                          {formatCurrency(item.tien_cuoc)}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          sx={{
                            color: getValueColor(item.ket_qua),
                            fontWeight: 500,
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            router.push(
                              `/report/daily?date=${item.date}&schedule=${item.schedule_id}`
                            )
                          }
                        >
                          {formatCurrency(item.ket_qua)}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                  <Box
                    sx={{ float: "left", color: "#fff600", marginLeft: "5%" }}
                  >
                    {grandTotals.tien_cuoc}
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
                      color:
                        (grandTotals.ket_qua ?? 0) < 0 ? "#ff0101" : "#40b401",
                      marginLeft: "5%",
                    }}
                  >
                    {formatCurrency(grandTotals.ket_qua)}
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", my: 3, color: "#666" }}
            >
              Không có dữ liệu báo cáo cho ngày này
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ReportGame;
