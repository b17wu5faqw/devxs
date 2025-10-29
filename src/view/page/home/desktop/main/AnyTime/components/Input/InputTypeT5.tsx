import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface BetGroups {
  group_name: string;
  options: BetOption[];
}

interface BetOption {
  id: number;
  bet_type_id: number;
  option_key: string;
  option_label: string;
  odds: number;
  order_index: number;
  rule_condition: string;
}

interface InputTypeT5Props {
  setNumbers: (nums: string[]) => void;
  setOdds?: (odds: number) => void;
  groups: BetGroups[];
}

const InputTypeT5: React.FC<InputTypeT5Props> = ({ groups, setNumbers, setOdds }) => {
  const [selected, setSelected] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const result = Object.entries(selected)
      .filter(([_, val]) => val !== null)
      .map(([group, val]) => `${group}:${val}`);
    setNumbers(result);
  }, [selected, setNumbers]);

  const handleSelect = (groupName: string, optionKey: string) => {
    setSelected((prev) => ({
      ...prev,
      [groupName]: prev[groupName] === optionKey ? null : optionKey,
    }));

    // Find the selected option and set its odds
    if (setOdds) {
      const group = groups.find(g => g.group_name === groupName);
      if (group) {
        const option = group.options.find(opt => opt.option_key === optionKey);
        if (option) {
          setOdds(option.odds);
        }
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
      {groups.map((group) => (
        <Box
          key={group.group_name}
          sx={{
            p: 1.2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                background: "#fff",
                border: "1px solid #ccc",
                px: 1,
                py: 0.3,
                borderRadius: "4px",
                minWidth: 80,
                textAlign: "center",
              }}
            >
              {group.group_name}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {group.options.map((opt) => {
                const active = selected[group.group_name] === opt.option_key;
                return (
                  <Box key={opt.id} sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "150px", }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.4,
                        borderRadius: "4px",
                        p: 0.5,
                        background: active ? "#eb132d" : "#fff",
                        border: active ? "1px solid #eb132d" : "1px solid #ccc",
                        cursor: "pointer",
                        transition: "0.2s",
                        width: "100px",
                        "&:hover": { background: "#ffcdcf" },
                      }}
                      onClick={() =>
                        handleSelect(group.group_name, opt.option_key)
                      }
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          color: active ? "#fff" : "#000",
                        }}
                      >
                        {opt.option_label}
                      </Typography>

                      {opt.rule_condition && (
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: "#0077cc",
                          }}
                        >
                          {opt.rule_condition}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: "red",
                        fontWeight: 500,
                      }}
                    >
                      {opt.odds}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default InputTypeT5;
