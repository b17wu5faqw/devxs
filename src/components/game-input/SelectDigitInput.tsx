import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Flex from "../utils/Flex";

interface SelectDigitInputProps {
  inputType: number;
  onSelect: (number: string) => void;
  isNumberSelected: (number: string) => boolean;
  handleAddTicket: (numbers: string[]) => void;
}

export const SelectDigitInput: React.FC<SelectDigitInputProps> = ({
  inputType,
  onSelect,
  isNumberSelected,
  handleAddTicket,
}) => {
  const [selectedDigits, setSelectedDigits] = useState<{
    [key: number]: string[];
  }>({});

  // Reset selected digits when input type changes
  useEffect(() => {
    setSelectedDigits({});
  }, [inputType]);

  const digitLabels = {
    2: ["Chục", "Đơn vị"],
    3: ["Trăm", "Chục", "Đơn vị"],
    4: ["Nghìn", "Trăm", "Chục", "Đơn vị"],
  };

  const handleDigitSelect = (position: number, digit: number) => {
    setSelectedDigits((prev) => {
      const newDigits = { ...prev };

      // Initialize array for this position if it doesn't exist
      if (!newDigits[position]) {
        newDigits[position] = [];
      }

      // Toggle digit selection
      const digitStr = digit.toString();
      if (newDigits[position].includes(digitStr)) {
        newDigits[position] = newDigits[position].filter((d) => d !== digitStr);
      } else {
        newDigits[position].push(digitStr);
      }

      // Remove position if no digits selected
      if (newDigits[position].length === 0) {
        delete newDigits[position];
      }

      return newDigits;
    });
  };

  const generateCombinations = () => {
    const numbers: string[] = [];

    const generateHelper = (current: string[], position: number) => {
      if (position === inputType) {
        numbers.push(current.join(""));
        return;
      }

      // If no digits selected for this position, skip
      const digits = selectedDigits[position] || [];
      if (digits.length === 0) return;

      digits.forEach((digit) => {
        generateHelper([...current, digit], position + 1);
      });
    };

    generateHelper([], 0);
    return numbers;
  };

  const handleAddNumbers = () => {
    const combinations = generateCombinations();
    if (combinations.length > 0) {
      const newNumbers = combinations.filter(
        (number) => !isNumberSelected(number)
      );

      if (newNumbers.length > 0) {
        handleAddTicket(newNumbers);
        setSelectedDigits({}); // Reset selections after adding
      }
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {Array.from({ length: inputType }).map((_, position) => (
        <Box key={position} sx={{ mb: 1 }}>
          <Flex
            sx={{ gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#6F6F6F",
                mb: 1,
                fontSize: "15px",
                fontWeight: "600",
                width: "80px",
              }}
            >
              {digitLabels[inputType as keyof typeof digitLabels][position]}
            </Typography>
            {Array.from({ length: 10 }).map((_, digit) => (
              <Button
                key={digit}
                onClick={() => handleDigitSelect(position, digit)}
                sx={{
                  width: "48px",
                  minWidth: "48px",
                  height: "48px",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "50%",
                  border: "1px solid #E0E0E0",
                  backgroundColor: selectedDigits[position]?.includes(
                    digit.toString()
                  )
                    ? "#3883E5"
                    : "transparent",
                  color: selectedDigits[position]?.includes(digit.toString())
                    ? "#fff"
                    : "#6F6F6F",
                  "&:hover": {
                    backgroundColor: "#3883E5",
                    color: "#fff",
                  },
                }}
              >
                {digit}
              </Button>
            ))}
          </Flex>
        </Box>
      ))}

      <Button
        onClick={handleAddNumbers}
        disabled={Object.keys(selectedDigits).length !== inputType}
        sx={{
          width: "200px",
          margin: "20px auto",
          display: "block",
          backgroundColor: "#3883E5",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#2563BE",
          },
          "&.Mui-disabled": {
            backgroundColor: "#E0E0E0",
            color: "#9FA4B7",
          },
        }}
      >
        Tạo số
      </Button>
    </Box>
  );
};
