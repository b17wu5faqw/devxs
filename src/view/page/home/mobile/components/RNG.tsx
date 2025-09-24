import GameItem from "@/components/game/GameItem";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";

function RNG() {
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
        img="/images/main/icon_BCT_m.png"
        name="5D KU"
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
        img="/images/main/icon_SicBoElec_m.png"
        name="F3 KU"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="48px"
        roundHeight="55px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_SicBoFastElec_m.png"
        name="F1 KU"
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
        img="/images/main/icon_SicBoPkElec_m.png"
        name="F2 PK KU"
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
        img="/images/main/icon_KenoElec_m.png"
        name="Keno KU"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="58px"
        roundHeight="52px"
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
        img="/images/main/icon_PickElec_m.png"
        name="11 Chọn 5 KU"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="58px"
        roundHeight="52px"
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
        img="/images/main/icon_ShipElec_m.png"
        name="Ship KU"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="72px"
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
        img="/images/main/icon_Happy10Elec_m.png"
        name="H10 KU"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="60px"
        roundHeight="53px"
        roundPosition="center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
    </Flex>
  );
}

export default RNG;
