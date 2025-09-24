import React from "react";
import { SxProps, Theme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { montserrat } from "@/utils/fontG";
import { baseColors } from "@/utils/colors";
import CustomText from "../text/CustomText";

type TextProps = React.ComponentPropsWithRef<typeof Button> & {
  sx?: SxProps<Theme>;

  color?: React.CSSProperties["color"];
};

const CustomButton: React.FC<TextProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        fontSize: "0.75rem",
        textTransform: "uppercase",
        fontWeight: "600",
        backgroundColor: baseColors.bgGray,
        color: baseColors.black,
        width: "115px",
        lineHeight: "30px",
        padding: "0px",
        borderRadius: "0px",
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

export const ChipButton: React.FC<TextProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        padding: "0px",
        borderRadius: "0px",
        height: "54px",
        fontSize: "0.8em",
        position: "relative",
        cursor: "pointer",
        width: "16.66666%",
        minWidth: "16.66666%",
        ...sx,
      }}
    >
      <CustomText
        sx={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          top: "51%",
          left: "49%",
          margin: "auto",
          fontWeight: "bold",
        }}
      >
        {children}
      </CustomText>
    </Button>
  );
};

export const CustomButton2: React.FC<TextProps> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Button
      {...props}
      sx={{
        borderRadius: "0px",
        width: "96px",
        height: "30px",
        padding: "0",
        fontSize: "13px",
        fontWeight: "bold",
        textTransform: "unset",
        "&:hover": { filter: "brightness(1.2)" },
        color: baseColors.black,
        background: "url('/images/lotto/btn_submenu.png') no-repeat",
        backgroundPosition: "top",
        letterSpacing: "-1px",
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export const CustomButton3: React.FC<TextProps> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Button
      {...props}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        borderRadius: "1000px",
        height: "36px",
        padding: "0 16px",
        fontSize: "14px",
        fontWeight: "600",
        textTransform: "inherit",
        "&:hover": { filter: "brightness(1.2)" },
        transition: "0.2s",
        color: baseColors.white,
        background: baseColors.bg2,
        fontFamily: montserrat.style.fontFamily,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};
