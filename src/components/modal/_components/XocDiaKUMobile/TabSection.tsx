import React from "react";
import { TabSectionProps, TabType, LastDrawResult } from "./types";
// Import desktop utilities for consistency
import { analyzeDiceResult, analyzeResults, createDisplayGrid } from "@/view/page/home/desktop/main/XocDia/utils";

// Use desktop utility functions instead of local ones

// Component cho tab Kèo đôi - Enhanced với statistics API data từ desktop pattern
const CombinationTab: React.FC<{
  stats: ReturnType<typeof analyzeResults>;
  displayGrid: ReturnType<typeof createDisplayGrid>;
  statisticDoubleBetData?: any;
  isStatisticDoubleBetLoading?: boolean;
  statisticDoubleBetError?: any;
}> = ({
  stats,
  displayGrid,
  statisticDoubleBetData,
  isStatisticDoubleBetLoading = false,
  statisticDoubleBetError
}) => {
  // Process API data following desktop StatisticsSection pattern
  const processApiData = () => {
    if (!statisticDoubleBetData?.data || statisticDoubleBetError || isStatisticDoubleBetLoading) {
      // Fallback to local data
      return {
        chanLeGrid: displayGrid.chanLeGrid,
        taiXiuGrid: displayGrid.taiXiuGrid,
        chanLeStats: stats,
        taiXiuStats: stats,
        useApiData: false
      };
    }

    const taixiuData = statisticDoubleBetData.data.taixiu || [];
    const chanleData = statisticDoubleBetData.data.chanle || [];

    // Process road data following desktop pattern
    const processRoadData = (data: any[], maxCols = 22) => {
      const roadData: any[][] = Array.from({ length: 6 }, () => Array(maxCols).fill(null));
      let colIndex = 0;

      data.forEach((column: any[]) => {
        if (colIndex >= maxCols) return;

        column.forEach((item: any, itemIndex: number) => {
          if (itemIndex >= 6) return;

          let value = '';
          // Handle taixiu data (T/X/H for hòa)
          if (item.taixiu) {
            switch (item.taixiu) {
              case 'T':
                value = 'T';
                break;
              case 'X':
                value = 'X';
                break;
              case '-':
              case 'H':
                value = 'H';
                break;
              default:
                value = '';
            }
          }
          // Handle chanle data (L/C/- for hòa)
          if (item.chanle) {
            switch (item.chanle) {
              case 'L':
                value = 'L';
                break;
              case 'C':
                value = 'C';
                break;
              case '-':
                value = '-';
                break;
              default:
                value = '';
            }
          }

          if (value) {
            roadData[itemIndex][colIndex] = {
              value,
              drawId: item.draw_no,
              drawNo: item.draw_no
            };
          }
        });

        colIndex++;
      });

      return roadData;
    };

    // Calculate statistics from API data
    const calculateApiStats = (data: any[], field: string) => {
      let count1 = 0, count2 = 0, countHoa = 0;
      data.forEach((column: any[]) => {
        column.forEach((item: any) => {
          const value = item[field];
          if (field === 'chanle') {
            if (value === 'L') count1++;
            else if (value === 'C') count2++;
            else if (value === '-') countHoa++;
          } else if (field === 'taixiu') {
            if (value === 'T') count1++;
            else if (value === 'X') count2++;
            else if (value === '-' || value === 'H') countHoa++;
          }
        });
      });
      return { count1, count2, countHoa };
    };

    const chanLeApiStats = calculateApiStats(chanleData, 'chanle');
    const taiXiuApiStats = calculateApiStats(taixiuData, 'taixiu');

    return {
      chanLeGrid: processRoadData(chanleData, 22),
      taiXiuGrid: processRoadData(taixiuData, 22),
      chanLeStats: {
        leCount: chanLeApiStats.count1,
        chanCount: chanLeApiStats.count2,
        hoaCount: chanLeApiStats.countHoa
      },
      taiXiuStats: {
        taiCount: taiXiuApiStats.count1,
        xiuCount: taiXiuApiStats.count2,
        hoaCount: taiXiuApiStats.countHoa
      },
      useApiData: true
    };
  };

  const { chanLeGrid, taiXiuGrid, chanLeStats, taiXiuStats, useApiData } = processApiData();

  // Show loading state if API is loading
  if (isStatisticDoubleBetLoading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span>Đang tải dữ liệu kèo đôi...</span>
      </div>
    );
  }

  // Show error state if API has error
  if (statisticDoubleBetError && !statisticDoubleBetData?.data) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span>Lỗi tải dữ liệu kèo đôi</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* First section - Chẵn/Lẻ (6 rows) */}
      <div className="flex border-b-2 border-gray-500">
        {/* Left labels column */}
        <div className="flex flex-col flex-1 bg-gray-100 justify-center">
          <div className="h-4 flex items-center justify-center text-xs">
            <span className="text-red-600">L</span>
            <span className="ml-1 text-black">{chanLeStats.leCount}</span>
          </div>
          <div className="h-4 flex items-center justify-center text-xs">
            <span className="text-blue-600">C</span>
            <span className="ml-1 text-black">{chanLeStats.chanCount}</span>
          </div>
        </div>

        {/* Main grid - Chẵn/Lẻ (6 rows x 22 cols = 132 results) */}
        <div className="border-r border-b border-gray-300">
          {chanLeGrid.map((row, rowIndex) => (
            <div key={`chanle-row-${rowIndex}`} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={`chanle-${rowIndex}-${colIndex}`}
                  className="w-4 h-4 border-t border-l border-gray-300 flex items-center justify-center text-xs"
                >
                  {cell ? (
                    <span
                      className={
                        cell.value === "L" ? "text-red-600" :
                        cell.value === "C" ? "text-blue-600" :
                        cell.value === "-" ? "text-green-600" : "text-black"
                      }
                    >
                      {cell.value}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Second section - Tài/Xỉu (6 rows) */}
      <div className="flex">
        {/* Left labels column */}
        <div className="flex flex-col flex-1 bg-gray-100 justify-center">
          <div className="h-4 bg-gray-100 flex items-center justify-center text-xs">
            <span className="text-red-600">T</span>
            <span className="ml-1 text-black">{taiXiuStats.taiCount}</span>
          </div>
          <div className="h-4 bg-gray-100 flex items-center justify-center text-xs">
            <span className="text-blue-600">X</span>
            <span className="ml-1 text-black">{taiXiuStats.xiuCount}</span>
          </div>
        </div>

        {/* Main grid - Tài/Xỉu (6 rows x 22 cols = 132 results) */}
        <div className="border-r border-b border-gray-300">
          {taiXiuGrid.map((row, rowIndex) => (
            <div key={`taixiu-row-${rowIndex}`} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={`taixiu-${rowIndex}-${colIndex}`}
                  className="w-4 h-4 border-t border-l border-gray-300 flex items-center justify-center text-xs"
                >
                  {cell ? (
                    <span
                      className={
                        cell.value === "T" ? "text-red-600" :
                        cell.value === "X" ? "text-blue-600" :
                        cell.value === "H" ? "text-green-600" : "text-black"
                      }
                    >
                      {cell.value}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component cho tab Điểm số - Enhanced với statistics API data từ desktop pattern
const PointsTab: React.FC<{
  statisticDoubleBetData?: any;
  isStatisticDoubleBetLoading?: boolean;
  statisticDoubleBetError?: any;
}> = ({
  statisticDoubleBetData,
  isStatisticDoubleBetLoading = false,
  statisticDoubleBetError
}) => {

  if (isStatisticDoubleBetLoading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (statisticDoubleBetError) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span>Lỗi tải dữ liệu</span>
      </div>
    );
  }

  // Use statisticDoubleBetData.data.taixiu following desktop pattern
  if (!statisticDoubleBetData?.data?.taixiu) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span>Không có dữ liệu</span>
      </div>
    );
  }

  const taixiuData = statisticDoubleBetData.data.taixiu.slice(0, 17); // Take first 17 items for mobile grid

  // Function to get result content following desktop pattern
  const getResultContent = (result: string) => {
    if (!result) return null;

    const colors = result.split(',');
    const redCount = colors.filter(c => c === 'R').length;
    const whiteCount = colors.filter(c => c === 'W').length;
    const majorityRed = redCount > whiteCount;

    // Nếu tất cả là trắng hoặc tất cả là đỏ
    if (whiteCount === 4 || redCount === 4) {
      const count = whiteCount === 4 ? 4 : 4;
      const isWhite = whiteCount === 4;
      return (
        <span
          className={`flex items-center justify-center rounded-full ${
            isWhite
              ? "bg-white text-black border border-gray-300"
              : "bg-red-600 text-white"
          }`}
          style={{
            width: `calc(100vw / 17 * 0.8)`,
            height: `calc(100vw / 17 * 0.8)`,
          }}
        >
          {count}
        </span>
      );
    }

    // Nếu có 3 đỏ 1 trắng hoặc 3 trắng 1 đỏ
    if (redCount === 3 || whiteCount === 3) {
      const count = 3;
      return (
        <span
          className={`flex items-center justify-center rounded-full ${
            majorityRed
              ? "bg-red-600 text-white"
              : "bg-white text-black border border-gray-300"
          }`}
          style={{
            width: `calc(100vw / 17 * 0.8)`,
            height: `calc(100vw / 17 * 0.8)`,
          }}
        >
          {count}
        </span>
      );
    }

    // Nếu có 2 đỏ 2 trắng - hiển thị icon đặc biệt
    if (redCount === 2 && whiteCount === 2) {
      return (
        <img
          src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg"
          className="block border-0 text-black text-base font-normal text-center overflow-clip cursor-pointer"
          style={{
            width: `calc(100vw / 17 * 0.8)`,
            height: `calc(100vw / 17 * 0.8)`,
          }}
          alt="half-red-white"
        />
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full bg-white">
      <table
        className="table-fixed border-t border-t-gray-500 border-l border-l-gray-500 border-r-0 border-b-0 text-black text-base font-normal text-center overflow-visible float-left box-border w-full"
        style={{
          width: "calc(100% - 10px)",
          height: `calc(100vw / 17 * 6)`, // Height based on 6 rows
        }}
      >
        <tbody className="table-row-group w-full border-0 text-black text-base font-normal text-center overflow-visible align-middle box-content">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className="table-row w-full border-0 text-black text-base font-normal text-center overflow-visible align-middle"
            >
              {Array.from({ length: 17 }).map((_, colIndex) => {
                // Process data from taixiuData following desktop pattern
                const columnData = taixiuData[colIndex];
                let content = null;

                if (columnData && Array.isArray(columnData)) {
                  // Handle multi-item column
                  if (rowIndex < columnData.length) {
                    const item = columnData[rowIndex];
                    content = getResultContent(item.result);
                  }
                } else if (columnData) {
                  // Handle single item column
                  if (rowIndex === 0) {
                    content = getResultContent(columnData.result);
                  }
                }

                return (
                  <td
                    key={`r${rowIndex + 1}c${colIndex + 1}`}
                    className="table-cell relative border-r border-r-gray-500 border-b border-b-gray-500 bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer"
                    style={{
                      width: `calc(100vw / 17)`,
                      height: `calc(100vw / 17)`,
                      minWidth: `calc(100vw / 17)`,
                      minHeight: `calc(100vw / 17)`,
                      maxWidth: `calc(100vw / 17)`,
                      maxHeight: `calc(100vw / 17)`,
                    }}
                  >
                    {content && (
                      <div className="w-full h-full flex items-center justify-center">
                        {content}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component cho tab Thống kê - Enhanced với data từ desktop pattern
const StatisticsTab: React.FC<{
  lastDrawResults: LastDrawResult[];
  statisticLast30Data?: any;
  statisticDoubleBetData?: any;
  isLoading?: boolean;
  isStatisticDoubleBetLoading?: boolean;
  statisticDoubleBetError?: any;
}> = ({
  lastDrawResults,
  statisticLast30Data,
  statisticDoubleBetData,
  isLoading = false,
  isStatisticDoubleBetLoading = false,
  statisticDoubleBetError
}) => {

  if (isLoading) {
    return (
      <div className="bg-white h-full p-2 flex items-center justify-center">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  // Function to parse API statistics
  const parseApiStatistics = (apiData: any) => {
    if (!apiData?.data || !Array.isArray(apiData.data)) {
      return null;
    }

    // Initialize statistics object
    const statistics = {
      fourWhite: 0,
      fourRed: 0,
      threeWhiteOneRed: 0,
      threeRedOneWhite: 0,
      twoWhiteTwoRed: 0,
    };

    // Parse each result from the API
    apiData.data.forEach((item: any) => {
      const result = item.result;
      const count = item.count || 0;

      if (result) {
        // Split the result string to count red and white dices
        const dices = result.split(",");
        const redCount = dices.filter((d: string) => d.trim() === "R").length;
        const whiteCount = dices.filter((d: string) => d.trim() === "W").length;

        // Update statistics based on dice distribution
        if (redCount === 4) {
          statistics.fourRed += count;
        } else if (whiteCount === 4) {
          statistics.fourWhite += count;
        } else if (redCount === 3 && whiteCount === 1) {
          statistics.threeRedOneWhite += count;
        } else if (whiteCount === 3 && redCount === 1) {
          statistics.threeWhiteOneRed += count;
        } else if (redCount === 2 && whiteCount === 2) {
          statistics.twoWhiteTwoRed += count;
        }
      }
    });

    return statistics;
  };

  // Fallback function to calculate stats from lastDrawResults
  const calculateStatsFromLastDraws = () => {
    if (!lastDrawResults || lastDrawResults.length === 0) {
      return {
        fourWhite: 0,
        fourRed: 0,
        threeWhiteOneRed: 0,
        threeRedOneWhite: 0,
        twoWhiteTwoRed: 0,
      };
    }

    const stats = {
      fourWhite: 0,
      fourRed: 0,
      threeWhiteOneRed: 0,
      threeRedOneWhite: 0,
      twoWhiteTwoRed: 0,
    };

    lastDrawResults.forEach((draw) => {
      const dices = draw.result.split(",");
      const redCount = dices.filter((d) => d === "R").length;
      const whiteCount = dices.filter((d) => d === "W").length;

      if (redCount === 4) stats.fourRed++;
      else if (whiteCount === 4) stats.fourWhite++;
      else if (redCount === 3) stats.threeRedOneWhite++;
      else if (whiteCount === 3) stats.threeWhiteOneRed++;
      else stats.twoWhiteTwoRed++;
    });

    return stats;
  };

  // Use parsed statistics from API if available, otherwise calculate from lastDrawResults
  const apiStats = parseApiStatistics(statisticLast30Data);
  const stats = apiStats || calculateStatsFromLastDraws();

  return (
    <div className="bg-white h-full p-2">
      {/* Top row with 4 columns */}
      <div className="grid grid-cols-2 gap-3 text-center text-sm mb-2">
        {/* 4 White dices */}
        <div className="text-center flex gap-2 h-[30px]">
          <div className="flex justify-center gap-1">
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
          </div>
          <div className="bg-white border border-gray-300 h-full flex-1 flex items-center justify-center text-lg">
            {stats.fourWhite}
          </div>
        </div>

        {/* 4 Red dices */}
        <div className="text-center flex gap-2 h-[30px]">
          <div className="flex justify-center gap-1">
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
          </div>
          <div className="bg-white border border-gray-300 h-full flex-1 flex items-center justify-center text-lg">
            {stats.fourRed}
          </div>
        </div>

        <div className="text-center flex gap-2 h-[30px]">
          <div className="flex justify-center gap-1">
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
          </div>
          <div className="bg-white border border-gray-300 h-full flex-1 flex items-center justify-center text-lg">
            {stats.threeWhiteOneRed}
          </div>
        </div>

        <div className="text-center flex gap-2 h-[30px]">
          <div className="flex justify-center gap-1">
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
          </div>
          <div className="bg-white border border-gray-300 h-full flex-1 flex items-center justify-center text-lg">
            {stats.threeRedOneWhite}
          </div>
        </div>

        <div className="text-center flex gap-2 h-[30px]">
          <div className="flex justify-center gap-1">
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceW.svg"
              className="h-full"
              alt="White dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
            <img
              src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_diceR.svg"
              className="h-full"
              alt="Red dice"
            />
          </div>
          <div className="bg-white border border-gray-300 h-full flex-1 flex items-center justify-center text-lg">
            {stats.twoWhiteTwoRed}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabSection: React.FC<TabSectionProps> = ({
  activeTab,
  onTabChange,
  lastDrawResults = [],
  // Statistics data từ desktop - following StatisticsSection pattern
  statisticData,
  statisticLast30ResultData,
  statisticDoubleBetData,
  isStatisticLoading,
  isStatisticDoubleBetLoading,
  statisticDoubleBetError,
}) => {
  // Use lastDrawResults for primary data
  const stats = analyzeResults(lastDrawResults);
  const displayGrid = createDisplayGrid(lastDrawResults);

  return (
    <>
      <div className="bg-[#ebebeb] p-2 h-[42px] flex w-full flex-1 justify-between items-center">
        <div className="flex flex-1 gap-2 justify-between items-center">
          <button
            className={`flex-1 h-[28px] px-4 text-sm font-medium border rounded ${
              activeTab === TabType.COMBINATION
                ? "bg-[#d7ecff] text-[#4f88c1] border-[#4f88c1]"
                : "bg-white text-black border-[#d2d2d2] hover:bg-[#d7ecff] hover:text-[#4f88c1] hover:border-[#4f88c1]"
            } transition-all duration-200`}
            onClick={() => onTabChange(TabType.COMBINATION)}
          >
            Kèo đôi
          </button>
          <button
            className={`flex-1 h-[28px] px-4 text-sm font-medium border rounded ${
              activeTab === TabType.POINTS
                ? "bg-[#d7ecff] text-[#4f88c1] border-[#4f88c1]"
                : "bg-white text-black border-[#d2d2d2] hover:bg-[#d7ecff] hover:text-[#4f88c1] hover:border-[#4f88c1]"
            } transition-all duration-200`}
            onClick={() => onTabChange(TabType.POINTS)}
          >
            Điểm số
          </button>
          <button
            className={`flex-1 h-[28px] px-4 text-sm font-medium border rounded ${
              activeTab === TabType.STATISTICS
                ? "bg-[#d7ecff] text-[#4f88c1] border-[#4f88c1]"
                : "bg-white text-black border-[#d2d2d2] hover:bg-[#d7ecff] hover:text-[#4f88c1] hover:border-[#4f88c1]"
            } transition-all duration-200`}
            onClick={() => onTabChange(TabType.STATISTICS)}
          >
            Thống kê
          </button>
        </div>
      </div>

      <div className="bg-white overflow-hidden">
        {activeTab === TabType.COMBINATION && (
          <CombinationTab
            stats={stats}
            displayGrid={displayGrid}
            statisticDoubleBetData={statisticDoubleBetData}
            isStatisticDoubleBetLoading={isStatisticDoubleBetLoading}
            statisticDoubleBetError={statisticDoubleBetError}
          />
        )}

        {activeTab === TabType.POINTS && (
          <PointsTab
            statisticDoubleBetData={statisticDoubleBetData}
            isStatisticDoubleBetLoading={isStatisticDoubleBetLoading}
            statisticDoubleBetError={statisticDoubleBetError}
          />
        )}

        {activeTab === TabType.STATISTICS && (
          <StatisticsTab
            lastDrawResults={lastDrawResults}
            statisticLast30Data={statisticLast30ResultData}
            statisticDoubleBetData={statisticDoubleBetData}
            isLoading={isStatisticLoading}
            isStatisticDoubleBetLoading={isStatisticDoubleBetLoading}
            statisticDoubleBetError={statisticDoubleBetError}
          />
        )}
      </div>

      <div className="bg-black text-white p-2 flex items-center text-xs">
        <span className="mr-2">❌</span>
        <div className="flex-1">
          Kết quả mở thưởng 2 trắng 2 đỏ, đặt cược tài , xỉu hoàn tiền cược
          (không tính thắng thua)
        </div>
      </div>
    </>
  );
};

export default TabSection;
