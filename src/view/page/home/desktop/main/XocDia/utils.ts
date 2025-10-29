
/**
 * Get bet type ID from API data
 */
export const getBetTypeId = (betCode: string, betTypesData: any): string => {
  if (!betTypesData?.data || !Array.isArray(betTypesData.data)) {
    return "1";
  }
  const betType = betTypesData.data.find((bt: any) => bt.code === betCode);
  return betType?.id?.toString() || "1";
};

/**
 * Get prize rate for bet code
 */
export const getPrizeRate = (betCode: string, betTypesData: any): number => {
  if (!betTypesData?.data || !Array.isArray(betTypesData.data)) {
    const defaultRates: { [key: string]: number } = {
      'BIG': 1.985, 'SMALL': 1.985, 'ODD': 1.985, 'EVEN': 1.985,
      'ODDS_04': 15, 'ODDS_40': 15,
      'ODDS_13': 3.8, 'ODDS_31': 3.8,
      'ODDS_22': 2.6, 'ODDS_44': 7.8
    };
    return defaultRates[betCode] || 1.0;
  }
  const betType = betTypesData.data.find((bt: any) => bt.code === betCode);
  return parseFloat(betType?.prize_rate || betType?.odds || "1.0");
};

/**
 * Analyze dice result for Tài/Xỉu and Chẵn/Lẻ
 */
export const analyzeDiceResult = (result: string) => {
  if (!result) return { taiXiu: '', chanLe: '', dicePattern: '' };

  const dices = result.split(',');
  const redCount = dices.filter(d => d === 'R').length;
  const whiteCount = dices.filter(d => d === 'W').length;

  // Tài/Xỉu: >= 3 Đỏ = Tài, >= 3 Trắng = Xỉu
  const taiXiu = redCount >= 3 ? 'T' : 'X';
  // Chẵn/Lẻ: Số đỏ chẵn/lẻ
  const chanLe = redCount % 2 === 0 ? 'C' : 'L';

  return { taiXiu, chanLe };
};

/**
 * Analyze results from lastDraws data
 */
export const analyzeResults = (lastDrawsData: any) => {
  const results = Array.isArray(lastDrawsData) ? lastDrawsData : lastDrawsData?.data || [];

  if (!results || results.length === 0) {
    return { chanCount: 0, leCount: 0, taiCount: 0, xiuCount: 0 };
  }

  let chanCount = 0, leCount = 0, taiCount = 0, xiuCount = 0;

  results.forEach((draw: any) => {
    const analysis = analyzeDiceResult(draw.result);
    if (analysis.chanLe === 'C') chanCount++;
    else if (analysis.chanLe === 'L') leCount++;

    if (analysis.taiXiu === 'T') taiCount++;
    else if (analysis.taiXiu === 'X') xiuCount++;
  });

  return { chanCount, leCount, taiCount, xiuCount };
};

/**
 * Create display grid for both sections
 */
export const createDisplayGrid = (lastDrawsData: any) => {
  const results = Array.isArray(lastDrawsData) ? lastDrawsData : lastDrawsData?.data || [];
  const cols = 22;
  const rowsPerSection = 6;
  const maxResultsPerSection = 132; // 22 columns x 6 rows per section

  // Initialize grid for both sections
  const chanLeGrid = Array(rowsPerSection).fill(null).map(() => Array(cols).fill(null));
  const taiXiuGrid = Array(rowsPerSection).fill(null).map(() => Array(cols).fill(null));

  if (!results || results.length === 0) {
    return { chanLeGrid, taiXiuGrid };
  }

  // Take the most recent results up to maxResultsPerSection for each section
  const recentResults = results.slice(0, Math.min(results.length, maxResultsPerSection));

  // Fill both grids with the same sequence of results
  recentResults.forEach((draw: any, index: number) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (row < rowsPerSection) {
      const analysis = analyzeDiceResult(draw.result);

      // Fill Chẵn/Lẻ grid
      chanLeGrid[row][col] = {
        value: analysis.chanLe,
        drawId: draw.id,
        drawNo: draw.draw_no
      };

      // Fill Tài/Xỉu grid  
      taiXiuGrid[row][col] = {
        value: analysis.taiXiu,
        drawId: draw.id,
        drawNo: draw.draw_no
      };
    }
  });

  return { chanLeGrid, taiXiuGrid };
};

/**
 * Check if selection is valid
 */
export const isValidSelection = (currentSelections: string[], newOption: string): boolean => {
  if (currentSelections.length === 0) return true;
  if (currentSelections.includes(newOption)) return true;
  if (currentSelections.length >= 2) return false;

  const hasConflict = (option1: string, option2: string): boolean => {
    if ((option1 === "BIG" && option2 === "SMALL") || (option1 === "SMALL" && option2 === "BIG")) {
      return true;
    }
    if ((option1 === "ODD" && option2 === "EVEN") || (option1 === "EVEN" && option2 === "ODD")) {
      return true;
    }
    return false;
  };

  // Check conflict with existing selections
  for (const existingOption of currentSelections) {
    if (hasConflict(existingOption, newOption)) {
      return false;
    }
  }

  return true;
};

/**
 * Get option name for display
 */
export const getOptionName = (optionId: string) => {
  const optionNames: { [key: string]: string } = {
    "BIG": "Tài",
    "SMALL": "Xỉu",
    "ODD": "Lẻ",
    "EVEN": "Chẵn",
    "ODDS_04": "4 Trắng",
    "ODDS_13": "3 Trắng 1 Đỏ",
    "ODDS_22": "2 Trắng 2 Đỏ",
    "ODDS_40": "4 Đỏ",
    "ODDS_31": "3 Đỏ 1 Trắng",
    "ODDS_44": "4 Đỏ X 4 Trắng"
  };
  return optionNames[optionId] || optionId;
}; 