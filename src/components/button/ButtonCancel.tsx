import { Button, SxProps, Theme } from "@mui/material";
import React from "react";

type TextProps = React.ComponentPropsWithRef<typeof Button> & {
  sx?: SxProps<Theme>;
  color?: React.CSSProperties["color"];
};

const ButtonCancel: React.FC<TextProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        width: "fit-content",
        minWidth: "0px",
        background: "#bbb",
        fontWeight: "500",
        fontSize: "14px",
        borderRadius: "8px",
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

export default ButtonCancel;
