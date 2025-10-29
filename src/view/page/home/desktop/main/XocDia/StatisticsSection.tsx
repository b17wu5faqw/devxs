import React from "react";

interface StatisticsSectionProps {
  activeTab: 'points' | 'keo-doi';
  onTabChange: (tab: 'points' | 'keo-doi') => void;
  statisticData: any;
  statisticLast30ResultData: any;
  statisticDoubleBetData: any;
  isStatisticLoading: boolean;
  isStatisticDoubleBetLoading: boolean;
  statisticDoubleBetError: any;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  activeTab,
  onTabChange,
  statisticData,
  statisticLast30ResultData,
  statisticDoubleBetData,
  isStatisticLoading,
  isStatisticDoubleBetLoading,
  statisticDoubleBetError
}) => {
  const isStatisticDataValid = statisticData &&
    typeof statisticData === 'object' &&
    statisticData.status === 1 &&
    Array.isArray(statisticData.data);

  const renderScoreTable = () => {
    if (!statisticDoubleBetData?.data?.taixiu) {
      return <div className="flex items-center justify-center h-[140px]">Không có dữ liệu</div>;
    }

    const taixiuData = statisticDoubleBetData.data.taixiu.slice(0, 21); // Take first 21 items

    const getResultContent = (result: string) => {
      if (!result) return null;
      
      const colors = result.split(',');
      const redCount = colors.filter(c => c === 'R').length;
      const whiteCount = colors.filter(c => c === 'W').length;
      const majorityRed = redCount > whiteCount;

      // Nếu tất cả là trắng hoặc tất cả là đỏ
      if (whiteCount === 4 || redCount === 4) {
        if (whiteCount === 4) {
          return (
            <span className="block w-[22px] h-[22px] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer border border-[#ccc]">
              4
            </span>
          );
        } else {
          return (
            <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
              4
            </span>
          );
        }
      }

      // Nếu có 3 đỏ 1 trắng hoặc 3 trắng 1 đỏ
      if (redCount === 3 || whiteCount === 3) {
        const count = 3;
        if (majorityRed) {
          return (
            <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
              {count}
            </span>
          );
        } else {
          return (
            <span className="block w-[22px] h-[22px] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer border border-[#ccc]">
              {count}
            </span>
          );
        }
      }

      // Nếu có 2 đỏ 2 trắng
      if (redCount === 2 && whiteCount === 2) {
        const firstTwo = colors.slice(0, 2).join('');
        if ((firstTwo === 'R,R' && colors[2] === 'W') || (firstTwo === 'W,W' && colors[2] === 'R')) {
          return (
            <span className="block w-[22px] h-[22px] border-0 rounded-[50px] text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
              <img 
                src="https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_RWball.svg" 
                className="block w-[22px] h-[22px] border-0 text-black text-base font-normal text-center leading-[23px] overflow-clip cursor-pointer" 
                alt="half-red-white" 
              />
            </span>
          );
        }
      }

      // Nếu có 1 đỏ 3 trắng hoặc 1 trắng 3 đỏ
      if (redCount === 1 || whiteCount === 1) {
        const count = 1;
        if (majorityRed) {
          return (
            <span className="block w-[22px] h-[22px] border-0 rounded-[50px] bg-[#d11c1c] text-white text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer">
              {count}
            </span>
          );
        } else {
          return (
            <span className="block w-[22px] h-[22px] rounded-[50px] bg-white text-black text-base font-normal text-center leading-[23px] overflow-visible cursor-pointer border border-[#ccc]">
              {count}
            </span>
          );
        }
      }

      return null;
    };

    return (
      <table
        className="table-fixed h-[139px] mt-[5px] ml-[2px] border-t border-t-[#ccc] border-l border-l-[#ccc] border-r-0 border-b-0 text-black text-base font-normal text-center overflow-visible float-left box-border"
        style={{ width: "calc(100% - 10px)", maxWidth: "493px" }}
      >
        <tbody className="table-row-group w-full h-[138px] border-0 text-black text-base font-normal text-center overflow-visible align-middle box-content">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="table-row w-full h-[23px] border-0 text-black text-base font-normal text-center overflow-visible align-middle">
              {Array.from({ length: 21 }).map((_, colIndex) => {
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
                  <td key={`r${rowIndex + 1}c${colIndex + 1}`} className="table-cell relative w-[22px] h-[22px] border-r border-r-[#ccc] border-b border-b-[#ccc] bg-[#f3f3f3] text-black text-xs font-normal text-center overflow-visible align-middle cursor-pointer">
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderStatisticsGrid = () => {
    // Use statisticData if valid, otherwise fall back to statisticLast30ResultData
    const dataToUse = isStatisticDataValid && statisticData?.data
      ? statisticData.data
      : statisticLast30ResultData?.data;

    if (!dataToUse || dataToUse.length === 0) {
      return (
        <li className="float-left w-full flex justify-center items-center mt-[13px]">
          <span>Không có dữ liệu</span>
        </li>
      );
    }

    return dataToUse.map((item: any, index: number) => (
      <li key={index} className="float-left w-1/2 flex justify-center items-center mt-[13px]">
        {item.result.split(',').map((dice: string, diceIndex: number) => (
          <img
            key={diceIndex}
            src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_dice${dice}.svg`}
            className="w-[30px] mr-[8px]"
            alt={`${dice} dice`}
          />
        ))}
        <span className="block w-[60px] h-[29px] leading-[29px] text-center bg-white border border-[#CCCCCC] box-border text-base">
          {item.count}
        </span>
      </li>
    ));
  };

  const renderKeoDoi = () => {
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

    const taixiuData = statisticDoubleBetData?.data?.taixiu || [];
    const chanleData = statisticDoubleBetData?.data?.chanle || [];

    // Process taixiu data into road format
    const processRoadData = (data: any[]) => {
      const roadData: any[][] = Array.from({ length: 6 }, () => Array(15).fill(null));
      let colIndex = 0;
      let rowIndex = 0;

      data.forEach((column: any[]) => {
        if (colIndex >= 15) return; // Limit to 15 columns

        column.forEach((item: any, itemIndex: number) => {
          if (rowIndex + itemIndex >= 6) return; // Limit to 6 rows

          let text = '';
          let color = '';

          // For taixiu data
          if (item.taixiu) {
            switch (item.taixiu) {
              case 'T':
                text = 'T';
                color = 'red';
                break;
              case 'X':
                text = 'X';
                color = 'blue';
                break;
              case '-':
                text = 'H';
                color = 'green';
                break;
            }
          }

          // For chanle data
          if (item.chanle) {
            switch (item.chanle) {
              case 'L':
                text = 'L';
                color = 'red';
                break;
              case 'C':
                text = 'C';
                color = 'blue';
                break;
              case '-':
                text = '-';
                color = 'green';
                break;
            }
          }

          if (text) {
            roadData[rowIndex + itemIndex][colIndex] = {
              text,
              color,
              dataGid: item.draw_no
            };
          }
        });

        colIndex++;
        rowIndex = 0;
      });

      return roadData;
    };

    const roadData1 = processRoadData(taixiuData);
    const roadData2 = processRoadData(chanleData);

    // Calculate statistics
    const calculateStats = (data: any[], field: string) => {
      const stats: { [key: string]: number } = {};
      data.forEach((column: any[]) => {
        column.forEach((item: any) => {
          const value = item[field];
          if (value && value !== '-') {
            stats[value] = (stats[value] || 0) + 1;
          }
        });
      });
      return stats;
    };

    const taixiuStats = calculateStats(taixiuData, 'taixiu');
    const chanleStats = calculateStats(chanleData, 'chanle');

    const getColorClass = (color: string) => {
      switch (color) {
        case 'red': return 'text-[#fe0103]';
        case 'blue': return 'text-[#0201ff]';
        case 'green': return 'text-[#017f02]';
        default: return 'text-black';
      }
    };

    return (
      <div id="divRank" className="">
        <div
          className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto block"
          id="pk10RankR"
          style={{
            display: 'block',
            width: "calc(100% - 10px)",
            maxWidth: "490px"
          }}
        >
          <table cellPadding="0" cellSpacing="0" className="border-t border-t-[#ccc] border-l border-l-[#ccc] w-[99%] float-left mx-auto mt-[2px] ml-[2px] table-fixed text-center hidden"></table>
          <div className="float-left w-full h-full flex flex-col justify-between">
            <div className="grid grid-cols-2">
              <table
                cellPadding="0"
                cellSpacing="0"
                id="rankRoad_1"
                className="border-t border-t-[#ccc] border-l border-l-[#ccc] h-[88px] table-fixed float-left mx-auto text-center w-full"
              >
                <tbody>
                  {roadData1.map((row, rowIndex) => (
                    <tr key={`row1-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell1-${rowIndex}-${cellIndex}`} className="relative border-r border-r-[#ccc] border-b border-b-[#ccc] w-[12px] h-[20px] text-xs bg-white cursor-pointer hover:bg-[rgb(255,201,56)]">
                          {cell && (
                            <span
                              className={`block absolute -top-px -bottom-0 -left-px -right-0 transform scale-80 ${getColorClass(cell.color)} cursor-pointer`}
                              data-gid={cell.dataGid}
                            >
                              {cell.text}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <table
                cellPadding="0"
                cellSpacing="0"
                id="rankRoad_2"
                className="border-t border-t-[#ccc] border-l border-l-[#ccc] h-[88px] table-fixed float-left mx-auto text-center w-full"
              >
                <tbody>
                  {roadData2.map((row, rowIndex) => (
                    <tr key={`row2-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell2-${rowIndex}-${cellIndex}`} className="relative border-r border-r-[#ccc] border-b border-b-[#ccc] w-[12px] h-[20px] text-xs bg-white cursor-pointer hover:bg-[rgb(255,201,56)]">
                          {cell && (
                            <span
                              className={`block absolute -top-px -bottom-0 -left-px -right-0 transform scale-80 ${getColorClass(cell.color)} cursor-pointer`}
                              data-gid={cell.dataGid}
                            >
                              {cell.text}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full bg-[#f0f0f0] h-[25px] border border-[#cbcbcb] border-t-0 float-left">
              <div className="w-1/4 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#fe0103]">T</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_0_0">{taixiuStats.T || 0}</span>
              </div>
              <div className="w-1/4 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#0201ff]">X</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_0_1">{taixiuStats.X || 0}</span>
              </div>
              <div className="w-1/4 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#fe0103]">L</span>
                <span className="text-center w-1/2 block float-left text-base border-r border-r-[#cbcbcb] box-border" id="spnCount_1_0">{chanleStats.L || 0}</span>
              </div>
              <div className="w-1/4 float-left">
                <span className="text-center w-1/2 block float-left text-base text-[#0201ff]">C</span>
                <span className="text-center w-1/2 block float-left text-base" id="spnCount_1_1">{chanleStats.C || 0}</span>
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
                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Xóc Đĩa KU - Điểm số</span>
              </div>
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-right">
                <a
                  className={`block min-w-[100px] max-w-[125px] h-[27px] mt-[5px] mr-[5px] border-t-[3px] border-r-0 border-b-0 border-l-0 text-sm font-bold text-center leading-[27px] overflow-visible float-left cursor-pointer px-2 ${activeTab === 'points'
                    ? 'border-t-[#4984c0] bg-white text-[#4984c0]'
                    : 'border-t-transparent bg-[#cccccc] text-black'
                    }`}
                  onClick={() => onTabChange('points')}
                >
                  Điểm số
                </a>
                <a
                  className={`block min-w-[100px] max-w-[125px] h-[30px] mt-[5px] mr-[2px] border-0 text-sm font-bold text-center leading-[31px] overflow-visible float-left cursor-pointer px-2 ${activeTab === 'keo-doi'
                    ? 'bg-white text-[#4984c0] border-t-[3px] border-t-[#4984c0] h-[27px]'
                    : 'bg-[#cccccc] text-black'
                    }`}
                  onClick={() => onTabChange('keo-doi')}
                >
                  Thống kê
                </a>
              </div>
            </th>
            <th align="left" className="w-1/2 min-w-[500px] h-[35px] pl-[10px] border-0 text-[#336aab] text-sm font-bold leading-[35px] overflow-visible align-middle border-separate">
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-left">
                <span className="text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible">Xóc Đĩa KU - Kèo Đôi</span>
              </div>
              <div className="h-[35px] border-0 text-[#336aab] text-sm font-bold text-left leading-[35px] overflow-visible float-right">
                <a className="block min-w-[100px] max-w-[120px] h-[27px] mt-[5px] border-t-[3px] border-t-[#4984c0] border-r-0 border-b-0 border-l-0 bg-white text-[#4984c0] text-sm font-bold text-center leading-[27px] overflow-visible float-left cursor-pointer px-2">
                  Kèo Đôi
                </a>
              </div>
            </th>
          </tr>
          <tr className="w-full h-[150px] border-0 text-black text-base font-normal text-start overflow-visible align-middle border-separate">
            <td valign="top" className="h-[150px] min-w-[500px] border-t-0 border-r-[2px] border-r-[#f3f3f3] border-b-0 border-l-0 bg-white text-black text-base font-normal text-start overflow-visible align-top border-separate">
              {activeTab === 'points' ? (
                renderScoreTable()
              ) : (
                <div className="bg-[#f0f0f0] h-[140px] my-[5px] mx-auto" style={{ width: "calc(100% - 10px)", maxWidth: "490px", minWidth: "490px" }} id="Game_sicBoRW02">
                  <ul className="sicBoRWbox">
                    {renderStatisticsGrid()}
                  </ul>
                </div>
              )}
            </td>
            <td valign="top" className="bg-white min-w-[500px] border-r-[2px] border-r-[#f3f3f3] border-solid">
              {renderKeoDoi()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsSection; 