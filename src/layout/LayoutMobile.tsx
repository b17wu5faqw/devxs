
import { Box } from "@mui/material";
import { ReactNode } from "react";

function LayoutMobile({ children }: { children: ReactNode }) {
  return (
    <>
      <Box sx={{ backgroundColor: "#111", height: "100vh" }}>{children}</Box>
    </>
  );
}

export default LayoutMobile;
