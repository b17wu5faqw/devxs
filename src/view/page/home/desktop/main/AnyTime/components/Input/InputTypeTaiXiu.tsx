import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";

interface Option {
  key: string;
  label: string;
  odds: number;
}

interface InputTypeTaiXiuProps {
  setNumbers: (numbers: string[]) => void;
}

const ROWS = ["C.Ngan", "Ngan", "Tram", "Chuc", "Donvi"];

// Các tùy chọn cho từng hàng
const OPTIONS: Option[] = [
  { key: "TAI", label: "Tài", odds: 1.985 },
  { key: "XIU", label: "Xỉu", odds: 1.985 },
  { key: "LE", label: "Lẻ", odds: 1.985 },
  { key: "CHAN", label: "Chẵn", odds: 1.985 },
  { key: "TO", label: "Tổ", odds: 1.985 },
  { key: "HOP", label: "Hợp", odds: 1.985 },
];

const InputTypeTaiXiu: React.FC<InputTypeTaiXiuProps> = ({ setNumbers }) => {
  const [selected, setSelected] = useState<Record<string, string | null>>({
    "C.Ngan": null,
    "Ngan": null,
    "Tram": null,
    "Chuc": null,
    "Donvi": null,
  });

  // Cập nhật dữ liệu chọn lên parent (numbers)
  useEffect(() => {
    const formatted = Object.entries(selected)
      .filter(([_, val]) => val !== null)
      .map(([row, val]) => `${row}:${val}`);
    setNumbers(formatted);
  }, [selected, setNumbers]);

  // Chọn 1 option
  const handleSelect = (row: string, optKey: string) => {
    setSelected((prev) => ({
      ...prev,
      [row]: prev[row] === optKey ? null : optKey,
    }));
  };

  // Xóa chọn hàng
  const clearRow = (row: string) => {
    setSelected((prev) => ({ ...prev, [row]: null }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        flex: 1,
        padding: "10px",
      }}
    >
      {ROWS.map((row) => (
        <Box
          key={row}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "#f3f3f3",
            padding: "6px 8px",
            borderRadius: "6px",
          }}
        >
          {/* Label */}
          <Box sx={{ width: 70, fontWeight: 600, textAlign: "center" }}>
            {row}
          </Box>

          <Box sx={{ display: "flex", gap: 0.8 }}>
            {OPTIONS.map((opt) => {
              const active = selected[row] === opt.key;
              return (
                <Box
                  key={opt.key}
                  sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Button
                    onClick={() => handleSelect(row, opt.key)}
                    variant="contained"
                    size="small"
                    sx={{
                      background: active ? "#ffcdcf" : "#fff",
                      color: active ? "#eb132d" : "#000",
                      border: "1px solid #999",
                      textTransform: "none",
                      fontWeight: "600",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 55,
                      boxShadow: "none",
                      "&:hover": {
                        background: "#ffcdcf",
                        boxShadow: "none",
                        color: "eb132d",
                        borderColor: "#eb132d",
                      },
                    }}
                  >
                    <span>{opt.label}</span>
                  </Button>
                  <span
                    style={{
                      fontSize: "0.80rem",
                      fontWeight: "600",
                      color: "#eb132d",
                    }}
                  >
                    {opt.odds}
                  </span>
                </Box>
              );
            })}
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={() => clearRow(row)}
            sx={{
              background: "#a0c4ff",
              color: "#fff",
              minWidth: 45,
              fontSize: "0.80rem",
              fontWeight: "600",
              boxShadow: "none",
              "&:hover": { background: "#90b4f2" },
            }}
          >
            Xóa
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default InputTypeTaiXiu;
