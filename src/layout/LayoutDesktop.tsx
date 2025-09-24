import { useAuthStore } from "@/stores/authStore";
import { ReactNode } from "react";
import Header from "./header/Header";
import PopupMakeTransfer from "@/components/modal/PopupMakeTransfer";

function LayoutDesktop({ children }: { children: ReactNode }) {
  const { accessToken } = useAuthStore();

  return (
    <div>
      {accessToken && <Header />}
      {children}
      <PopupMakeTransfer />
    </div>
  );
}

export default LayoutDesktop;
