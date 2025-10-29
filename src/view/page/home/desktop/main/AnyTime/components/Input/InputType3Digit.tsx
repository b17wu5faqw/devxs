import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Grid,
  Grow,
  Popover,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import CustomText from "@/components/text/CustomText";

interface InputProps {
  title?: string;
  onConfirm: (selectedNumbers: string[]) => void;
}

const InputType3Digit: React.FC<InputProps> = ({ title, onConfirm }) => {
  const [activeHundred, setActiveHundred] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.LIVE_INPUT_TYPE_3_DIGIT)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
    setSelectedNumbers([]);
  };

  const numberMatrix = useMemo(() => {
    const base = Number(activeHundred) * 100;
    const list = Array.from({ length: 100 }, (_, i) => base + i);
    return list;
  }, [activeHundred]);

  const rows = useMemo(() => {
    const matrix: number[][] = [];
    for (let i = 0; i < 10; i++) {
      matrix.push(numberMatrix.slice(i * 10, i * 10 + 10));
    }
    return matrix;
  }, [numberMatrix]);

  const toggleNumber = (num: string) => {
    setSelectedNumbers((prev) => {
      const updated = prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num];
      onConfirm(updated);
      return updated;
    });
  };

  const toggleRow = (rowIndex: number) => {
    const rowNums = rows[rowIndex].map((n) => n.toString().padStart(3, "0"));
    setSelectedNumbers((prev) => {
      const isAllSelected = rowNums.every((n) => prev.includes(n));
      const updated = isAllSelected
        ? prev.filter((n) => !rowNums.includes(n))
        : [...new Set([...prev, ...rowNums])];
      onConfirm(updated);
      return updated;
    });
  };

  const toggleColumn = (colIndex: number) => {
    const colNums = rows.map((r) => r[colIndex].toString().padStart(3, "0"));
    setSelectedNumbers((prev) => {
      const isAllSelected = colNums.every((n) => prev.includes(n));
      const updated = isAllSelected
        ? prev.filter((n) => !colNums.includes(n))
        : [...new Set([...prev, ...colNums])];
      onConfirm(updated);
      return updated;
    });
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "500px" },
          maxWidth: "500px",
          maxHeight: { xs: "100dvh", md: "90vh" },
          background:
            "linear-gradient(137.93deg, rgba(97,206,255,.024) 7.21%,#f6faff 49.31%,rgba(97,206,255,.024) 96.05%),#fff",
          position: "absolute",
          left: "400px",
          overflow: "hidden",
          margin: 0,
        },
      }}
      open={isOpen}
      TransitionComponent={Grow}
      onClose={handleClose}
    >
      <Box
        sx={{
          border: "4px solid #c2ccd5",
          borderRadius: "8px",
          padding: "0 10px 10px",
        }}
      >
        <CustomText
          sx={{
            minHeight: "55px",
            lineHeight: "55px",
            borderBottom: "1px solid #bbbbbb",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          {title}
        </CustomText>
        <Tabs
          value={activeHundred}
          onChange={(_, val) => setActiveHundred(val)}
          sx={{
            marginBottom: "10px",
            marginTop: "10px",
            minHeight: "unset",
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
              gap: "4px",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTabs-scroller": {
              overflow: "visible !important",
            },
          }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <Tab
              sx={{
                minWidth: "20px",
                maxWidth: "20px",
                width: "20px",
                height: "20px",
                minHeight: "20px",
                border: "2px solid #bbbbbb",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
                backgroundColor: "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f0f8ff",
                  borderColor: "#b3d1f2",
                },
                "&.Mui-selected": {
                  backgroundColor: "#b3d1f2",
                  color: "#fff",
                  borderColor: "#b3d1f2",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#b3d1f2",
                  borderColor: "#b3d1f2",
                },
              }}
              key={i}
              label={`${i}`}
            />
          ))}
        </Tabs>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40px repeat(10, 1fr)",
            border: "1px solid #ddd",
          }}
        >
          <Box></Box>
          {Array.from({ length: 10 }, (_, col) => (
            <Checkbox
              key={`col-${col}`}
              onClick={() => toggleColumn(col)}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                fontWeight: "600",
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                background: "#e5e5e5",
                borderRadius: 0,
              }}
            />
          ))}

          {rows.map((row, rowIndex) => (
            <Fragment key={`row-${rowIndex}`}>
              <Checkbox
                onClick={() => toggleRow(rowIndex)}
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  fontWeight: "600",
                  borderRight: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                  background: "#e5e5e5",
                  borderRadius: 0,
                }}
              />

              {row.map((num) => {
                const strNum = num.toString().padStart(3, "0");
                const isSelected = selectedNumbers.includes(strNum);
                return (
                  <CustomText
                    key={strNum}
                    onClick={() => toggleNumber(strNum)}
                    sx={{
                      textAlign: "center",
                      lineHeight: "40px",
                      minWidth: "auto",
                      borderRadius: 0,
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#feb2b2" : "#fff",
                      borderTop: rowIndex == 0 ? "1px solid #ccc" : "none",
                      borderBottom: "1px solid #ccc",
                      borderRight: rowIndex < 10 ? "1px solid #ccc" : "none",
                      "&:focus": {
                        outline: "2px solid #4bacff",
                        outlineOffset: "-2px",
                      },
                    }}
                  >
                    {strNum}
                  </CustomText>
                );
              })}
            </Fragment>
          ))}
        </Box>
      </Box>
    </Dialog>
  );
};

export default InputType3Digit;
