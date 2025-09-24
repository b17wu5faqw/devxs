import { Button, SxProps, Theme } from "@mui/material";
import React from "react";

type TextProps = React.ComponentPropsWithRef<typeof Button> & {
  sx?: SxProps<Theme>;
  color?: React.CSSProperties["color"];
};

const ButtonConfirm: React.FC<TextProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        width: "fit-content",
        minWidth: "0px",
        background: "#427fd0",
        fontWeight: "500",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "0 10px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        lineHeight: "14px",
        color: "#fff",
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonConfirm;
