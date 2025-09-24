import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

function Footer() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);

  return (
    <Flex
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "55px",
        background: "#000",
        color: "white",
        borderTop: "1px solid #3f3f3f",
        padding: "5px",
        justifyContent: "center",
        zIndex: 99,
      }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          width: "25%",
        }}
        onClick={() => openModal(MODAL.MAKE_TRANSFER)}
      >
        <Box
          sx={{
            backgroundImage: "url(/images/main/btn_transfer.svg)",
            backgroundSize: "22px auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            width: "22px",
            height: "22px",
          }}
        />
        <CustomText sx={{ color: "#fff" }}>Chuyển quỹ</CustomText>
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          width: "25%",
        }}
      >
        <Box
          sx={{
            backgroundImage: "url(/images/main/btn_bell.svg)",
            backgroundSize: "22px auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            width: "22px",
            height: "22px",
          }}
        />
        <CustomText sx={{ color: "#fff" }}>T.Báo</CustomText>
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          width: "25%",
        }}
      >
        <Box
          sx={{
            backgroundImage: "url(/images/main/btn_betRecord.svg)",
            backgroundSize: "22px auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            width: "22px",
            height: "22px",
          }}
          onClick={() => router.push(`/history`)}
        />
        <CustomText sx={{ color: "#fff" }}>Đơn cược</CustomText>
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          width: "25%",
        }}
      >
        <Box
          sx={{
            backgroundImage: "url(/images/main/btn_betting.png)",
            backgroundSize: "22px auto",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            width: "22px",
            height: "22px",
          }}
        />
        <CustomText sx={{ color: "#fff" }}>Thông tin</CustomText>
      </Flex>
    </Flex>
  );
}

export default Footer;
