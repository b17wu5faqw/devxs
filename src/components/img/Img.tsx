import {Grid2, SxProps, Theme} from "@mui/material";
import React from "react";
import Flex from "../utils/Flex";

function Img({url, sx}: { url: string; sx: SxProps<Theme> }) {
    return (
        <Grid2 sx={{...sx, flexShrink: "0"}}>
            <Flex
                sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    justifyContent: "center",
                    transition: "0.2s",
                }}
            >
                <img
                    draggable="false"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "0.2s",
                        objectPosition: "center",
                    }}
                    src={url}
                    alt=""
                />
            </Flex>
        </Grid2>
    );
}

export default React.memo(Img);