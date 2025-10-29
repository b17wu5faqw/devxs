import { RpsLastDraw } from "@/hooks/useRps";
import React from "react";

interface ResultsSectionProps {
  recentDraws: RpsLastDraw[];
}

// Hàm helper để render icon
const renderIcon = (code: string, size: number) => {
  const iconMap = {
    'STONE': '/images/oantuti/icon_stone.svg',
    'ROCK': '/images/oantuti/icon_stone.svg',
    'SCISSORS': '/images/oantuti/icon_scissors.svg',
    'PAPER': '/images/oantuti/icon_paper.svg',
    'BUA': '/images/oantuti/icon_stone.svg',
    'KEO': '/images/oantuti/icon_scissors.svg',
    'BAO': '/images/oantuti/icon_paper.svg'
  };

  const iconSrc = iconMap[code as keyof typeof iconMap];
  if (!iconSrc) return null;

  return <img src={iconSrc} alt={code} width={size} height={size} />;
};

// Hàm helper để lấy màu nền theo người thắng
const getWinnerColor = (winner: string): string => {
  switch (winner) {
    case 'CAI':
      return 'bg-red-50';
    case 'CON':
      return 'bg-blue-50';
    case 'TIE':
    case 'HOA':
      return 'bg-green-50';
    default:
      return 'bg-gray-50';
  }
};

// Hàm helper để lấy màu cho winner button (tham khảo TopRowButton)
const getWinnerButtonColor = (winner: string): string => {
  switch (winner) {
    case 'CAI':
      return '#EB132D';
    case 'CON':
      return '#2196F3';
    case 'TIE':
    case 'HOA':
      return '#4CAF50';
    default:
      return '#666';
  }
};

// Hàm helper để lấy text hiển thị
const getWinnerDisplayText = (winner: string): string => {
  switch (winner) {
    case 'CAI':
      return 'Cái';
    case 'CON':
      return 'Con';
    case 'TIE':
    case 'HOA':
      return 'Hòa';
    default:
      return winner;
  }
};

const ResultsSection: React.FC<ResultsSectionProps> = ({ recentDraws }) => {
  return (
    <div className="block static w-[202px] min-w-[202px] border-0 bg-[#f3f3f3] text-black font-[Arial,微軟正黑體] text-base font-normal text-center opacity-100 overflow-visible float-left">
      <div className="block static w-[202px] h-[35px] border-0 bg-[#4984bf] text-white font-[Arial,微軟正黑體] text-sm font-normal leading-[35px] text-center opacity-100 overflow-visible">
        <span className="inline static border-0 bg-transparent text-white font-[Arial,微軟正黑體] text-sm font-normal leading-[35px] text-center opacity-100 overflow-visible">
          Kết quả
        </span>
      </div>
      <div className="block static w-[202px] border-0 bg-white text-black font-[Arial,微軟正黑體] text-base font-normal text-center opacity-100 overflow-hidden">
        <table
          id="tbRecentResult"
          cellPadding="0"
          cellSpacing="1"
          className="table static w-[202px] h-[263.5px] my-[1px] mx-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-visible border-separate border-spacing-[1px]"
        >
          <tbody className="table-row-group static w-[200px] border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-visible align-middle border-separate border-spacing-[1px]">
            {recentDraws.map((draw: RpsLastDraw, index: number) => {
              return (
                <tr
                  key={draw.id || index}
                  className={`w-[200px] border-0 ${getWinnerColor(draw.winner)} flex items-center`}
                >
                  <td className="w-[50px] h-[36.5px] flex items-center justify-center border-r border-r-white text-xs">
                    #{draw.draw_no}
                  </td>
                  <td className="w-[100px] h-[36.5px] flex items-center justify-center gap-[5px]">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-red-600 font-bold">Cái</div>
                      {renderIcon(draw.dealer, 20)}
                    </div>
                    <div className="text-xs">VS</div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-blue-600 font-bold">Con</div>
                      {renderIcon(draw.player, 20)}
                    </div>
                  </td>
                  <td className="w-[49px] h-[36.5px] flex items-center justify-center">
                    {/* Winner button tham khảo TopRowButton */}
                    <div
                      className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getWinnerButtonColor(draw.winner) }}
                    >
                      <span className="text-white text-[12px] font-bold">
                        {getWinnerDisplayText(draw.winner)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsSection; 