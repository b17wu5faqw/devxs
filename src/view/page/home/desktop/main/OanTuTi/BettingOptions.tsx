import React from "react";

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

// Define option type interface
interface OptionType {
  code: string;
  rate: string;
  name: string;
}

interface BettingOptionsProps {
  betTypesData: any;
  selectedChoices: string[];
  onOptionSelect: (optionId: string) => void;
  winningCodes?: string[];
  isBlinking?: boolean;
  onLogEvent?: (eventType: string, data: any) => void;
}

// Helper function để format prize rate
const formatPrizeRate = (prizeRate: string | number): string => {
  if (!prizeRate) return "0";
  const num = typeof prizeRate === "string" ? parseFloat(prizeRate) : prizeRate;
  return num.toString();
};

// Helper function để render icon
const renderIcon = (code: string, size: number) => {
  const iconMap = {
    STONE: "/images/oantuti/icon_stone.svg",
    ROCK: "/images/oantuti/icon_stone.svg",
    SCISSORS: "/images/oantuti/icon_scissors.svg",
    PAPER: "/images/oantuti/icon_paper.svg",
    BUA: "/images/oantuti/icon_stone.svg",
    KEO: "/images/oantuti/icon_scissors.svg",
    BAO: "/images/oantuti/icon_paper.svg",
  };

  const iconSrc = iconMap[code as keyof typeof iconMap];
  if (!iconSrc) return null;

  return <img src={iconSrc} alt={code} width={size} height={size} />;
};

// Helper function để get icon từ bet code
const getIconFromBetCode = (code: string): string => {
  if (code.includes("BUA")) return "BUA";
  if (code.includes("KEO")) return "KEO";
  if (code.includes("BAO")) return "BAO";
  return "BUA";
};

// Component cho button betting
interface BettingButtonProps {
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  isWinning?: boolean;
  isBlinking?: boolean;
  onLogEvent?: (eventType: string, data: any) => void;
}

const BettingButton: React.FC<BettingButtonProps> = ({
  isSelected,
  onClick,
  className = "",
  children,
  isWinning = false,
  isBlinking = false,
  onLogEvent,
}) => {
  // Debug logging cho BettingButton
  React.useEffect(() => {
    if (isWinning || isBlinking) {
      onLogEvent?.("betting_button_blinking_debug", {
        is_winning: isWinning,
        is_blinking: isBlinking,
        should_blink: isWinning && isBlinking,
        timestamp: Date.now(),
      });
    }
  }, [isWinning, isBlinking, onLogEvent, children]);

  const baseClasses =
    "border rounded-[5px] cursor-pointer group hover:from-[#FFCDCF] hover:to-[#FFCDCF] hover:border-[#EB132D] hover:text-[#EB132D]";
  const selectedClasses = isSelected
    ? "border-[#EB132D] bg-gradient-to-b from-[#FFCDCF] to-[#FFCDCF] text-[#EB132D]"
    : "border-[#ccc] bg-gradient-to-b from-white to-[#f3f3f3] text-[#106eb6]";

  // Thêm class nhấp nháy nếu là winning option và đang trong thời gian blink
  const blinkingClass = isWinning && isBlinking ? "winning-option-blink" : "";

  // Debug log cho blinking class
  if (isWinning && isBlinking) {
    onLogEvent?.("betting_button_applying_blinking_class", {
      blinking_class: blinkingClass,
      is_winning: isWinning,
      is_blinking: isBlinking,
      timestamp: Date.now(),
    });
  }

  return (
    <div
      className={`${baseClasses} ${selectedClasses} ${blinkingClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Component cho left side buttons (2 icons + prize rate)
interface LeftSideButtonProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (code: string) => void;
  isWinning?: boolean;
  isBlinking?: boolean;
  onLogEvent?: (eventType: string, data: any) => void;
}

const LeftSideButton: React.FC<LeftSideButtonProps> = ({
  option,
  isSelected,
  onSelect,
  isWinning = false,
  isBlinking = false,
  onLogEvent,
}) => {
  // Parse the code to get two icons
  const getIconsFromCode = (code: string) => {
    const icons = [];

    if (code.includes("CAI_BUA_CON_KEO")) {
      icons.push("BUA", "KEO");
    } else if (code.includes("CAI_BUA_CON_BUA")) {
      icons.push("BUA", "BUA");
    } else if (code.includes("CAI_BUA_CON_BAO")) {
      icons.push("BUA", "BAO");
    } else if (code.includes("CAI_KEO_CON_KEO")) {
      icons.push("KEO", "KEO");
    } else if (code.includes("CAI_KEO_CON_BAO")) {
      icons.push("KEO", "BAO");
    } else if (code.includes("CAI_BAO_CON_BAO")) {
      icons.push("BAO", "BAO");
    } else {
      icons.push("BUA", "KEO");
    }

    return icons;
  };

  const icons = getIconsFromCode(option.code);

  return (
    <BettingButton
      isSelected={isSelected}
      onClick={() => onSelect(option.code)}
      className="flex w-[135px] h-[60px] gap-3 items-center justify-center"
      isWinning={isWinning}
      isBlinking={isBlinking}
      onLogEvent={onLogEvent}
    >
      <div className="flex items-center justify-center mb-1 gap-1">
        {renderIcon(icons[0], 24)}
        {renderIcon(icons[1], 24)}
      </div>
      <span className="text-red-500 text-[15px] font-bold">
        {formatPrizeRate(option.rate)}
      </span>
    </BettingButton>
  );
};

// Component cho top row buttons (tên + prize rate)
interface TopRowButtonProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (code: string) => void;
  isWinning?: boolean;
  isBlinking?: boolean;
  onLogEvent?: (eventType: string, data: any) => void;
}

const TopRowButton: React.FC<TopRowButtonProps> = ({
  option,
  isSelected,
  onSelect,
  isWinning = false,
  isBlinking = false,
  onLogEvent,
}) => {
  const getBgColor = (code: string) => {
    if (code.includes("CAI")) return "#EB132D";
    if (code.includes("HOA")) return "#4CAF50";
    if (code.includes("CON")) return "#2196F3";
    return "#EB132D";
  };

  const getDisplayName = (name: string) => {
    if (name.includes("Cái")) return "Cái";
    if (name.includes("Hòa")) return "Hòa";
    if (name.includes("Con")) return "Con";
    return name.charAt(0);
  };

  return (
    <BettingButton
      isSelected={isSelected}
      onClick={() => onSelect(option.code)}
      className="flex-1 h-[70px] flex-col items-center justify-center"
      isWinning={isWinning}
      isBlinking={isBlinking}
      onLogEvent={onLogEvent}
    >
      <div className="flex gap-5 items-center justify-center h-full">
        <div
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center mb-1"
          style={{ backgroundColor: getBgColor(option.code) }}
        >
          <span className="text-white text-[16px] font-bold">
            {getDisplayName(option.name)}
          </span>
        </div>
        <span className="text-red-500 text-[18px] font-bold">
          {formatPrizeRate(option.rate)}
        </span>
      </div>
    </BettingButton>
  );
};

// Component cho bottom buttons (1 icon + prize rate)
interface BottomButtonProps {
  option: OptionType;
  isSelected: boolean;
  onSelect: (code: string) => void;
  isWinning?: boolean;
  isBlinking?: boolean;
  onLogEvent?: (eventType: string, data: any) => void;
}

const BottomButton: React.FC<BottomButtonProps> = ({
  option,
  isSelected,
  onSelect,
  isWinning = false,
  isBlinking = false,
  onLogEvent,
}) => {
  const icon = getIconFromBetCode(option.code);

  return (
    <BettingButton
      isSelected={isSelected}
      onClick={() => onSelect(option.code)}
      className="flex-1 h-[70px] flex flex-col items-center justify-center"
      isWinning={isWinning}
      isBlinking={isBlinking}
      onLogEvent={onLogEvent}
    >
      <div className="flex items-center justify-center mb-1 rounded-full border border-red-500 p-1">
        {renderIcon(icon, 24)}
      </div>
      <span className="text-red-500 text-[15px] font-bold">
        {formatPrizeRate(option.rate)}
      </span>
    </BettingButton>
  );
};

// Component cho rules section
const RulesSection: React.FC = () => (
  <div className="flex gap-2 h-[40px] items-center">
    {["Nhà Cái", "Nhà Con"].map((title) => (
      <div key={title} className="flex-1 flex">
        <span className="text-black text-xs font-bold mr-2">{title}</span>
        <span className="w-[20px] h-[20px] bg-yellow-400 rounded-full flex items-center justify-center text-white text-[12px] font-bold">
          ⚠
        </span>
        <span className="text-black text-[12px] underline ml-2 cursor-pointer">
          Giải thích
        </span>
      </div>
    ))}
  </div>
);

const BettingOptions: React.FC<BettingOptionsProps> = ({
  betTypesData,
  selectedChoices,
  onOptionSelect,
  winningCodes = [],
  isBlinking = false,
  onLogEvent,
}) => {
  // Debug logging cho isBlinking prop
  React.useEffect(() => {
    onLogEvent?.("betting_options_blinking_debug", {
      is_blinking: isBlinking,
      winning_codes: winningCodes,
      timestamp: Date.now(),
    });
  }, [isBlinking, winningCodes, onLogEvent]);

  // Inject CSS styles vào DOM
  React.useEffect(() => {
    const styleId = "betting-options-blinking-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = blinkingStyles;
      document.head.appendChild(style);
      onLogEvent?.("betting_options_css_injected", {
        style_id: styleId,
        timestamp: Date.now(),
      });
    }
  }, [onLogEvent]);
  // Process API data to get options
  const getLeftSideOptions = (): OptionType[] => {
    if (!betTypesData?.data?.["1"]?.options) {
      return [
        { code: "CAI_BUA_CON_KEO", rate: "4.36", name: "Cái búa - Con kéo" },
        { code: "CAI_BUA_CON_BUA", rate: "8.71", name: "Cái búa - Con búa" },
        { code: "CAI_BUA_CON_BAO", rate: "4.36", name: "Cái búa - Con bao" },
        { code: "CAI_KEO_CON_KEO", rate: "8.71", name: "Cái kéo - Con kéo" },
        { code: "CAI_KEO_CON_BAO", rate: "4.36", name: "Cái kéo - Con bao" },
        { code: "CAI_BAO_CON_BAO", rate: "8.71", name: "Cái bao - Con bao" },
      ];
    }

    return betTypesData.data["1"].options.slice(0, 6);
  };

  const getTopRowOptions = (): OptionType[] => {
    if (!betTypesData?.data?.["2"]?.options) {
      return [
        { code: "CAI_WIN", rate: "2.95", name: "Cái" },
        { code: "HOA", rate: "2.95", name: "Hòa" },
        { code: "CON_WIN", rate: "2.95", name: "Con" },
      ];
    }

    return betTypesData.data["2"].options;
  };

  const getBottomLeftOptions = (): OptionType[] => {
    if (!betTypesData?.data?.["3"]?.dealer) {
      return [
        { code: "CAI_BUA", rate: "2.95", name: "Cái búa" },
        { code: "CAI_KEO", rate: "2.95", name: "Cái kéo" },
        { code: "CAI_BAO", rate: "2.95", name: "Cái bao" },
      ];
    }

    return betTypesData.data["3"].dealer;
  };

  const getBottomRightOptions = (): OptionType[] => {
    if (!betTypesData?.data?.["4"]?.player) {
      return [
        { code: "CON_BUA", rate: "2.95", name: "Con búa" },
        { code: "CON_KEO", rate: "2.95", name: "Con kéo" },
        { code: "CON_BAO", rate: "2.95", name: "Con bao" },
      ];
    }

    return betTypesData.data["4"].player;
  };

  const leftSideOptions = getLeftSideOptions();
  const topRowOptions = getTopRowOptions();
  const bottomLeftOptions = getBottomLeftOptions();
  const bottomRightOptions = getBottomRightOptions();

  return (
    <>
      <style>{blinkingStyles}</style>
      <div
        className="flex relative border border-[#c4c4c4] bg-white text-[#106eb6] text-[13px] font-normal"
        style={{
          width: "100%",
          height: "232px",
          minWidth: "780px",
        }}
      >
        {/* Bên trái - 6 buttons trong 3 hàng x 2 cột */}
        <div className="bg-[#efefef] border border-[#c4c4c4] rounded-[5px] m-2">
          <div className="flex flex-col w-[280px] min-w-[280px] p-2 gap-2">
            {[0, 1, 2].map((rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {leftSideOptions
                  .slice(rowIndex * 2, rowIndex * 2 + 2)
                  .map((option: OptionType) => (
                    <LeftSideButton
                      key={option.code}
                      option={option}
                      isSelected={selectedChoices.includes(option.code)}
                      onSelect={onOptionSelect}
                      isWinning={winningCodes.includes(option.code)}
                      isBlinking={isBlinking}
                      onLogEvent={(eventType, data) => {
                        onLogEvent?.(eventType, data);
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bên phải - 3 hàng */}
        <div className="flex flex-col p-2 h-full flex-1 justify-between">
          {/* Hàng 1 - 3 buttons chính phía trên */}
          <div className="flex gap-2 bg-[#efefef] p-2 rounded-[5px] border border-[#c4c4c4]">
            {topRowOptions.map((option: OptionType) => (
              <TopRowButton
                key={option.code}
                option={option}
                isSelected={selectedChoices.includes(option.code)}
                onSelect={onOptionSelect}
                isWinning={winningCodes.includes(option.code)}
                isBlinking={isBlinking}
                onLogEvent={(eventType, data) => {
                  onLogEvent?.(eventType, data);
                }}
              />
            ))}
          </div>

          {/* Hàng 2 - Phần quy tắc */}
          <RulesSection />

          {/* Hàng 3 - Hàng cuối với 2 bên */}
          <div className="flex gap-2">
            {/* Bên trái - 3 buttons */}
            <div className="flex-1 flex gap-2 bg-[#efefef] p-2 rounded-[5px] border border-[#c4c4c4]">
              {bottomLeftOptions.map((option: OptionType) => (
                <BottomButton
                  key={option.code}
                  option={option}
                  isSelected={selectedChoices.includes(option.code)}
                  onSelect={onOptionSelect}
                  isWinning={winningCodes.includes(option.code)}
                  isBlinking={isBlinking}
                  onLogEvent={onLogEvent}
                />
              ))}
            </div>

            {/* Bên phải - 3 buttons */}
            <div className="flex-1 flex gap-2 bg-[#efefef] p-2 rounded-[5px] border border-[#c4c4c4]">
              {bottomRightOptions.map((option: OptionType) => (
                <BottomButton
                  key={option.code}
                  option={option}
                  isSelected={selectedChoices.includes(option.code)}
                  onSelect={onOptionSelect}
                  isWinning={winningCodes.includes(option.code)}
                  isBlinking={isBlinking}
                  onLogEvent={onLogEvent}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BettingOptions;
