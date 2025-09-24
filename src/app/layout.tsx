import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/layout/MainLayout";
import { Box } from "@mui/material";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "KU XỔ SỐ",
  description: "Lottery App",
};

const isMaintain = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isMaintain) {
    return (
      <html lang="en">
        <body>
          <Box
            sx={{
              minHeight: "100vh",
              background: "#222",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Box sx={{ fontSize: "2em", fontWeight: "bold", mb: 2 }}>
              Bảo trì hệ thống
            </Box>
            <Box sx={{ fontSize: "1.2em" }}>
              Trang đang được bảo trì. Vui lòng quay lại sau!
            </Box>
          </Box>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <MainLayout>{children}</MainLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
