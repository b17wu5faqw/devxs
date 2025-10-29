import { Box } from "@mui/material";
import CustomText from "@/components/text/CustomText";

export default function BetTypeTabs({ tabs, activeTab, onChange }: any) {
  return (
    <Box sx={{ display: "flex", borderBottom: "1px solid #333", height: "42px" }}>
      {Object.keys(tabs).map((tab) => (
        <CustomText
          key={tab}
          onClick={() => onChange(tab)}
          sx={{
            flex: 1,
            textAlign: "center",
            cursor: "pointer",
            color: "#fff",
            borderBottom:
              activeTab === tab ? "3px solid #258d5c" : "3px solid transparent",
          }}
        >
          {tab}
        </CustomText>
      ))}
    </Box>
  );
}
