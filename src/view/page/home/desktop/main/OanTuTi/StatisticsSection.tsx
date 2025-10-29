import React from "react";
import { RpsStatisticItem } from "./types";

interface StatisticsSectionProps {
  activeTab: 'points' | 'keo-doi';
  onTabChange: (tab: 'points' | 'keo-doi') => void;
  statisticData: any;
  statisticLast30ResultData: any;
  statisticDoubleBetData: any;
  isStatisticLoading: boolean;
  isStatisticDoubleBetLoading: boolean;
  statisticDoubleBetError: any;
  leftActiveTab?: 'nha-cai' | 'nha-con';
  onLeftTabChange?: (tab: 'nha-cai' | 'nha-con') => void;
}

// Helper function để render icon - giống như BettingOptions.tsx
const renderIcon = (code: string, size: number) => {
  const iconMap = {
    'STONE': '/images/oantuti/icon_stone.svg',
    'ROCK': '/images/oantuti/icon_stone.svg',
    'SCISSORS': '/images/oantuti/icon_scissors.svg',
    'PAPER': '/images/oantuti/icon_paper.svg'
  };

  const iconSrc = iconMap[code as keyof typeof iconMap];
  if (!iconSrc) return null;

  return <img src={iconSrc} alt={code} width={size} height={size} />;
};

// Helper function để convert dice number thành icon code
const getDiceIconCode = (diceValue: string): string => {
  const diceMap = {
    '1': 'STONE',
    '2': 'SCISSORS',
    '3': 'PAPER',
    '4': 'STONE',
    '5': 'SCISSORS',
    '6': 'PAPER'
  };
  return diceMap[diceValue as keyof typeof diceMap] || 'STONE';
};

// Helper function để convert RPS code thành icon code
const getRpsIconCode = (rpsValue: string): string => {
  const rpsMap = {
    'BUA': 'STONE',
    'KEO': 'SCISSORS',
    'BAO': 'PAPER'
  };
  return rpsMap[rpsValue as keyof typeof rpsMap] || 'STONE';
};

// Helper function để render RPS icon với size nhỏ cho statistics grid
const renderRpsIcon = (rpsCode: string, size: number = 16) => {
  const iconCode = getRpsIconCode(rpsCode);
  return renderIcon(iconCode, size);
};

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  activeTab,
  onTabChange,
  statisticData,
  statisticLast30ResultData,
  statisticDoubleBetData,
  isStatisticLoading,
  isStatisticDoubleBetLoading,
  statisticDoubleBetError,
  leftActiveTab = 'nha-cai',
  onLeftTabChange = () => { }
}) => {

  const renderNhaCai = () => {
    if (isStatisticDoubleBetLoading) {
      return (
        <div className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto flex items-center justify-center" style={{ width: "calc(100% - 10px)", maxWidth: "490px" }}>
          <span>Đang tải dữ liệu...</span>
        </div>
      );
    }

    if (statisticDoubleBetError || !statisticDoubleBetData?.data) {
      return (
        <div className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto flex items-center justify-center" style={{ width: "calc(100% - 10px)", maxWidth: "490px" }}>
          <span>Không có dữ liệu</span>
        </div>
      );
    }

    // RPS API trả về data array với format: [{result: 0, count: {dealer: "BUA", player: "BUA", winner: "HOA"}}]
    const rpsDataArray = statisticDoubleBetData?.data || [];

    // RPS data là flat array, truyền trực tiếp cho processRoadData
    const dealerData = rpsDataArray;
    const playerData = rpsDataArray;

    // Test with fixed data to see if processing works
    const testData = [
      [
        { "draw_no": "1257", "dealer": "KEO", "player": "BAO", "winner": "CAI" },
        { "draw_no": "1256", "dealer": "BUA", "player": "KEO", "winner": "CON" }
      ]
    ];

    // Process RPS data into road format with Baccarat-style road logic
    const processRoadData = (data: any[], field: 'dealer' | 'player') => {
      const roadData: any[][] = Array.from({ length: 6 }, () => Array(30).fill(null));

      let currentCol = 0;
      let currentRow = 0;
      let lastRpsCode = '';

      data.forEach((item: any, index: number) => {
        if (currentCol >= 30) return; // Limit to 30 columns

        let rpsCode = '';
        let color = '';

        // Get the RPS code from count field
        if (item && item.count) {
          rpsCode = item.count[field]; // "BUA", "KEO", "BAO"

          // Set color based on RPS type
          switch (rpsCode) {
            case 'BUA':
              color = 'red';
              break;
            case 'KEO':
              color = 'blue';
              break;
            case 'BAO':
              color = 'green';
              break;
            default:
              color = 'gray';
              break;
          }
        }

        if (rpsCode) {
          // Road logic: same result = same column, different result = new column
          if (index === 0) {
            // First item
            currentCol = 0;
            currentRow = 0;
          } else if (rpsCode === lastRpsCode) {
            // Same result as previous - move down in same column
            currentRow++;
            if (currentRow >= 6) {
              // Column full, move to next column
              currentCol++;
              currentRow = 0;
            }
          } else {
            // Different result - move to next column
            currentCol++;
            currentRow = 0;
          }

          // Place the icon if within bounds
          if (currentCol < 30 && currentRow < 6) {
            roadData[currentRow][currentCol] = {
              rpsCode,
              color,
              dataGid: item.result || index,
              icon: renderRpsIcon(rpsCode, 16)
            };
          }

          lastRpsCode = rpsCode;
        }
      });

      return roadData;
    };

    // Use test data if real data is empty
    const finalDealerData = dealerData.length > 0 ? dealerData : testData;
    const finalPlayerData = playerData.length > 0 ? playerData : testData;

    const roadData1 = processRoadData(finalDealerData, 'dealer');
    const roadData2 = processRoadData(finalPlayerData, 'player');





    // Calculate statistics for RPS - flat array processing
    const calculateRpsStats = (data: any[], field: string) => {
      const stats: { [key: string]: number } = {};
      data.forEach((item: any) => {
        // RPS data có cấu trúc item.count[field]
        const value = item?.count?.[field];
        if (value && value !== '-') {
          stats[value] = (stats[value] || 0) + 1;
        }
      });
      return stats;
    };

    const dealerStats = calculateRpsStats(finalDealerData, 'dealer');
    const playerStats = calculateRpsStats(finalPlayerData, 'player');





    return (
      <div id="divRank" className="">
        <div
          className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto block"
          id="pk10RankR"
          style={{
            display: 'block',

            maxWidth: "490px"
          }}
        >
          <table cellPadding="0" cellSpacing="0" className="border-t border-t-[#ccc] border-l border-l-[#ccc] w-[99%] float-left mx-auto mt-[2px] ml-[2px] table-fixed text-center hidden"></table>
          <div className="float-left w-full h-full flex flex-col justify-between">
            {/* Single grid for current tab */}
            <div className="w-full">
              <table
                cellPadding="0"
                cellSpacing="0"
                id="rankRoad_1"
                className="border-t border-t-[#ccc] border-l border-l-[#ccc] h-[88px] table-fixed float-left mx-auto text-center w-full"
              >
                <tbody>
                  {(leftActiveTab === 'nha-cai' ? roadData1 : roadData2).map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`} className="relative border-r border-r-[#ccc] border-b border-b-[#ccc] w-[16px] h-[14px] text-xs bg-white cursor-pointer hover:bg-[rgb(255,201,56)]">
                          {cell && (
                            <div
                              className="flex items-center justify-center h-full w-full cursor-pointer"
                              data-gid={cell.dataGid}
                            >
                              {cell.icon}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full bg-[#f0f0f0] h-[25px] border border-[#cbcbcb] border-t-0 float-left">
              <div className="w-1/3 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#399ffc]">Kéo</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_0_0">
                  {leftActiveTab === 'nha-cai' ? (dealerStats.KEO || 0) : (playerStats.KEO || 0)}
                </span>
              </div>
              <div className="w-1/3 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#fe7566]">Búa</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_0_1">
                  {leftActiveTab === 'nha-cai' ? (dealerStats.BUA || 0) : (playerStats.BUA || 0)}
                </span>
              </div>
              <div className="w-1/3 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#ffbb01]">Bao</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_1_0">
                  {leftActiveTab === 'nha-cai' ? (dealerStats.BAO || 0) : (playerStats.BAO || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTuTiThangThua = () => {
    if (isStatisticDoubleBetLoading) {
      return (
        <div className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto flex items-center justify-center" style={{ width: "calc(100% - 10px)", maxWidth: "490px" }}>
          <span>Đang tải dữ liệu...</span>
        </div>
      );
    }

    if (statisticDoubleBetError || !statisticDoubleBetData?.data) {
      return (
        <div className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto flex items-center justify-center" style={{ width: "calc(100% - 10px)", maxWidth: "490px" }}>
          <span>Không có dữ liệu</span>
        </div>
      );
    }

    // RPS API data for win/lose comparison
    const rpsDataArray = statisticDoubleBetData?.data || [];

    // Process win/lose results with Baccarat-style road logic
    const processWinLoseRoadData = (data: any[]) => {
      const roadData: any[][] = Array.from({ length: 6 }, () => Array(30).fill(null));

      let currentCol = 0;
      let currentRow = 0;
      let lastResult = '';

      data.forEach((item: any, index: number) => {
        if (currentCol >= 30) return; // Limit to 30 columns

        let result = '';
        let color = '';
        let displayText = '';

        // Determine win/lose result by comparing dealer vs player
        if (item && item.count) {
          const dealerChoice = item.count.dealer; // "BUA", "KEO", "BAO"
          const playerChoice = item.count.player; // "BUA", "KEO", "BAO"

          // RPS win logic: BUA > KEO > BAO > BUA
          if (dealerChoice === playerChoice) {
            result = 'HOA';
            color = 'green';
            displayText = 'H';
          } else if (
            (dealerChoice === 'BUA' && playerChoice === 'KEO') ||
            (dealerChoice === 'KEO' && playerChoice === 'BAO') ||
            (dealerChoice === 'BAO' && playerChoice === 'BUA')
          ) {
            result = 'CAI';
            color = 'red';
            displayText = 'C';
          } else {
            result = 'CON';
            color = 'blue';
            displayText = 'P';
          }
        }

        if (result) {
          // Road logic: same result = same column, different result = new column
          if (index === 0) {
            currentCol = 0;
            currentRow = 0;
          } else if (result === lastResult) {
            currentRow++;
            if (currentRow >= 6) {
              currentCol++;
              currentRow = 0;
            }
          } else {
            currentCol++;
            currentRow = 0;
          }

          // Place the circle if within bounds
          if (currentCol < 30 && currentRow < 6) {
            roadData[currentRow][currentCol] = {
              result,
              color,
              displayText,
              dataGid: item.result || index,
              icon: (
                <div
                  className={`w-4 h-4 rounded-full border-2 bg-transparent ${color === 'red' ? 'border-red-500' :
                      color === 'blue' ? 'border-[#0201ff]' :
                        'border-green-500'
                    }`}
                >
                </div>
              )
            };
          }

          lastResult = result;
        }
      });

      return roadData;
    };

    const winLoseRoadData = processWinLoseRoadData(rpsDataArray);

    // Calculate win/lose statistics
    const calculateWinLoseStats = (data: any[]) => {
      const stats: { [key: string]: number } = { CAI: 0, CON: 0, HOA: 0 };

      data.forEach((item: any) => {
        if (item && item.count) {
          const dealerChoice = item.count.dealer;
          const playerChoice = item.count.player;

          if (dealerChoice === playerChoice) {
            stats.HOA++;
          } else if (
            (dealerChoice === 'BUA' && playerChoice === 'KEO') ||
            (dealerChoice === 'KEO' && playerChoice === 'BAO') ||
            (dealerChoice === 'BAO' && playerChoice === 'BUA')
          ) {
            stats.CAI++;
          } else {
            stats.CON++;
          }
        }
      });

      return stats;
    };

    const winLoseStats = calculateWinLoseStats(rpsDataArray);



    return (
      <div id="divRank" className="">
        <div
          className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto block"
          id="pk10RankR"
          style={{
            display: 'block',

            maxWidth: "490px"
          }}
        >
          <table cellPadding="0" cellSpacing="0" className="border-t border-t-[#ccc] border-l border-l-[#ccc] w-[99%] float-left mx-auto mt-[2px] ml-[2px] table-fixed text-center hidden"></table>
          <div className="float-left w-full h-full flex flex-col justify-between">
            {/* Single grid for win/lose results */}
            <div className="w-full">
              <table
                cellPadding="0"
                cellSpacing="0"
                id="winLoseRoad"
                className="border-t border-t-[#ccc] border-l border-l-[#ccc] h-[88px] table-fixed float-left mx-auto text-center w-full"
              >
                <tbody>
                  {winLoseRoadData.map((row, rowIndex) => (
                    <tr key={`winlose-row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`winlose-cell-${rowIndex}-${cellIndex}`} className="relative border-r border-r-[#ccc] border-b border-b-[#ccc] w-[16px] h-[14px] text-xs bg-white cursor-pointer hover:bg-[rgb(255,201,56)]">
                          {cell && (
                            <div
                              className="flex items-center justify-center h-full w-full cursor-pointer"
                              data-gid={cell.dataGid}
                            >
                              {cell.icon}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full bg-[#f0f0f0] h-[25px] border border-[#cbcbcb] border-t-0 float-left">
              <div className="w-1/3 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#fe0103]">Cái</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_cai">{winLoseStats.CAI || 0}</span>
              </div>
              <div className="w-1/3 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#0201ff]">Con</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_con">{winLoseStats.CON || 0}</span>
              </div>
              <div className="w-1/3 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#00aa00]">Hòa</span>
                <span className="text-center w-1/2 block float-left text-base" id="spnCount_hoa">{winLoseStats.HOA || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-4" style={{ minWidth: "1012px" }}>
      <table cellPadding="0" cellSpacing="0" className="w-full h-[185px] border-0 bg-[#f3f3f3] text-black text-base font-normal text-start overflow-visible border-separate">
        <tbody className="w-full h-[185px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate">
          <tr className="w-full h-[35px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate">
            <th align="left" className="w-1/2 min-w-[500px] h-[35px] pl-[10px] border-0 text-[#336aab] text-sm font-bold leading-[35px] overflow-visible align-middle border-separate">
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-left">
                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Oẳn tù tì KU</span>
              </div>
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-right">
                <a
                  className={`block min-w-[100px] max-w-[125px] h-[27px] mt-[5px] mr-[5px] border-t-[3px] border-r-0 border-b-0 border-l-0 text-sm font-bold text-center leading-[27px] overflow-visible float-left cursor-pointer px-2 ${leftActiveTab === 'nha-cai'
                    ? 'border-t-[#4984c0] bg-white text-[#4984c0]'
                    : 'border-t-transparent bg-[#cccccc] text-black'
                    }`}
                  onClick={() => onLeftTabChange('nha-cai')}
                >
                  Nhà Cái
                </a>
                <a
                  className={`block min-w-[100px] max-w-[125px] h-[30px] mt-[5px] mr-[2px] border-0 text-sm font-bold text-center leading-[31px] overflow-visible float-left cursor-pointer px-2 ${leftActiveTab === 'nha-con'
                    ? 'bg-white text-[#4984c0] border-t-[3px] border-t-[#4984c0] h-[27px]'
                    : 'bg-[#cccccc] text-black'
                    }`}
                  onClick={() => onLeftTabChange('nha-con')}
                >
                  Nhà Con
                </a>
              </div>
            </th>
            <th align="left" className="w-1/2 min-w-[500px] h-[35px] pl-[10px] border-0 text-[#336aab] text-sm font-bold leading-[35px] overflow-visible align-middle border-separate">
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-left">
                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Oẳn tù tì KU</span>
              </div>
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-right">
                <a className="block min-w-[100px] max-w-[120px] h-[27px] mt-[5px] border-t-[3px] border-t-[#4984c0] border-r-0 border-b-0 border-l-0 bg-white text-[#4984c0] text-sm font-bold text-center leading-[27px] overflow-visible float-left cursor-pointer px-2">
                  Tù Tì Thắng Thua
                </a>
              </div>
            </th>
          </tr>
          <tr className="w-full h-[150px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate">
            <td valign="top" className="h-[150px] min-w-[500px] border-t-0 border-r-[2px] border-r-[#f3f3f3] border-b-0 border-l-0 bg-white text-black text-base font-normal text-start overflow-visible align-top border-separate">
              {renderNhaCai()}
            </td>
            <td valign="top" className="bg-white min-w-[500px] border-r-[2px] border-r-[#f3f3f3] border-solid">
              {renderTuTiThangThua()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsSection; 