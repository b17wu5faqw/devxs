import React from "react";
import Typography from "@mui/material/Typography";
import {SxProps, Theme} from "@mui/material/styles";
import {baseColors} from "@/utils/colors";

type TextProps = React.ComponentPropsWithRef<typeof Typography> & {
    sx?: SxProps<Theme>;
    fw?: React.CSSProperties["fontWeight"];
    fs?: React.CSSProperties["fontSize"];
    color?: React.CSSProperties["color"];
};
const CustomText: React.FC<TextProps> = ({
                                             children,
                                             sx,
                                             fw,
                                             fs,
                                             ...props
                                         }) => {
    return (
        <Typography
            {...props}
            sx={{
                fontFamily: "Arial",
                fontWeight: fw || "400",
                fontSize: fs || "14px",
                color: baseColors.black,
                ...sx,
            }}
        >
            {children}
        </Typography>
    );
};

export default CustomText;
