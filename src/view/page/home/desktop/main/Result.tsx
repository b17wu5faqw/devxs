"use client";
export const dynamic = "force-dynamic";
import { getLastDraw, getListDraw } from "@/apis/lotto";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { useLastDraw, useListDraw } from "@/hooks/useLotto";
import { useMenuStore } from "@/stores/useMenuStore";
import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

const StyledTableRowResult = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fff",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#f3f3f3",
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#b9d6f5",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#86bbf2",
  },
}));
interface ResultProps {
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}
type LastDrawType = {
  id?: number;
  draw_no?: string;
  end_time?: string;
  result?: any;
  groupedNumbers?: any;
};

function Result({ timeLeft }: ResultProps) {
  const [selectDraw, setSelectDraw] = useState();
  const [listDraw, setListDraw] = useState<any[]>([]);
  const { scheduleId, typeId, regionId } = useMenuStore();
  const [result, setResult] = useState<LastDrawType | null>(null);
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [showGroupedNumbers, setShowGroupedNumbers] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const showOrder =
    regionId === 1 ? [1, 2, 3, 4, 5, 6, 7, 0] : [1, 2, 3, 4, 5, 6, 7, 8, 0];

  const imgMap: Record<number, number> =
    regionId === 1
      ? {
          0: 5,
          1: 5,
          2: 5,
          3: 5,
          4: 4,
          5: 4,
          6: 3,
          7: 2,
          8: 2,
        }
      : {
          0: 5,
          1: 5,
          2: 5,
          3: 5,
          4: 5,
          5: 4,
          6: 4,
          7: 3,
          8: 2,
        };
  const [hoveredNumbers, setHoveredNumbers] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  // const { lastDraw } = useLastDraw(
  //   selectDraw ? Number(selectDraw) : 0,
  //   typeId ? Number(typeId) : 1
  // );

  const fetchListDraw = useCallback(async () => {
    if (scheduleId === null || typeId === null) return;
    try {
      const data = await getListDraw({
        schedule_id: scheduleId,
        lotto_type: typeId,
      });
      setListDraw(data.data);
    } catch (err: any) {
      console.error("Error fetching current draw:", err);
    }
  }, [scheduleId, typeId]);

  useEffect(() => {
    fetchListDraw();
  }, [fetchListDraw]);

  useEffect(() => {
    if (Array.isArray(listDraw) && listDraw.length > 0) {
      setSelectDraw(listDraw[0].id);
    }
  }, [listDraw]);

  // useEffect(() => {
  //   setResult(lastDraw);
  // }, [lastDraw]);

  function chunkArray(array: any[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const fetchLastDraw = useCallback(async () => {
    if (scheduleId === null || typeId === null) return;
    console.log("fetchLastDraw");

    setIsLoading(true);
    setVisibleRows([]);
    try {
      const data = await getLastDraw({
        draw_id: selectDraw ? Number(selectDraw) : 0,
        lotto_type: typeId,
        scheduler_id: scheduleId,
      });
      setResult(data.data);
    } catch (err: any) {
      console.error("Error fetching current draw:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectDraw, scheduleId, typeId]);

  useEffect(() => {
    fetchLastDraw();
  }, [fetchLastDraw]);

  useEffect(() => {
    if (visibleRows.length < result?.result.length && !isResetting) {
      const timer = setTimeout(() => {
        const nextIndex = showOrder[visibleRows.length];
        setVisibleRows((prev) => [...prev, nextIndex]);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (visibleRows.length === result?.result.length) {
      const timer = setTimeout(() => {
        setShowGroupedNumbers(true);
        setIsRevealing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleRows, isResetting]);

  useEffect(() => {
    if (
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      fetchListDraw();
      fetchLastDraw();
      setShowGroupedNumbers(false);
      setVisibleRows([]);
      setIsRevealing(true);
      setTimeout(() => setIsResetting(false), 100);
    }
  }, [timeLeft, fetchListDraw, fetchLastDraw]);

  // useEffect(() => {
  //   console.log("result", result);
  // }, [result]);

  // useEffect(() => {
  //   console.log("visibleRows", visibleRows);
  // }, [visibleRows]);

  const highlightLastTwo = (text: string) => {
    if (text.length <= 2) {
      return (
        <span
          style={{
            color: hoveredNumbers.includes(text.slice(0, 1))
              ? "#fff"
              : "#106eb6",
            fontWeight: "bold",
            backgroundColor: hoveredNumbers.includes(text.slice(0, 1))
              ? "#106eb6"
              : "transparent",
            padding: hoveredNumbers.includes(text.slice(0, 1)) ? "0 4px" : "0",
            borderRadius: hoveredNumbers.includes(text.slice(0, 1))
              ? "10px"
              : "0",
          }}
        >
          {text}
        </span>
      );
    }

    const mainText = text.slice(0, -2);
    const lastTwo = text.slice(-2);

    return (
      <>
        {mainText}
        <span
          style={{
            color: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "#fff"
              : "#106eb6",
            fontWeight: "bold",
            backgroundColor: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "#106eb6"
              : "transparent",
            padding: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "0 4px"
              : "0",
            borderRadius: hoveredNumbers.includes(lastTwo.slice(0, 1))
              ? "10px"
              : "0",
          }}
        >
          {lastTwo}
        </span>
      </>
    );
  };

  return (
    <Flex>
      <Flex sx={{ width: "427px", height: "280px" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table sx={{ width: "100%" }}>
            <TableBody>
              {Array.isArray(result?.result) &&
                result?.result.map((row: any, rowIndex: number) => {
                  // const isRowVisible =
                  //   typeId === 2 ? visibleRows.includes(rowIndex) : true;
                  const isRowVisible =
                    typeId === 2
                      ? isRevealing
                        ? visibleRows.includes(rowIndex)
                        : true
                      : true;

                  return (
                    <StyledTableRowResult key={rowIndex}>
                      <TableCell
                        sx={{
                          width: "70px",
                          paddingX: "0",
                          paddingY: "2px",
                          borderBottom: "1px solid #fff",
                          textAlign: "center",
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          paddingX: "0",
                          paddingY: "2px",
                          borderBottom: "1px solid #fff",
                          "&:nth-of-type(2)": {
                            borderLeft: "1px solid #fff",
                          },
                        }}
                      >
                        <Flex
                          sx={{
                            textAlign: "center",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          {chunkArray(row.value, 4).map(
                            (group: any[], index: number) => (
                              <Flex
                                key={index}
                                sx={{
                                  justifyContent: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                {typeId === 2
                                  ? isRowVisible
                                    ? group
                                        .map((item, idx) => (
                                          <CustomText
                                            key={idx}
                                            sx={{
                                              margin: "0 4px",
                                              display: "inline-block",
                                              width: "auto",
                                              height: "22px",
                                            }}
                                            fs="16px"
                                            fw="500"
                                            letterSpacing="1px"
                                          >
                                            {highlightLastTwo(item)}
                                            {idx < group.length - 1 && " -"}
                                          </CustomText>
                                        ))
                                        .reduce((acc, curr, i) => {
                                          if (i === 0) return [curr];
                                          return [
                                            ...acc,
                                            <span key={`sep-${i}`}>
                                              {i !== 4}
                                            </span>,
                                            curr,
                                          ];
                                        }, [] as React.ReactNode[])
                                    : group
                                        .map((item, idx) => (
                                          <CustomText
                                            key={idx}
                                            sx={{
                                              margin: "0 4px",
                                              display: "inline-block",
                                              width: "auto",
                                              height: "22px",
                                            }}
                                            fs="16px"
                                            fw="500"
                                            letterSpacing="1px"
                                          >
                                            <img
                                              className="flex h-full w-auto object-cover"
                                              src={`/images/main/${imgMap[rowIndex]}.gif`}
                                              alt=""
                                            />
                                          </CustomText>
                                        ))
                                        .reduce((acc, curr, i) => {
                                          if (i === 0) return [curr];
                                          return [
                                            ...acc,
                                            <span key={`sep-${i}`}>
                                              {i !== 4 && "-"}
                                            </span>,
                                            curr,
                                          ];
                                        }, [] as React.ReactNode[])
                                  : // Always show content for other typeIds
                                    group.map((item, idx) => (
                                      <CustomText
                                        key={idx}
                                        sx={{
                                          margin: "0 4px",
                                          display: "inline-block",
                                          width: "auto",
                                          height: "22px",
                                        }}
                                        fs="16px"
                                        fw="500"
                                        letterSpacing="1px"
                                      >
                                        {highlightLastTwo(item)}
                                        {idx < group.length - 1 && " -"}
                                      </CustomText>
                                    ))}
                              </Flex>
                            )
                          )}
                        </Flex>
                      </TableCell>
                    </StyledTableRowResult>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Flex>
      <Flex
        sx={{
          width: "222px",
          height: "280px",
          borderRight: "1px solid #fff",
          position: "relative",
        }}
      >
        {/* {isLoading && (
          <div id="loading">
            <img
              className="loadingImg"
              src="/images/main/logoLightLoading.png"
              alt=""
            />
          </div>
        )} */}
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table sx={{ width: "100%" }}>
            <TableBody>
              {result?.groupedNumbers.map((row: any, key: number) => (
                <StyledTableRow
                  key={key}
                  onMouseEnter={() => setHoveredNumbers(key.toString())}
                  onMouseLeave={() => setHoveredNumbers("")}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#106eb6",
                      color: "#fff",
                    },
                    "&:hover td": {
                      color: "#fff",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      width: "40px",
                      paddingY: "0",
                      borderBottom: "1px solid #fff",
                    }}
                  >
                    {key}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      paddingY: "0",
                      borderBottom: "1px solid #fff",
                      "&:nth-of-type(2)": {
                        borderLeft: "1px solid #fff",
                      },
                    }}
                  >
                    {typeId === 1
                      ? row.join(",")
                      : showGroupedNumbers
                      ? row.join(",")
                      : ""}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Flex>
      <Flex sx={{ width: "150px", height: "280px", fontSize: "14px" }}>
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table sx={{ width: "100%" }}>
            <TableBody>
              {Array.isArray(listDraw) &&
                listDraw.map((row: any) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      cursor: "pointer",
                      background:
                        selectDraw === row.id
                          ? "url(/images/lotto/btn_arrowL.svg) no-repeat center left 20px #106eb6!important"
                          : "",
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f3f3f3",
                      },
                      "&:nth-of-type(even)": {
                        backgroundColor: "#dbdbdb",
                      },
                      "&:hover": {
                        backgroundColor: "#cedff2",
                      },
                    }}
                  >
                    <TableCell
                      onClick={() => setSelectDraw(row.id)}
                      align="center"
                      sx={{
                        padding: "0",
                        borderBottom: "1px solid #fff",
                        fontWeight: selectDraw === row.id ? "600" : "500",
                        color: selectDraw === row.id ? "#fff" : "#000",
                      }}
                    >
                      {row.draw_no}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
}

export default Result;
