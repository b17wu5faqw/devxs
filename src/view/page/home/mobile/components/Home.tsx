import GameItem from "@/components/game/GameItem";
import Flex from "@/components/utils/Flex";
import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";

function Home() {
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
        img="/images/main/vnLotto.png"
        name="XS Việt Nam"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Vietnam.png"
        round={true}
        roundWidth="46px"
        roundHeight="46px"
        roundPosition="top center"
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
      <GameItem
        img="/images/main/K28.png"
        name="Keno 28"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="45px"
        roundHeight="45px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/AnyTimeK5.png"
        name="Xổ số 1-M"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="69px"
        roundHeight="53px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/keno5.png"
        name="Keno 5"
        live={false}
        flag={false}
        flagIcon=""
        round={true}
        roundWidth="45px"
        roundHeight="45px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/At28.png"
        name="Đài Loan 3D"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Taiwan.png"
        round={true}
        roundWidth="60px"
        roundHeight="39px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/At29.png"
        name="Đài Loan 4D"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Taiwan.png"
        round={true}
        roundWidth="57px"
        roundHeight="45px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/At21.png"
        name="Trung Quốc 3D"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_China.png"
        round={true}
        roundWidth="53px"
        roundHeight="43px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
       <GameItem
        img="/images/main/At22.png"
        name="Trung Quốc P3"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_China.png"
        round={true}
        roundWidth="53px"
        roundHeight="43px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/horseRacing.png"
        name="Đua ngựa HK"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Hongkong.png"
        round={true}
        roundWidth="55px"
        roundHeight="55px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_LaoLotto_m.png"
        name="Xổ số Lào"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Laos.png"
        round={true}
        roundWidth="55px"
        roundHeight="55px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_thaiLotto.png"
        name="XS Thái Lan"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Thailand.png"
        round={true}
        roundWidth="45px"
        roundHeight="45px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_fantasy5.svg"
        name="Xổ số US"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_US.png"
        round={true}
        roundWidth="62px"
        roundHeight="60px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/lotto539.png"
        name="Đài Loan 539"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Taiwan.png"
        round={true}
        roundWidth="70px"
        roundHeight="31px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/MarkSix.png"
        name="Mark Six HK"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Hongkong.png"
        round={true}
        roundWidth="70px"
        roundHeight="31px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/lotto49.png"
        name="Đài Loan 649"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Taiwan.png"
        round={true}
        roundWidth="60px"
        roundHeight="31px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/lotto38.png"
        name="Đài Loan 38"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Taiwan.png"
        round={true}
        roundWidth="78px"
        roundHeight="27px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_TOTO.svg"
        name="Singapore TOTO"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Singapore.png"
        round={true}
        roundWidth="36px"
        roundHeight="36px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
      <GameItem
        img="/images/main/icon_anyTime4D_m.svg"
        name="Singapore 4D"
        live={false}
        flag={true}
        flagIcon="/images/main/icon_Singapore.png"
        round={true}
        roundWidth="68px"
        roundHeight="27px"
        roundPosition="top center"
        onClick={() => openModal(MODAL.NETWORK_ERROR)}
      />
    </Flex>
  );
}

export default Home;
