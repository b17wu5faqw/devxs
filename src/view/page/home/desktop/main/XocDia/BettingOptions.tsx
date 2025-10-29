import React from "react";
import { SicboBetType } from "@/hooks/useSicbo";
import { renderDiceImages } from "./DiceRenderer";

// CSS cho hiệu ứng nhấp nháy chỉ cho winning options
const blinkingStyles = `
  @keyframes winning-option-blink {
    0%, 50% {
      background: linear-gradient(to bottom, #FFD700, #FFA500) !important;
      border-color: #FF6B35 !important;
      color: #8B4513 !important;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
      transform: scale(1.05);
    }
    51%, 100% {
      background: linear-gradient(to bottom, #FF4500, #DC143C) !important;
      border-color: #B22222 !important;
      color: white !important;
      box-shadow: 0 0 15px rgba(255, 69, 0, 0.9);
      transform: scale(1.05);
    }
  }
  .winning-option-blink {
    animation: winning-option-blink 0.6s infinite;
  }
`;

interface BettingOptionsProps {
  betTypesData: any;
  selectedChoices: string[];
  onOptionSelect: (optionId: string) => void;
  winningCodes?: string[];
  isBlinking?: boolean;
}

// Helper function to format prize rate by removing trailing zeros
const formatPrizeRate = (prizeRate: string | number): string => {
  if (!prizeRate) return "0";
  const num = typeof prizeRate === "string" ? parseFloat(prizeRate) : prizeRate;
  return num.toString();
};

const BettingOptions: React.FC<BettingOptionsProps> = ({
  betTypesData,
  selectedChoices,
  onOptionSelect,
  winningCodes = [],
  isBlinking = false
}) => {
  return (
    <>
      <style>{blinkingStyles}</style>
    <div
      className="block relative border border-[#c4c4c4] bg-[#efefef] text-[#106eb6] text-[13px] font-normal text-left"
      style={{
        width: "100%",
        height: "232px",
        minWidth: "780px"
      }}
    >
      {/* Left column - White dice combinations */}
      <ul className="block static w-[187px] min-w-[187px] h-[225px] ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left float-left">
        {betTypesData?.data?.filter((item: SicboBetType) => ["ODDS_04", "ODDS_13", "ODDS_22"].includes(item.code)).map((option: SicboBetType) => {
          const isWinning = winningCodes.includes(option.code);
          const shouldBlink = isBlinking && isWinning;

          return (
          <li
            key={option.id}
            id={`aK35_${option.code.split('_')[1]}`}
            className={`flex relative h-[70px] mt-[5px] border rounded-[5px] text-[13px] font-normal text-left cursor-pointer flex-wrap justify-center group hover:from-[#FFCDCF] hover:to-[#FFCDCF] hover:border-[#EB132D] hover:text-[#EB132D] ${
              shouldBlink
                ? 'winning-option-blink'
                : selectedChoices.includes(option.code)
                  ? 'border-[#EB132D] bg-gradient-to-b from-[#FFCDCF] to-[#FFCDCF] text-[#EB132D]'
                  : 'border-[#ccc] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6]'
              }`}
            onClick={() => onOptionSelect(option.code)}
          >
            {renderDiceImages(option.code)}
            <span className="block relative w-[185px] h-[24.5px] border-0 bg-transparent text-red-500 text-[17px] font-bold text-center cursor-pointer float-right">
              {formatPrizeRate(option.prize_rate)}
            </span>
          </li>
          );
        })}
      </ul>

      {/* Center column - Big/Small/Odd/Even options */}
      <ul
        className="flex static h-[226px] ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left float-left flex-row flex-wrap justify-around"
        style={{
          width: "calc(100% - 400px)",
          minWidth: "383px"
        }}
      >
        {betTypesData?.data?.filter((item: SicboBetType) => ["BIG", "SMALL", "ODD", "EVEN"].includes(item.code)).map((option: SicboBetType) => {
          const isWinning = winningCodes.includes(option.code);
          const shouldBlink = isBlinking && isWinning;

          return (
          <li
            key={option.id}
            id={`aK36_${option.id}`}
            className={`flex relative w-[187px] min-w-[187px] h-[108px] mt-[5px] border rounded-[5px] text-[13px] font-normal text-left cursor-pointer float-left flex-row flex-nowrap justify-around items-center group hover:from-[#FFCDCF] hover:to-[#FFCDCF] hover:border-[#EB132D] hover:text-[#EB132D] ${
              shouldBlink
                ? 'winning-option-blink'
                : selectedChoices.includes(option.code)
                  ? 'border-[#EB132D] bg-gradient-to-b from-[#FFCDCF] to-[#FFCDCF] text-[#EB132D]'
                  : 'border-[#ccc] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6]'
              }`}
            onClick={() => onOptionSelect(option.code)}
          >
            <span className={`block relative ${option.name === "Tài" ? 'w-[43.3594px]' : option.name === "Xỉu" ? 'w-[46.6719px]' : option.name === "Lẻ" ? 'w-[35.0156px]' : 'w-[75px]'} h-[34px] ml-[15px] border-0 bg-transparent text-[30px] font-bold text-left cursor-pointer group-hover:text-[#EB132D] ${selectedChoices.includes(option.code) ? 'text-[#EB132D]' : 'text-[#106eb6]'
              }`}>
              {option.name}
            </span>
            <span className="block relative w-[57.5625px] h-[27px] mr-[20px] ml-[20px] border-0 bg-transparent text-red-500 text-[23px] font-bold text-left cursor-pointer float-right">
              {formatPrizeRate(option.prize_rate)}
            </span>
          </li>
          );
        })}
      </ul>

      {/* Right column - Red dice combinations */}
      <ul className="block static w-[187px] min-w-[187px] h-[225px] ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left float-left">
        {betTypesData?.data?.filter((item: SicboBetType) => ["ODDS_40", "ODDS_31", "ODDS_44"].includes(item.code)).map((option: SicboBetType) => {
          const isWinning = winningCodes.includes(option.code);
          const shouldBlink = isBlinking && isWinning;

          return (
          <li
            key={option.id}
            id={`aK35_${option.code.split('_')[1]}`}
            className={`flex relative w-[187px] h-[70px] mt-[5px] border rounded-[5px] text-[13px] font-normal text-left cursor-pointer flex-wrap justify-center group hover:from-[#FFCDCF] hover:to-[#FFCDCF] hover:border-[#EB132D] hover:text-[#EB132D] ${
              shouldBlink
                ? 'winning-option-blink'
                : selectedChoices.includes(option.code)
                  ? 'border-[#EB132D] bg-gradient-to-b from-[#FFCDCF] to-[#FFCDCF] text-[#EB132D]'
                  : 'border-[#ccc] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6]'
              }`}
            onClick={() => onOptionSelect(option.code)}
          >
            {renderDiceImages(option.code)}
            <span className="block relative w-[185px] h-[24.5px] border-0 bg-transparent text-red-500 text-[17px] font-bold text-center cursor-pointer float-right">
              {formatPrizeRate(option.prize_rate)}
            </span>
          </li>
          );
        })}
      </ul>
    </div>
    </>
  );
};

export default BettingOptions; 