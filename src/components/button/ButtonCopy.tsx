import useDetect from "@/hooks/useDetect";
import { montserrat } from "@/utils/fontG";
import { Button, ButtonProps } from "@mui/material";
import React from "react";

function ButtonCopy(props: ButtonProps) {
  const {isMobile} = useDetect()
  return (
    <Button
      {...props}
      sx={{
        width: "fit-content",
        minWidth: "0px",
        background: "linear-gradient(92.79deg, #b887f4 1.31%, #883fe2 100%)",
        fontWeight: "500",
        fontSize: isMobile ? "3.2vw" : "14px",
        fontFamily: montserrat.style.fontFamily,
        borderRadius: "1000px",
        padding: "0 10px",
        height: "24px",
        display:'flex',
        justifyContent:'center',
        lineHeight:'14px',
        color:'#fff',
        ...props.sx,
      }}
    >
      Copy
    </Button>
  );
}

export default ButtonCopy;
