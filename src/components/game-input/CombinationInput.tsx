import { useState, useRef, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Popover,
} from "@mui/material";
import CustomText from "@/components/text/CustomText";
import { useMenuStore } from "@/stores/useMenuStore";

interface CombinationInputProps {
  onCombinationsChange: (combinations: string[]) => void;
  onBetTypeChange?: (betTypeId: number) => void;
  resetState?: boolean;
}

export const CombinationInput = ({
  onCombinationsChange,
  onBetTypeChange,
  resetState
}: CombinationInputProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [completedSets, setCompletedSets] = useState<string[]>([]);
  const [activeSetIndex, setActiveSetIndex] = useState<number>(-1);  
  const { scheduleId, regionId } = useMenuStore();

  useEffect(() => {
    if (resetState) {
      setSelectedNumbers([]);
      setCompletedSets([]);
      setActiveSetIndex(-1);
    }
  }, [resetState]);

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedNumbers([]);
    setCompletedSets([]);
    const betTypeMap = regionId === 1 ? {
      0: 111,
      1: 112,
      2: 113
    } : {
      0: 121,
      1: 122,
      2: 123
    };
    onBetTypeChange?.(betTypeMap[newValue as keyof typeof betTypeMap]);
  };

  const handleNumberClick = (number: string) => {
    if (!selectedNumbers.includes(number)) {
      const newSelectedNumbers = [...selectedNumbers, number];
      const requiredNumbers = selectedTab + 2;

      if (newSelectedNumbers.length === requiredNumbers) {
        const sortedNumbers = newSelectedNumbers.sort(
          (a, b) => Number(a) - Number(b)
        );
        const formattedNumbers = sortedNumbers.join(",");

        setCompletedSets(prev => [...prev, formattedNumbers]);
        setSelectedNumbers([]);
        setActiveSetIndex(completedSets.length);

        // const newCompletedSets = [
        //   ...completedSets,
        //   { numbers: newSelectedNumbers, betAmount: "" },
        // ];
        // setCompletedSets(newCompletedSets);
        // setSelectedNumbers([]);
      } else {
        setSelectedNumbers(newSelectedNumbers);
      }
    }
  };

  useEffect(() => {
    onCombinationsChange(completedSets);
  }, [completedSets, onCombinationsChange]);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          margin: "5px 10px",
          gap: "10px",
          minHeight: "auto",
          "& .MuiTabs-flexContainer": {
            gap: "10px",
          },
          "& .MuiTab-root": {
            backgroundColor: "#3b3b3b",
            borderRadius: "3px",
            color: "#fff",
            minHeight: "auto",
            padding: "10px 16px",
            fontWeight: "600",
            textTransform: "none",
            flex: 1,
            "&.Mui-selected": {
              backgroundColor: "#46a58f",
              color: "#fff",
            },
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab label="Xiên 2" />
        <Tab label="Xiên 3" />
        <Tab label="Xiên 4" />
      </Tabs>

      <Box sx={{ padding: "5px 10px 10px", marginBottom: "5px" }}>
        <CustomText
          sx={{
            backgroundColor: "#69ac8e",
            textAlign: "center",
            color: "#fff",
            height: "35px",
            fontSize: "0.95em",
            lineHeight: "35px",
            borderRadius: "3px",
            position: "relative",
          }}
        >
          Tổ hợp đã chọn{" "}
          <span style={{ position: "absolute", right: "10px" }}>
            <span style={{ color: "#fff600" }}>{completedSets.length}</span> Đơn
          </span>
        </CustomText>
      </Box>

      <Grid container spacing={0}>
        {Array.from({ length: 100 }, (_, i) => (
          <Grid item xs={2.4} key={i} sx={{ padding: "0" }}>
            <Box
              onClick={() => handleNumberClick(i.toString().padStart(2, "0"))}
              sx={{
                padding: "8px",
                fontSize: "1.2em",
                borderRight: "1px solid #252525",
                borderBottom: "1px solid #252525",
                borderRadius: "0",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: selectedNumbers.includes(
                  i.toString().padStart(2, "0")
                )
                  ? "rgba(247,80,80,0.7)"
                  : "rgba(255,255,255,0.3)",
                color: "#fff",
                "&:hover": {
                  backgroundColor: selectedNumbers.includes(
                    i.toString().padStart(2, "0")
                  )
                    ? "rgba(247,80,80,0.7)"
                    : "rgba(255,255,255,0.3)",
                },
              }}
            >
              {i.toString().padStart(2, "0")}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
