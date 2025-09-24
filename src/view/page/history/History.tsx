"use client";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { useHistory } from "@/hooks/useLotto";
import { useAuthStore } from "@/stores/authStore";
import { Box, Collapse, Divider, TablePagination } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { history } from "@/apis/lotto";
import formatCurrency, {
  isGreaterThanZero,
} from "@/components/format/Currency";

export interface HistoryType {
  pageIndex: number;
  pageSize: number;
  totalPage: number;
  totalRecord: number;
  totalBet: number;
  totalWin: number;
  totalResult: number;
  data: HistoryItemType[];
}

export interface HistoryItemType {
  id?: number;
  title?: string;
  draw_no?: string;
  type?: string;
  bill_numbers?: string;
  bet_point: number;
  money?: number;
  money_win?: number;
  code?: string;
  rate?: number;
  created_time?: string;
  win_time?: string;
  balance?: number;
  win_balance?: number;
  win_rate?: number;
  win_status?: number;
  win_total?: number;
  bet_type_id: number;
}

function History() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const [lottoHistory, setLottoHistory] = useState<HistoryType | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const toggleDetails = (id: number) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const fetchRealTimeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await history({
        jwt_key: accessToken || "",
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      });

      if (response && response.status === 1 && response.data) {
        setLottoHistory(response.data);
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

  useEffect(() => {
    fetchRealTimeData();
  }, [accessToken, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                borderBottom: "3px solid #feb64e",
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
        <Box sx={{ height: "50px", backgroundColor: "#111" }}>
          <Box
            sx={{
              width: "90%",
              margin: "0 auto",
              display: "table",
              padding: "10px 0",
            }}
          >
            <Box
              sx={{
                float: "left",
                width: "26%",
                borderRadius: "2px",
                marginRight: "3%",
                letterSpacing: "-0.5px",
                fontSize: "0.7rem",
                color: "#fff",
                border: "1px solid #2b5640",
                backgroundColor: "#1f4734",
                padding: "2%",
                textAlign: "center",
              }}
            >
              Tất cả
            </Box>
            <Box
              sx={{
                float: "left",
                width: "26%",
                borderRadius: "2px",
                marginRight: "3%",
                letterSpacing: "-0.5px",
                fontSize: "0.7rem",
                color: "#ccc",
                border: "1px solid rgba(255,255,255,0.5)",
                padding: "2%",
                textAlign: "center",
              }}
            >
              Đã kết toán
            </Box>
            <Box
              sx={{
                float: "left",
                width: "26%",
                borderRadius: "2px",
                marginRight: "3%",
                letterSpacing: "-0.5px",
                fontSize: "0.7rem",
                color: "#ccc",
                border: "1px solid rgba(255,255,255,0.5)",
                padding: "2%",
                textAlign: "center",
              }}
            >
              Chưa kết toán
            </Box>
            <Box
              sx={{
                width: "25px",
                height: "25px",
                marginRight: "10px",
                float: "right",
                background: "url(/images/main/icon_reset2.svg) no-repeat",
                opacity: "0.7",
                marginTop: "4px",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ padding: "90px 0px" }}>
        {lottoHistory &&
          Array.isArray(lottoHistory.data) &&
          lottoHistory.data.map((item: HistoryItemType) => (
            <Box key={item.id}>
              <Box sx={{ width: "90%", margin: "10px auto", display: "table" }}>
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
                    <CustomText sx={{ fontSize: "0.95em", color: "#fff" }}>
                      {item.title} <span>Kỳ {item.draw_no}</span>
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
                        transform: "rotate(180deg)",
                        margin: "auto",
                        background:
                          'url("/images/main/icon_arrow_bet.png") no-repeat center',
                        backgroundSize: "100%",
                      },
                    }}
                    onClick={() => item.id && toggleDetails(item.id)}
                  />
                </Box>
                <Collapse
                  sx={{ padding: "0 5px", backgroundColor: "#383838" }}
                  in={expandedItemId === item.id}
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
                        {item.created_time || "N/A"}
                      </span>
                    </CustomText>

                    <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                      Phát thưởng:{" "}
                      <span className="text-[#ff7373]">
                        {item.win_time || "N/A"}
                      </span>
                    </CustomText>

                    <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                      Mã số:{" "}
                      <span className="text-white">
                        {item.bill_numbers || "N/A"}
                      </span>
                    </CustomText>

                    <Divider sx={{ borderColor: "#707070", my: 1 }} />

                    <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                      Tiền thắng:{" "}
                      <span className="text-white">{item.win_total}</span>
                    </CustomText>

                    <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                      Số dư:{" "}
                      <span className="text-[#40b401]">
                        {item.balance || "0"}
                      </span>
                    </CustomText>

                    <CustomText sx={{ color: "#ccc", fontSize: "1rem" }}>
                      Tiền nhận:{" "}
                      <span className="text-[#0078ff]">
                        {item.money_win || "0"}
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
                      {item.type}
                      <br />
                      <span style={{ wordBreak: "break-word" }}>
                        {item.code} @{" "}
                        <span style={{ color: "#fff600" }}>
                          {item.win_rate}
                        </span>
                      </span>
                      <Flex
                        sx={{
                          display:
                            item.bet_type_id == 8 ||
                            item.bet_type_id == 64 ||
                            item.bet_type_id == 111 ||
                            item.bet_type_id == 112 ||
                            item.bet_type_id == 113 ||
                            item.bet_type_id == 121 ||
                            item.bet_type_id == 122 ||
                            item.bet_type_id == 123
                              ? "none"
                              : "block",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "table-cell", padding: "3px 0" }}>
                          <span
                            style={{
                              color: "#4bacff",
                              textDecoration: "underline",
                            }}
                          >
                            Gồm {item.code ? item.code.split(",").length : 0} tổ
                            hợp
                          </span>
                          <span
                            style={{
                              color: "#fff600",
                              lineHeight: "20px",
                              padding: "0 5px",
                            }}
                          >
                            ${item.bet_point}
                          </span>
                          <span>X{item.rate}</span>
                        </Box>
                      </Flex>
                      <Box
                        sx={{
                          display: "block",
                          position: "absolute",
                          right: "2%",
                          bottom: "0",
                          width: "26px",
                          height: "26px",
                          background:
                            "url(/images/main/icon_delete.svg) no-repeat center",
                          backgroundSize: "58%",
                        }}
                      />
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
                      sx={{ fontSize: "0.95em", color: "#fff", float: "right" }}
                    >
                      K.quả:
                      <span
                        style={{
                          color:
                            item.win_status === 0
                              ? "#40b401"
                              : isGreaterThanZero(
                                  item.win_balance?.toString() || "0"
                                )
                              ? "#40b401"
                              : "#ff0101",
                          fontSize: "0.95em",
                        }}
                      >
                        {item.win_status === 0 ? "0" : item.win_balance || "0"}
                      </span>
                    </Box>
                    <Box sx={{ color: "#fff", fontSize: "0.95em" }}>
                      Cược: <span>{formatCurrency(item.money || 0)}</span>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={lottoHistory?.totalRecord || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hiển thị:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            color: "#fff",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#fff",
              },
            "& .MuiTablePagination-actions button": {
              color: "#fff",
            },
          }}
        />
      </Box>
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
            {formatCurrency(lottoHistory?.totalBet ?? 0)}
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
                (lottoHistory?.totalResult ?? 0) < 0 ? "#ff0101" : "#40b401",
              marginLeft: "5%",
            }}
          >
            {formatCurrency(lottoHistory?.totalResult ?? 0)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default History;
