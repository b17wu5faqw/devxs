import GameItem from "@/components/game/GameItem";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";

function Live() {
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
        img="/images/main/icon_Anytime_m.png"
        name="Lotto KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="80px"
        roundHeight="72px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_AnytimePoker_m.png"
        name="Live KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="100px"
        roundHeight="75px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_Pk10_m.png"
        name="Đ.Xe KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="100px"
        roundHeight="52px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_49D_L.png"
        name="49D KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="64px"
        roundHeight="64px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_Lotto_m.png"
        name="49 Chọn 6 KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="64px"
        roundHeight="64px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_pK10Poker_m.png"
        name="PK10 KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
        roundWidth="64px"
        roundHeight="64px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_multiTable_m.png"
        name="Nhiều trò KU"
        live={true}
        flag={false}
        flagIcon=""
        round={false}
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

export default Live;
