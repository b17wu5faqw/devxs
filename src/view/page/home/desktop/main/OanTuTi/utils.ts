import { SicboBetType } from "@/hooks/useSicbo";

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

// ===== RPS SPECIFIC UTILITY FUNCTIONS =====

/**
 * Get bet type ID from bet code and RPS API data
 */
export const getRpsBetTypeId = (betCode: string, betTypesData: any): string => {
  if (!betTypesData?.data) return "1";
  
  // Search through all bet type groups
  for (const [groupId, group] of Object.entries(betTypesData.data)) {
    const groupData = group as any;
    
    // Check options array
    if (groupData.options) {
      const found = groupData.options.find((option: any) => option.code === betCode);
      if (found) return groupId;
    }
    
    // Check dealer array
    if (groupData.dealer) {
      const found = groupData.dealer.find((option: any) => option.code === betCode);
      if (found) return groupId;
    }
    
    // Check player array
    if (groupData.player) {
      const found = groupData.player.find((option: any) => option.code === betCode);
      if (found) return groupId;
    }
  }
  
  return "1"; // Default fallback
};

/**
 * Get prize rate from bet code and RPS API data
 */
export const getRpsPrizeRate = (betCode: string, betTypesData: any): number => {
  if (!betTypesData?.data) return 2.95;
  
  // Search through all bet type groups
  for (const [groupId, group] of Object.entries(betTypesData.data)) {
    const groupData = group as any;
    
    // Check options array
    if (groupData.options) {
      const found = groupData.options.find((option: any) => option.code === betCode);
      if (found) return parseFloat(found.rate) || 2.95;
    }
    
    // Check dealer array
    if (groupData.dealer) {
      const found = groupData.dealer.find((option: any) => option.code === betCode);
      if (found) return parseFloat(found.rate) || 2.95;
    }
    
    // Check player array
    if (groupData.player) {
      const found = groupData.player.find((option: any) => option.code === betCode);
      if (found) return parseFloat(found.rate) || 2.95;
    }
  }
  
  return 2.95; // Default fallback
};

/**
 * Analyze RPS result
 */
export const analyzeRpsResult = (result: string | number[]) => {
  if (!result) return { cai: 0, con: 0, tie: 0 };
  
  let caiWin = 0;
  let conWin = 0;
  let tie = 0;
  
  if (typeof result === 'string') {
    if (result.includes('CAI')) caiWin = 1;
    else if (result.includes('CON')) conWin = 1;
    else if (result.includes('HOA')) tie = 1;
  }
  
  return { cai: caiWin, con: conWin, tie };
};

/**
 * Analyze multiple RPS results
 */
export const analyzeRpsResults = (lastDrawsData: any) => {
  if (!lastDrawsData) return { cai: 0, con: 0, tie: 0 };
  
  const draws = Array.isArray(lastDrawsData) ? lastDrawsData : lastDrawsData.data || [];
  const stats = { cai: 0, con: 0, tie: 0 };
  
  draws.forEach((draw: any) => {
    if (draw.result) {
      const result = analyzeRpsResult(draw.result);
      stats.cai += result.cai;
      stats.con += result.con;
      stats.tie += result.tie;
    }
  });
  
  return stats;
};

/**
 * Create display grid for RPS results
 */
export const createRpsDisplayGrid = (lastDrawsData: any) => {
  if (!lastDrawsData) return [];
  
  const draws = Array.isArray(lastDrawsData) ? lastDrawsData : lastDrawsData.data || [];
  const grid: any[] = [];
  
  draws.slice(0, 30).forEach((draw: any, index: number) => {
    if (draw.result) {
      const result = analyzeRpsResult(draw.result);
      grid.push({
        id: draw.id || index,
        draw_no: draw.draw_no || `OTT${index}`,
        result: draw.result,
        winner: result.cai ? 'CAI' : result.con ? 'CON' : 'HOA',
        analysis: result
      });
    }
  });
  
  return grid;
};

/**
 * Check if RPS selection is valid (no conflicts)
 */
export const isValidRpsSelection = (currentSelections: string[], newOption: string): boolean => {
  if (currentSelections.length === 0) return true;

  // Define conflicting groups
  const hasConflict = (option1: string, option2: string): boolean => {
    const winGroups = ['CAI_WIN', 'HOA', 'CON_WIN'];
    const caiGroups = ['CAI_BUA', 'CAI_KEO', 'CAI_BAO'];
    const conGroups = ['CON_BUA', 'CON_KEO', 'CON_BAO'];

    // Check if both options are in the same conflicting group
    const groups = [winGroups, caiGroups, conGroups];

    return groups.some(group =>
      group.includes(option1) && group.includes(option2)
    );
  };

  return !currentSelections.some(selection => hasConflict(selection, newOption));
};

/**
 * Generate statistics data for RPS from recent draws
 * This creates data in the format expected by StatisticsSection with actual RPS icons
 */
export const generateRpsStatisticsData = (recentDraws: any[]) => {
  if (!recentDraws || recentDraws.length === 0) {
    return {
      data: {
        dealer: [],
        player: []
      }
    };
  }

  // Process draws to create road data format with actual RPS symbols
  const processedDraws = recentDraws.slice(0, 30).map((draw: any) => {
    const winner = draw.winner || 'HOA';
    const dealer = draw.dealer || 'BUA';
    const player = draw.player || 'BUA';

    return {
      draw_no: draw.draw_no,
      dealer: dealer, // BUA, KEO, BAO
      player: player, // BUA, KEO, BAO
      winner,
      // Keep winner info for potential winner-based statistics
      winnerSymbol: winner === 'CAI' ? 'CAI' : winner === 'CON' ? 'CON' : 'HOA'
    };
  });

  // Group data into columns (similar to how StatisticsSection expects it)
  const dealerColumns: any[][] = [];
  const playerColumns: any[][] = [];

  // Create columns of 6 items each
  for (let i = 0; i < processedDraws.length; i += 6) {
    const column = processedDraws.slice(i, i + 6);
    dealerColumns.push(column);
    playerColumns.push(column);
  }

  return {
    data: {
      dealer: dealerColumns,
      player: playerColumns
    }
  };
};

/**
 * Get display name for RPS option
 */
export const getRpsOptionName = (optionId: string) => {
  const nameMap: { [key: string]: string } = {
    // Win options
    'CAI_WIN': 'Cái thắng',
    'HOA': 'Hòa',
    'CON_WIN': 'Con thắng',
    
    // Dealer options
    'CAI_BUA': 'Cái búa',
    'CAI_KEO': 'Cái kéo', 
    'CAI_BAO': 'Cái bao',
    
    // Player options
    'CON_BUA': 'Con búa',
    'CON_KEO': 'Con kéo',
    'CON_BAO': 'Con bao',
    
    // Combination options
    'CAI_BUA_CON_KEO': 'Cái búa - Con kéo',
    'CAI_BUA_CON_BUA': 'Cái búa - Con búa',
    'CAI_BUA_CON_BAO': 'Cái búa - Con bao',
    'CAI_KEO_CON_KEO': 'Cái kéo - Con kéo',
    'CAI_KEO_CON_BAO': 'Cái kéo - Con bao',
    'CAI_BAO_CON_BAO': 'Cái bao - Con bao'
  };
  
  return nameMap[optionId] || optionId;
}; 