import { Box, BoxProps } from "@mui/material";
import React from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

function ButtonBack(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
        top: "16px",
        left: "16px",
        width: "36px",
        flexShrink: "0",
        aspectRatio: "1/1",
        borderRadius: "50%",
        cursor: "pointer",
        "&:hover": { filter: "brightness(1.2)" },
        border: "1px solid rgba(93,94,101,.2)",
        background:
          "linear-gradient(180deg,rgba(60,65,73,.2),rgba(84,90,100,.2))",
        ...props.sx,
      }}
    >
      <KeyboardArrowLeftIcon sx={{ color: "#fff", fontSize: "30px" }} />
    </Box>
  );
}

export default ButtonBack;
