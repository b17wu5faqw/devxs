import CustomText from "@/components/text/CustomText";
import { MODAL } from "@/constant/modal";
import { useAuthStore } from "@/stores/authStore";
import useBalanceStore from "@/stores/balanceStore";
import useModalStore from "@/stores/modalStore";
import { useEffect, useState } from "react";
import Link from "next/link";

function Header() {
  const openModal = useModalStore((state) => state.openModal);

  const user = useAuthStore((s) => s.user);
  const balanceUser = useBalanceStore((s) => s.balance);
  const [currentTime, setCurrentTime] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const formatTimeGMT8 = () => {
    // Create date object with GMT+8 adjustment
    const date = new Date();
    // GMT+7 is 7 hours ahead of UTC
    const gmt7Date = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    // Format the date
    const day = gmt7Date.getUTCDate().toString().padStart(2, "0");
    const month = (gmt7Date.getUTCMonth() + 1).toString().padStart(2, "0");
    const hours = gmt7Date.getUTCHours().toString().padStart(2, "0");
    const minutes = gmt7Date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = gmt7Date.getUTCSeconds().toString().padStart(2, "0");

    return `GMT+7 ${day}-${month} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    // Set initial time
    setCurrentTime(formatTimeGMT8());

    // Set up interval to update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(formatTimeGMT8());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className="bg-[#30679e] h-[64px] w-full text-base text-white relative">
        <div className="relative w-[1237px]">
          <div className="w-[235px] float-left">
            <img
              className="h-10 float-left mt-3 ml-16"
              alt="logo"
              src="/images/logo/logo.svg"
            />
          </div>
          <ul className="topMenu">
            <li>
              <a href="">Web/TV</a>
            </li>
            <li>
              <span
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    "/lottery-result",
                    "ResultWindow",
                    "width=1100,height=700,resizable=yes,scrollbars=yes"
                  )
                }
              >
                Kết quả
              </span>
            </li>
            <li>
              <a href="">Quy tắc</a>
            </li>
            <li>
              <span
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    "/report/RealList",
                    "ReportWindow",
                    "width=1100,height=700,resizable=yes,scrollbars=yes"
                  )
                }
              >
                Lịch sử đặt cược
              </span>
            </li>
            <li className="chipSet">
              <div
                id="divBetInfo"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`topMenuItem btn_infor ${isHovered ? "hover" : ""}`}
              >
                <a className="btn_rightMenu" href="#">
                  Thông tin cược
                </a>
                <ul className="change_dropdown">
                  <li id="liBetLimit">
                    <span>Giới hạn cược</span>
                  </li>
                  <li id="liRefOdds">
                    <span
                      onClick={() =>
                        window.open(
                          "/ref-odd",
                          "ReportWindow",
                          "width=1100,height=700,resizable=yes,scrollbars=yes"
                        )
                      }
                    >
                      Tỉ lệ
                    </span>
                  </li>
                  <li id="liChipSet">
                    <span>Chọn phỉnh</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div className="float-right mr-5 flex items-center h-[64px]">
            <div className="block w-6 h-6 mr-2.5">
              <img src="/images/common/icon_level1.svg" />
            </div>
            <div>{user?.username}</div>
            <div className="mx-2.5 text-[#F3D929] text-lg cursor-pointer">
              $ {balanceUser}
            </div>
            <div className="flex items-center gap-2">
              <CustomText
                onClick={() => openModal(MODAL.MAKE_TRANSFER)}
                sx={{
                  background:
                    "url(/images/main/icon_transfer.svg) no-repeat center bottom",
                  backgroundSize: "100%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
              />
              <a
                className="h-6 w-6 icon-service block text-[#86c3ff]"
                href=""
              ></a>
            </div>
          </div>
        </div>
        <div className="absolute left-[1252px] bottom-0">
          <img src="/images/common/AdvertBanner.png" />
        </div>
      </div>
      <div className="h-[1px] bg-[#4f82b5]"></div>
      <div className="bg-[#30679e] h-[35px] w-full">
        <div className="w-[1237px]">
          <div className="flex justify-between items-center h-[35px]">
            <div className="pl-10 text-white text-sm">{currentTime}</div>
            <div className="secondMenu flex gap-3">
              <div className="w-[18px] h-[18px] btn_heart cursor-pointer">
                <a href=""></a>
              </div>
              <div className="w-[18px] h-[18px] btn_message cursor-pointer">
                <a href=""></a>
              </div>
              <div className="w-[18px] h-[18px] btn_clear cursor-pointer">
                <a href=""></a>
              </div>
              <div className="w-[18px] h-[18px] btn_setting cursor-pointer relative">
                <a href=""></a>
              </div>
              <div className="w-[18px] h-[18px] btn_righticon cursor-pointer relative">
                <a href=""></a>
              </div>
              <div className="w-[18px] h-[18px] btn_webLine cursor-pointer relative">
                <a href=""></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
