import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../utils/FlexReverse";
import CustomText from "../text/CustomText";
import { useCallback, useEffect, useState } from "react";
import { getVnLotto } from "@/apis/menu";
import Menu from "../menu-item/mobile/Menu";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/stores/useMenuStore";

interface MenuItemType {
  id: number;
  lotto_type: number;
  region_id: number;
  name: string;
  time: string;
}

function PopupGame() {
  const { setScheduleId, setRegionId, setTypeId } = useMenuStore();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const isOpen = useModalStore((state) => state.isModalOpen(MODAL.GAME));
  const closeModal = useModalStore((state) => state.closeModal);
  const handleClose = () => {
    closeModal();
  };

  const router = useRouter();

  const handleNavigate = (id: number, region_id: number) => {
    closeModal();
    setScheduleId(id);
    setRegionId(region_id);
    setTypeId(1);
    router.push(`/game/VnLotto/${id}`);
  };

  const handleTimerZero = useCallback(() => {
    setShouldRefetch(true);
  }, []);

  const [vnLottoMenu, setVnLottoMenu] = useState<MenuItemType[]>([]);

  const fetch = useCallback(async () => {
    const resp = await getVnLotto();
    setVnLottoMenu(resp.data);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (shouldRefetch) {
      fetch();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, fetch]);

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: "8px",
          width: { xs: "100vw", md: "310px" },
          maxHeight: { xs: "100dvh", md: "90vh" },
          background:
            "linear-gradient(137.93deg, rgba(97,206,255,.024) 7.21%,#f6faff 49.31%,rgba(97,206,255,.024) 96.05%),#fff",
          position: "relative",
          overflow: "hidden",
        },
      }}
      open={isOpen}
      TransitionComponent={Grow}
      onClose={handleClose}
    >
      <Box
        onClick={handleClose}
        sx={{
          background: "url(/images/main/Pop_btn_close.svg) no-repeat center",
          position: "absolute",
          top: "-40px",
          right: "5px",
          width: "30px",
          height: "30px",
          backgroundSize: "100%",
          cursor: "pointer",
          opacity: "0.8",
        }}
      />
      <FlexReverse
        sx={{
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <CustomText
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            color: "#fff",
            padding: "10px",
            backgroundColor: "#206B61",
          }}
        >
          Xổ Số Việt Nam
        </CustomText>
        <Box sx={{ textAlign: "center", padding: "20px" }}>
          {vnLottoMenu.map((item) => (
            <Menu
              key={item.id}
              id={item.id.toString()}
              name={item.name}
              time={item.time}
              img="icon_Vietnam.png"
              lottoType={item.lotto_type}
              onClick={() => handleNavigate(item.id, item.region_id)}
              onTimerZero={handleTimerZero}
            />
          ))}
        </Box>
      </FlexReverse>
    </Dialog>
  );
}

export default PopupGame;
