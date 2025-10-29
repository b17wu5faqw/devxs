import { Box } from "@mui/material";

export default function BetTypeButtons({ buttons, selectedId, onSelect }: any) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", padding: "8px" }}>
      {buttons.map((btn: any) => (
        <Box
          key={btn.id}
          onClick={() => onSelect(btn)}
          sx={{
            flex: "0 0 30%",
            margin: "5px",
            padding: "8px",
            textAlign: "center",
            backgroundColor:
              selectedId === btn.id ? "#258d5c" : "rgba(255,255,255,0.2)",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {btn.name}
        </Box>
      ))}
    </Box>
  );
}
