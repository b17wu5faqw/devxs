
const diceImgPath = "https://cuvncf.qiabbkj.com/images/graph/sicBoRWElec/";

export const renderDiceImages = (optionCode: string) => {
  const images: JSX.Element[] = [];

  const createDice = (type: 'W' | 'R', count: number, keyPrefix: string) => {
    for (let i = 0; i < count; i++) {
      images.push(
        <img
          key={`${keyPrefix}-${i}`}
          src={`${diceImgPath}img_dice${type}.svg`}
          className="block relative w-[34px] h-[33px] mt-[6px] mr-[2px] ml-[2px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer"
          alt={`dice ${type}`}
        />
      );
    }
  };

  switch (optionCode) {
    case "ODDS_04":
      createDice('W', 4, '04');
      break;
    case "ODDS_13":
      createDice('W', 3, '13W');
      createDice('R', 1, '13R');
      break;
    case "ODDS_22":
      createDice('W', 2, '22W');
      createDice('R', 2, '22R');
      break;
    case "ODDS_40":
      createDice('R', 4, '40');
      break;
    case "ODDS_31":
      createDice('R', 3, '31R');
      createDice('W', 1, '31W');
      break;
    case "ODDS_44":
      images.push(
        <img key="44R1" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
        <img key="44R2" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
        <img key="44R3" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
        <img key="44R4" src={`${diceImgPath}img_diceR.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[5px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="red dice" />,
        <img key="44W1" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />,
        <img key="44W2" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />,
        <img key="44W3" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />,
        <img key="44W4" src={`${diceImgPath}img_diceW.svg`} className="block relative w-5 h-[19px] mt-3 mr-[1px] mb-2 ml-[1px] border-0 bg-transparent text-[#106eb6] text-[13px] font-normal text-left overflow-clip cursor-pointer" alt="white dice" />
      );
      break;
    default:
      break;
  }
  return images;
};

export function renderDrawResult(result: any, size: number = 30) {
  if (!result) return null;

  try {
    if (typeof result === 'string' && result.includes(',')) {
      const diceResults = result.split(',');
      return diceResults.map((dice, index) => (
        <img
          key={index}
          src={`${diceImgPath}img_dice${dice}.svg`}
          className="inline static mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
          alt={`Dice ${dice}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      ));
    }

    if (result.result && typeof result.result === 'string' && result.result.includes(',')) {
      const diceResults = result.result.split(',');
      return diceResults.map((dice: string, index: number) => (
        <img
          key={index}
          src={`${diceImgPath}img_dice${dice}.svg`}
          className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
          alt={`Dice ${dice}`}
        />
      ));
    }

    const resultData = result.result ? result.result : result;
    const diceResults = Array.isArray(resultData) ? resultData :
      typeof resultData === 'string' ?
        resultData.split('').map(r => parseInt(r)) :
        [1, 1, 1, 1]; // Fallback

    return diceResults.map((dice, index) => (
      <img
        key={index}
        src={`${diceImgPath}img_dice${dice === 1 ? 'R' : 'W'}.svg`}
        className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
        alt="dice icon"
      />
    ));
  } catch (error) {
    return [0, 0, 0, 0].map((_, index) => (
      <img
        key={index}
        src={`${diceImgPath}img_diceW.svg`}
        className="inline static w-[29.7969px] h-[29.0312px] mt-[3px] mr-[5px] mb-0 ml-0 border-0 bg-transparent text-black font-[Arial,微軟正黑體] text-sm font-normal text-center opacity-100 overflow-clip align-baseline border-separate border-spacing-[1px]"
        alt="dice icon"
      />
    ));
  }
} 