import {Box, BoxProps} from "@mui/material";
import React, {memo} from "react";

function Flex(props: BoxProps) {
    return (
        <Box
            {...props}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                ...props.sx,
            }}
        >
            {props.children}
        </Box>
    );
}

export default memo(Flex);