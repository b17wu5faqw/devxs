import GameItem from "@/components/game/GameItem";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";

function BCT() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <Flex
      sx={{
        padding: "2% 2% 1%",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        gap: " 10px",
      }}
    >
      <GameItem
        img="/images/main/icon_BCT_m.png"
        name="1-M BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="65px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_VnLottoBlock27_m.png"
        name="27 lô BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="50px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_VnLottoBlock18_m.png"
        name="18 lô BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="50px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_Pk10Block_m.png"
        name="PK10 BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="65px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_thLottoBlock_m.png"
        name="Thái Lan BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="45px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_BCTMega6_m.png"
        name="Mage 649 BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="45px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_BCT539_m.png"
        name="539 BCT"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="45px"
        roundHeight="45px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_multiTable_m.png"
        name="Nhiều trò KU"
        live={true}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="55px"
        roundHeight="55px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/longBet.png"
        name="Trường Long"
        live={false}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="50px"
        roundHeight="45px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
    </Flex>
  );
}

export default BCT;
