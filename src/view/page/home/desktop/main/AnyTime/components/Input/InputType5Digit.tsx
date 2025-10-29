import React, { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

const ROWS = ["C.Ngan", "Ngan", "Tram", "Chuc", "Donvi"];
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

interface InputType5DigitProps {
  setNumbers: (numbers: string[]) => void;
}

const InputType5Digit: React.FC<InputType5DigitProps> = ({ setNumbers }) => {
  const [selectedArrNumbers, setSelectedArrNumbers] = useState<
    Record<string, number[]>
  >({
    "C.Ngan": [],
    Ngan: [],
    Tram: [],
    Chuc: [],
    Donvi: [],
  });
  const convertSelectedArrToNumbers = useCallback(() => {
    const result: string[] = [];

    Object.entries(selectedArrNumbers).forEach(([key, values]) => {
      if (values.length > 0) {
        const combination = `${key}:${values.join(",")}`;
        result.push(combination);
      }
    });

    return result;
  }, [selectedArrNumbers]);

  useEffect(() => {
    const numbersFromSelectedArr = convertSelectedArrToNumbers();
    setNumbers(numbersFromSelectedArr);
  }, [convertSelectedArrToNumbers, setNumbers]);

  const toggleNumber = (row: string, num: number) => {
    setSelectedArrNumbers((prev) => {
      const newRow = prev[row].includes(num)
        ? prev[row].filter((n) => n !== num)
        : [...prev[row], num];
      return { ...prev, [row]: newRow };
    });
  };

  const handleAction = (row: string, type: string) => {
    let newRow: number[] = [];
    switch (type) {
      case "Tài":
        newRow = DIGITS.filter((n) => n >= 5);
        break;
      case "Xỉu":
        newRow = DIGITS.filter((n) => n < 5);
        break;
      case "Lẻ":
        newRow = DIGITS.filter((n) => n % 2 !== 0);
        break;
      case "Chẵn":
        newRow = DIGITS.filter((n) => n % 2 === 0);
        break;
      case "Xóa":
        newRow = [];
        break;
    }
    setSelectedArrNumbers((prev) => ({ ...prev, [row]: newRow }));
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
        <Box key={row} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 70,
              textAlign: "center",
              background: "#eee",
              borderRadius: "4px",
              padding: "5px 0",
              fontWeight: "600",
            }}
          >
            {row}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {DIGITS.map((num) => {
              const isSelected = selectedArrNumbers[row].includes(num);
              return (
                <Box
                  key={num}
                  onClick={() => toggleNumber(row, num)}
                  sx={{
                    width: 33,
                    height: 33,
                    borderRadius: "50%",
                    border: isSelected ? "1px solid #eb132d" : "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: isSelected ? "#ffcdcf" : "#fff",
                    color: isSelected ? "#eb132d" : "#000",
                    fontWeight: 600,
                  }}
                >
                  {num}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, marginLeft: "auto" }}>
            {["Tài", "Xỉu", "Lẻ", "Chẵn", "Xóa"].map((btn) => (
              <Button
                key={btn}
                onClick={() => handleAction(row, btn)}
                variant="contained"
                size="small"
                sx={{
                  background: "#a0c4ff",
                  color: "#fff",
                  minWidth: 35,
                  fontSize: "0.75rem",
                  boxShadow: "none",
                  padding: "3px",
                  "&:hover": { background: "#008aff", boxShadow: "none" },
                }}
              >
                {btn}
              </Button>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default InputType5Digit;
