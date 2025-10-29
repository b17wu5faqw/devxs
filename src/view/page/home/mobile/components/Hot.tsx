import GameItem from "@/components/game/GameItem";
import PopUpMenuKuLive from "@/components/modal/mobile/menu/PopUpMenuKuLive";
import PopUpMenuLiveKu from "@/components/modal/mobile/menu/PopUpMenuLiveKu";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import { useAuthStore } from "@/stores/authStore";
import useModalStore from "@/stores/modalStore";

function Hot() {
  const openModal = useModalStore((state) => state.openModal);
  const user = useAuthStore((s) => s.user);

  const handleGameClick = () => {
    if (user?.agency_id === 1) {
      openModal(MODAL.GAME_LO);
    } else {
      openModal(MODAL.NETWORK_ERROR);
    }
  };

  return (
    <>
      <Flex
        sx={{
          padding: "2% 2% 1%",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: " 10px",
        }}
      >
        <GameItem
          img="/images/main/icon_Anytime_m.png"
          name="Lotto KU"
          live={true}
          flag={false}
          flagIcon=""
          round={false}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.MENU_KU_LIVE)}
        />
        <GameItem
          img="/images/main/icon_AnytimePoker_m.png"
          name="Live KU"
          live={true}
          flag={false}
          flagIcon=""
          round={false}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.MENU_LIVE_KU)}
        />
        <GameItem
          img="/images/main/vnLotto.png"
          name="XS Việt Nam"
          live={false}
          flag={true}
          flagIcon="/images/main/icon_Vietnam.png"
          round={true}
          roundWidth="46px"
          roundHeight="46px"
          roundPosition="top center"
          onClick={() => openModal(MODAL.GAME)}
        />
        <GameItem
          img="/images/main/icon_VnLottoElec27_m.png"
          name="27 lô KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={handleGameClick}
        />
        <GameItem
          img="/images/main/icon_VnLottoElec_m.png"
          name="18 lô KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={handleGameClick}
        />
        <GameItem
          img="/images/main/icon_SicBoRWElec_m.png"
          name="Xóc Đĩa KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.NETWORK_ERROR)}
        />
        <GameItem
          img="/images/main/icon_GoalElec_m.png"
          name="Cầu Môn KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.NETWORK_ERROR)}
        />
        <GameItem
          img="/images/main/icon_pipeElec_m.png"
          name="Ống nước KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.NETWORK_ERROR)}
        />
        <GameItem
          img="/images/main/icon_HrElec_m.png"
          name="Đua ngựa KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.NETWORK_ERROR)}
        />
        <GameItem
          img="/images/main/icon_RPSElec_m.png"
          name="Oẳn tù tì KU"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="55px"
          roundHeight="55px"
          roundPosition="center"
          onClick={() => openModal(MODAL.NETWORK_ERROR)}
        />
        <GameItem
          img="/images/main/keno.png"
          name="Keno"
          live={false}
          flag={false}
          flagIcon=""
          round={true}
          roundWidth="71px"
          roundHeight="33px"
          roundPosition="top center"
          onClick={() => openModal(MODAL.NETWORK_ERROR)}
        />
      </Flex>
      <PopUpMenuLiveKu />
      <PopUpMenuKuLive />
    </>
  );
}

export default Hot;
