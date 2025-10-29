import React from "react";
import { SicboLastDraw } from "@/hooks/useSicbo";
import { renderDrawResult } from "./DiceRenderer";

interface ResultsSectionProps {
  recentDraws: SicboLastDraw[];
}

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
            {recentDraws.map((draw: SicboLastDraw, index: number) => (
              <tr
                key={draw.id || index}
                className={`w-[200px] border-0 ${index % 2 === 0 ? 'bg-[#f3f3f3]' : 'bg-white'} flex items-center`}
              >
                <td className="w-[50px] h-[36.5px] flex items-center justify-center border-r border-r-white">
                  {draw.draw_no || `178${index}`}
                </td>
                <td className="w-[149px] h-[36.5px] flex items-center justify-center gap-[5px]">
                  {draw.result && typeof draw.result === 'string' && draw.result.includes(',') ?
                    draw.result.split(',').map((dice, diceIndex) => (
                      <img
                        key={diceIndex}
                        src={`https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/img_dice${dice}.svg`}
                        className="w-[29.7969px] h-[29.0312px]"
                        alt={`Dice ${dice}`}
                      />
                    ))
                    : renderDrawResult(draw.result)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsSection; 