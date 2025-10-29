import React, { useMemo, useState } from "react";
import { useStatisticResult } from "@/hooks/useRps";

type ActiveTab = "result" | "banker" | "player";
type ResultColor = "blue" | "green" | "red" | null;
type MoveIcon = "scissors" | "stone" | "paper" | null;

export interface ResultSectionProps {
  initialTab?: ActiveTab;
  bankerCount?: number;
  playerCount?: number;
  tieCount?: number;
  resultGrid?: ResultColor[][];
  bankerGrid?: MoveIcon[][];
  playerGrid?: MoveIcon[][];
  lastDrawResults?: any[];
}

const iconSrc: Record<Exclude<MoveIcon, null>, string> = {
  scissors: "/images/oantuti/icon_scissors.svg",
  stone: "/images/oantuti/icon_stone.svg",
  paper: "/images/oantuti/icon_paper.svg",
};

const ResultSection: React.FC<ResultSectionProps> = ({
  initialTab = "result",
  resultGrid,
  bankerGrid,
  playerGrid,
  lastDrawResults
}) => {
  // Use RPS API data
  const {
    data: statisticDataFromApi,
    isLoading: isStatisticLoadingFromApi,
    error: statisticErrorFromApi
  } = useStatisticResult();

  // Get RPS data from API
  const rpsDataArray = statisticDataFromApi?.data || [];

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const getIconFromMove = (move: string): MoveIcon => {
    switch (move) {
      case "KEO":
        return "scissors";
      case "BUA":
        return "stone";
      case "BAO":
        return "paper";
      default:
        return null;
    }
  };

  const getResultColor = (winner: string): ResultColor => {
    switch (winner) {
      case "CAI":
        return "red"; // Assuming red for Banker win
      case "CON":
        return "blue"; // Assuming blue for Player win
      case "HOA":
        return "green"; // Assuming green for Tie
      default:
        return null;
    }
  };

  // Calculate win/lose statistics from RPS API data
  const calculatedBankerCount = useMemo(() => {
    if (!rpsDataArray.length) return 0;
    return rpsDataArray.filter((item: any) => {
      if (!item?.count) return false;
      const dealerChoice = item.count.dealer;
      const playerChoice = item.count.player;
      return dealerChoice !== playerChoice && (
        (dealerChoice === 'BUA' && playerChoice === 'KEO') ||
        (dealerChoice === 'KEO' && playerChoice === 'BAO') ||
        (dealerChoice === 'BAO' && playerChoice === 'BUA')
      );
    }).length;
  }, [rpsDataArray]);

  const calculatedPlayerCount = useMemo(() => {
    if (!rpsDataArray.length) return 0;
    return rpsDataArray.filter((item: any) => {
      if (!item?.count) return false;
      const dealerChoice = item.count.dealer;
      const playerChoice = item.count.player;
      return dealerChoice !== playerChoice && (
        (playerChoice === 'BUA' && dealerChoice === 'KEO') ||
        (playerChoice === 'KEO' && dealerChoice === 'BAO') ||
        (playerChoice === 'BAO' && dealerChoice === 'BUA')
      );
    }).length;
  }, [rpsDataArray]);

  const calculatedTieCount = useMemo(() => {
    if (!rpsDataArray.length) return 0;
    return rpsDataArray.filter((item: any) => {
      if (!item?.count) return false;
      return item.count.dealer === item.count.player;
    }).length;
  }, [rpsDataArray]);

  // Calculate move counts from RPS API data
  const bankerMoveCounts = useMemo(() => {
    if (!rpsDataArray.length) return { keo: 0, bua: 0, bao: 0 };
    let keo = 0, bua = 0, bao = 0;
    rpsDataArray.forEach((item: any) => {
      if (item?.count?.dealer) {
        const move = item.count.dealer;
        if (move === "KEO") keo++;
        else if (move === "BUA") bua++;
        else if (move === "BAO") bao++;
      }
    });
    return { keo, bua, bao };
  }, [rpsDataArray]);

  const playerMoveCounts = useMemo(() => {
    if (!rpsDataArray.length) return { keo: 0, bua: 0, bao: 0 };
    let keo = 0, bua = 0, bao = 0;
    rpsDataArray.forEach((item: any) => {
      if (item?.count?.player) {
        const move = item.count.player;
        if (move === "KEO") keo++;
        else if (move === "BUA") bua++;
        else if (move === "BAO") bao++;
      }
    });
    return { keo, bua, bao };
  }, [rpsDataArray]);

  // Win/Lose grid with Baccarat-style road logic (17 columns for mobile)
  const calculatedResultGrid: ResultColor[][] = useMemo(() => {
    if (!rpsDataArray.length) return Array.from({ length: 6 }, () => Array(17).fill(null));

    const grid: ResultColor[][] = Array.from({ length: 6 }, () => Array(17).fill(null));
    let currentCol = 0;
    let currentRow = 0;
    let lastResult = '';

    rpsDataArray.forEach((item: any, index: number) => {
      if (currentCol >= 17) return;

      let result = '';
      if (item?.count) {
        const dealerChoice = item.count.dealer;
        const playerChoice = item.count.player;

        if (dealerChoice === playerChoice) {
          result = 'HOA';
        } else if (
          (dealerChoice === 'BUA' && playerChoice === 'KEO') ||
          (dealerChoice === 'KEO' && playerChoice === 'BAO') ||
          (dealerChoice === 'BAO' && playerChoice === 'BUA')
        ) {
          result = 'CAI';
        } else {
          result = 'CON';
        }
      }

      if (result) {
        // Baccarat road logic
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

        if (currentCol < 17 && currentRow < 6) {
          grid[currentRow][currentCol] = getResultColor(result);
        }

        lastResult = result;
      }
    });

    return grid;
  }, [rpsDataArray]);

  // Banker grid with Baccarat-style road logic (17 columns for mobile)
  const calculatedBankerGrid: MoveIcon[][] = useMemo(() => {
    if (!rpsDataArray.length) return Array.from({ length: 6 }, () => Array(17).fill(null));

    const grid: MoveIcon[][] = Array.from({ length: 6 }, () => Array(17).fill(null));
    let currentCol = 0;
    let currentRow = 0;
    let lastMove = '';

    rpsDataArray.forEach((item: any, index: number) => {
      if (currentCol >= 17) return;

      const move = item?.count?.dealer;
      if (move) {
        // Baccarat road logic
        if (index === 0) {
          currentCol = 0;
          currentRow = 0;
        } else if (move === lastMove) {
          currentRow++;
          if (currentRow >= 6) {
            currentCol++;
            currentRow = 0;
          }
        } else {
          currentCol++;
          currentRow = 0;
        }

        if (currentCol < 17 && currentRow < 6) {
          grid[currentRow][currentCol] = getIconFromMove(move);
        }

        lastMove = move;
      }
    });

    return grid;
  }, [rpsDataArray]);

  // Player grid with Baccarat-style road logic (17 columns for mobile)
  const calculatedPlayerGrid: MoveIcon[][] = useMemo(() => {
    if (!rpsDataArray.length) return Array.from({ length: 6 }, () => Array(17).fill(null));

    const grid: MoveIcon[][] = Array.from({ length: 6 }, () => Array(17).fill(null));
    let currentCol = 0;
    let currentRow = 0;
    let lastMove = '';

    rpsDataArray.forEach((item: any, index: number) => {
      if (currentCol >= 17) return;

      const move = item?.count?.player;
      if (move) {
        // Baccarat road logic
        if (index === 0) {
          currentCol = 0;
          currentRow = 0;
        } else if (move === lastMove) {
          currentRow++;
          if (currentRow >= 6) {
            currentCol++;
            currentRow = 0;
          }
        } else {
          currentCol++;
          currentRow = 0;
        }

        if (currentCol < 17 && currentRow < 6) {
          grid[currentRow][currentCol] = getIconFromMove(move);
        }

        lastMove = move;
      }
    });

    return grid;
  }, [rpsDataArray]);

  const [active, setActive] = useState<ActiveTab>(initialTab);
  const rGrid = resultGrid ?? calculatedResultGrid;
  const bGrid = bankerGrid ?? calculatedBankerGrid;
  const pGrid = playerGrid ?? calculatedPlayerGrid;

  const tabClass = (isActive: boolean) =>
    `block text-center h-6 leading-6 rounded border ${isActive
      ? "bg-[#d7ecff] text-[#4f88c1] border-[#4f88c1]"
      : "bg-white text-black border-[#d2d2d2]"
    }`;

  const renderResultGrid = () => (
    <div className="relative overflow-hidden pl-[20.2%] max-w-full">
      {/* Left title panel */}

      <div className="absolute bottom-0 left-0 z-10 w-[20%] h-[100px] bg-[#f1eff2] border-r border-[#aaaaaa]">
        <div className=" align-middle text-left p-[7.234px] pr-[10px] h-full flex flex-col justify-between" style={{ paddingTop: '10px' }}>
          <div className="text-[0.75em] leading-[1.7em] flex justify-between items-center text-[#ff0000]">
            <span>Cái</span>
            <span>{calculatedBankerCount}</span>
          </div>
          <div className="text-[0.75em] leading-[1.7em] flex justify-between items-center text-[#0201FF]">
            <span>Con</span>
            <span>{calculatedPlayerCount}</span>
          </div>
          <div className="text-[0.75em] leading-[1.7em] flex justify-between items-center text-[#41b401]">
            <span>Hoà</span>
            <span>{calculatedTieCount}</span>
          </div>
        </div>
      </div>

      {/* Right scrollable table */}
      <div className="w-full overflow-x-auto bg-[#f0f0f0]">
        <table className="w-full m-0 border-collapse bg-white table-fixed">
          <tbody>
            {rGrid.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={`${ri}-${ci}`}
                    className="relative border-b border-r border-[#c4c4c4] bg-white h-4 align-middle text-center"
                  >
                    {cell && (
                      <span
                        className={
                          `absolute inset-0 m-auto block w-[16px] h-[16px] leading-[15px] rounded-full text-[0.7em] font-bold text-center box-border ` +
                          (cell === "red"
                            ? "border-[3px] border-[#ff0000] text-[#fdb82d]"
                            : cell === "blue"
                              ? "border-[3px] border-[#0201ff] text-[#48b363]"
                              : "border-[3px] border-[#2ca900] text-[#2ca900]")
                        }
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMoveGrid = (grid: MoveIcon[][], type: "banker" | "player") => (
    <div className="relative overflow-hidden pl-[20.2%] max-w-full">
      <div className="absolute bottom-0 left-0 z-10 w-[20%] h-[100px] bg-[#f1eff2] border-r border-[#aaaaaa]">
        <div className=" align-middle text-left p-[7.234px] pr-[10px] h-full flex flex-col justify-between" style={{ paddingTop: '10px' }}>
          <div className="text-[0.75em] leading-[1.7em] flex justify-between items-center text-[#399FFC]">
            <span>Kéo</span>
            <span>{type === "banker" ? bankerMoveCounts.keo : playerMoveCounts.keo}</span>
          </div>
          <div className="text-[0.75em] leading-[1.7em] flex justify-between items-center text-[#FE7566]">
            <span>Búa</span>
            <span>{type === "banker" ? bankerMoveCounts.bua : playerMoveCounts.bua}</span>
          </div>
          <div className="text-[0.75em] leading-[1.7em] flex justify-between items-center text-[#F8B601]">
            <span>Bao</span>
            <span>{type === "banker" ? bankerMoveCounts.bao : playerMoveCounts.bao}</span>
          </div>
        </div>
      </div>
      {/* Right scrollable table */}
      <div className="w-full overflow-x-auto bg-[#f0f0f0]">
        <table className="w-full m-0 border-collapse bg-white table-fixed">
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={`${ri}-${ci}`}
                    className="relative border-b border-r border-[#c4c4c4] bg-white h-4 align-middle text-center"
                  >
                    {cell && (
                      <img
                        src={iconSrc[cell]}
                        alt={cell}
                        className="block w-[75%] h-auto m-auto"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full relative overflow-hidden bg-white overflow-x-hidden">
      {/* Tabs header (rdList_Top05) */}
      <div className="bg-[#ebebeb] border-b border-[#c4c4c4] py-2 px-2">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className={tabClass(active === "result")}
            onClick={() => setActive("result")}
          >
            Win
          </button>
          <button
            type="button"
            className={tabClass(active === "banker")}
            onClick={() => setActive("banker")}
          >
            Nhà Cái
          </button>
          <button
            type="button"
            className={tabClass(active === "player")}
            onClick={() => setActive("player")}
          >
            Nhà Con
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {active === "result" && renderResultGrid()}
        {active === "banker" && renderMoveGrid(bGrid, "banker")}
        {active === "player" && renderMoveGrid(pGrid, "player")}
      </div>
    </div>
  );
};

export default ResultSection;


