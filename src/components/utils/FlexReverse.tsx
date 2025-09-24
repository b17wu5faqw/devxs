import { Box, BoxProps, } from "@mui/material";
import { memo } from "react";

function FlexReverse(props: BoxProps) {
    return (
        <Box
            {...props}
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                ...props.sx,
            }}

        >
            {props.children}
        </Box>
    );
}

export default memo(FlexReverse);