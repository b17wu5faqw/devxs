import { Box, Typography } from "@mui/material";
import React from "react";

interface ResultOverlayProps {
  isVisible: boolean;
  winningCodes: string[];
  revealedCodes: string[];
  isAnimating: boolean;
  onClose?: () => void;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({
  isVisible,
  winningCodes,
  revealedCodes,
  isAnimating,
  onClose,
}) => {
  if (!isVisible) return null;

  const positionLabels = ["C.ngàn", "Ngàn", "Trăm", "Chục", "Đ.vị"];
  const displayCodes =
    revealedCodes.length === 5 ? revealedCodes : Array(5).fill("k");

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        width: "800px",
        height: "470px",
        zIndex: 99,
        backgroundColor: "rgb(0 0 0 / 0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "50px",
      }}
    >
      <Box
        sx={{
          width: "500px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "8px",
          padding: "30px 20px",
          textAlign: "center",
          border: "5px solid rgba(255, 255, 255, 0.6)",
          height: "230px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        {displayCodes.map((code, index) => (
          <Box key={index}>
            <Typography
              sx={{
                width: "80px",
                textAlign: "center",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "4px",
                display: "block",
              }}
            >
              {positionLabels[index]}
            </Typography>
            <img
              id={`imgCard_${index}`}
              src={
                code
                  ? `images/anyTimePoker/img_anyTime${code}.svg`
                  : "images/anyTimePoker/img_anyTimeBack.svg"
              }
              alt={`Card ${code || "back"}`}
              className="w-[80px] h-auto"
              onError={(e) => {
                e.currentTarget.src = "images/anyTimePoker/img_anyTimeBack.svg";
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResultOverlay;
