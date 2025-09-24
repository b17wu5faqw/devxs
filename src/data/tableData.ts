export interface TableData {
    rows: Array<Array<string | number>>;
  }

// 2D, 3D, 4D Table Data
export const tables2D: TableData[] = [
  {
    rows: [
      ["Cách chơi 2D", "Đầu", "Đề đuôi", "Đầu Đuôi", "Giải Nhất", "Bao lô", "7 Lô", "Đề đầu"],
      ["Tỉ lệ", "99", "99", "99", "99", "99", "99", "99"],
      ["Cược tối thiểu", "1", "1", "1", "1", "1", "1", "1"],
    ]
  },
  {
    rows: [
      ["Cách chơi 3D", "Đầu", "Đuôi", "Đầu Đuôi", "Giải Nhất", "Bao lô", "7 Lô", ""],
      ["Tỉ lệ", "972.3", "972.3", "972.3", "972.3", "972.3", "972.3", ""],
      ["Cược tối thiểu", "1", "1", "1", "1", "1", "1", ""],
    ]
  },
  {
    rows: [
      ["Cách chơi 4D", "Đuôi", "Giải Nhất", "Bao lô", "", "", "", ""],
      ["Tỉ lệ", "9000", "9000", "9000", "", "", "", ""],
      ["Cược tối thiểu", "1", "1", "1", "", "", "", ""],
    ]
  }
];

// Group Tables
export const tablesGroup: TableData[] = [
  {
    rows: [
      ["ĐB nhóm", "4D Nhóm 24", "4D Nhóm 12", "4D Nhóm 6", "4D Nhóm 4"],
      ["Tỉ lệ", "404.17", "808.33", "1616.67", "2425"],
      ["Cược tối thiểu", "10", "10", "10", "10"],
    ]
  },
  {
    rows: [
      ["ĐB nhóm", "3D Nhóm 3\n(Hậu tam)", "3D Nhóm 6\n(Hậu tam)", "Nhóm 2D\n(Hậu nhì)", ""],
      ["Tỉ lệ", "323.33", "161.67", "48.5", ""],
      ["Cược tối thiểu", "10", "10", "10", ""],
    ]
  }
];

// Fixed Tables
export const tablesFixed: TableData[] = [
  {
    rows: [
      ["ĐB K.cố định", "2 trúng 1\n(Hậu nhì)", "3 trúng 1\n(Hậu tam)", "3 trúng 2\n(Hậu tam)", "4 trúng 1\n(Hậu tứ)", "4 trúng 2\n(Hậu tứ)"],
      ["Tỉ lệ", "5.11", "3.58", "17.96", "2.82", "9.96"],
      ["Cược tối thiểu", "10", "10", "10", "10", "10"],
    ]
  }
];

// Region Tables
export const tablesRegion: TableData[] = [
  {
    rows: [
      ["2D Lô Xiên", "Miền Trung\nMiền Nam\nXiên 2", "Miền Trung\nMiền Nam\nXiên 3", "Miền Trung\nMiền Nam\nXiên 4", "Miền Bắc\nXiên 2", "Miền Bắc\nXiên 3", "Miền Bắc\nXiên 4", ""],
      ["Tỉ lệ", "34", "188", "970", "17", "74", "251", ""],
      ["Cược tối thiểu", "10", "10", "10", "10", "10", "10", ""],
    ]
  },
  {
    rows: [
      ["2D Lô trượt", "Miền Trung,\nMiền Nam\nLô trượt 4", "Miền Trung,\nMiền Nam\nLô trượt 5", "Miền Trung,\nMiền Nam\nLô trượt 6", "Miền Trung,\nMiền Nam\nLô trượt 7", "Miền Trung,\nMiền Nam\nLô trượt 8", "Miền Trung,\nMiền Nam\nLô trượt 9", "Miền Trung,\nMiền Nam\nLô trượt 10"],
      ["Tỉ lệ", "2.02", "2.44", "2.95", "3.58", "4.34", "5.25", "6.4"],
      ["Cược tối thiểu", "10", "10", "10", "10", "10", "10", "10"],
    ]
  }
];

// Special Tables
export const tablesSpecial: TableData[] = [
  {
    rows: [
      ["Đặc biệt", "2D - Kèo đôi\n(Đầu)", "3D - Kèo đôi\n(Đầu)", "4D - Kèo đôi\n(Đuôi)", "2D - ĐB(Đầu)", "3D - ĐB(Đầu)", "4D - ĐB(Đuôi)"],
      ["Tỉ lệ", "1.98", "1.98", "1.98", "9.9", "9.9", "9.9"],
      ["Cược tối thiểu", "10", "10", "10", "10", "10", "10"],
    ]
  }
];