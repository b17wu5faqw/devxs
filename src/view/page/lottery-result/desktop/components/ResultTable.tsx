import { useEffect, useState } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  styled,
  Typography,
  Box,
} from "@mui/material";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
import { getResultScheduler } from "@/apis/result";

const StyledTableRowResult = styled(TableRow)({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fff",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#f3f3f3",
  },
});

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(odd)": {
    backgroundColor: "#b9d6f5",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#86bbf2",
  },
});
interface ResultTableProps {
  schedulerId?: number;
  lottoType?: number;
}

export const ResultTable = ({ schedulerId, lottoType }: ResultTableProps) => {
  const [results, setResults] = useState<any>(null);
  const [hoveredNumbers, setHoveredNumbers] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await getResultScheduler({
          scheduler_id: schedulerId || 1,
          lotto_type: lottoType || 1,
        });
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [schedulerId]);

  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

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

  if (isLoading) {
    return (
      <div id="loading">
        <img
          className="loadingImg"
          src="/images/main/logoLightLoading.png"
          alt=""
        />
      </div>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#4984c0",
          fontSize: "14px",
          color: "#ffffff",
          marginY: "10px",
          padding: "5px 10px",
        }}
      >
        <Typography>{results.scheduler_name}</Typography>
      </Box>
      {results?.data.slice(0, 20).map((drawResult: any, drawIndex: number) => (
        <Box key={drawResult.id}>
          <Flex
            sx={{
              justifyContent: "flex-start",
              gap: "10px",
              padding: "5px 10px",
              backgroundColor: "#2c5b93",
              color: "#fff",
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "#ffe900" }}>
              Kỳ {drawResult.draw_no}
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>
              {drawResult.end_time}
            </Typography>
          </Flex>
          <Flex sx={{ width: "100%" }}>
            <Flex sx={{ flex: 1, height: "280px" }}>
              <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    {drawResult.result.map((row: any, key: number) => (
                      <StyledTableRowResult key={key}>
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
                            borderLeft: "1px solid #fff",
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
                                  {group.map((item, idx) => (
                                    <CustomText
                                      key={item}
                                      sx={{ margin: "0 4px" }}
                                      fs="14px"
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Flex>

            <Flex
              sx={{
                width: "222px",
                height: "280px",
                borderRight: "1px solid #fff",
              }}
            >
              <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table sx={{ width: "100%" }}>
                  <TableBody>
                    {drawResult.groupedNumbers.map((row: any, key: number) => (
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
                            borderLeft: "1px solid #fff",
                          }}
                        >
                          {row.join(",")}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Flex>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};
