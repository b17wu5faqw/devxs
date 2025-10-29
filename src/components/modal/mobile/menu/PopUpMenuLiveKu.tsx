import { MODAL } from "@/constant/modal";
import useModalStore from "@/stores/modalStore";
import { Box, Dialog, Grow } from "@mui/material";
import FlexReverse from "../../../utils/FlexReverse";
import { useCallback, useEffect, useState } from "react";
import CustomText from "../../../text/CustomText";
import { getVnLotto } from "@/apis/menu";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/stores/useMenuStore";

interface MenuItemType {
  id: number;
  lotto_type: number;
  region_id: number;
  name: string;
  time: string;
  server_time: string;
}

// Mock data for LIVE tab rendering
const mockLiveSections = [
  {
    title: "Live KU",
    items: [
      {
        id: 166,
        name: "Live A",
        banner:
          "https://cuvnin2.gs3168.com/images/graph/common/bannerAtPoker_A.png",
        href: "/game/AnyTimePoker/166",
        time: "00 : 00",
        timeColor: undefined as string | undefined,
        isClosed: false,
        maintain: false,
      },
      {
        id: 167,
        name: "Live B",
        banner:
          "https://cuvnin2.gs3168.com/images/graph/common/bannerAtPoker_B.png",
        href: "/game/AnyTimePoker/167",
        time: "00 : 00",
        timeColor: undefined as string | undefined,
        isClosed: false,
        maintain: false,
      },
    ],
  },
  {
    title: "Lotto KU",
    items: [
      {
        id: 162,
        name: "Lotto A",
        banner: "https://cuvnin2.gs3168.com/images/graph/common/bannerA.png",
        href: "/game/AnyTime/162",
        time: "00 : 07",
        timeColor: undefined as string | undefined,
        isClosed: false,
        maintain: false,
      },
      {
        id: 164,
        name: "Lotto C",
        banner: "https://cuvnin2.gs3168.com/images/graph/common/bannerC.png",
        href: "/game/AnyTime/164",
        time: "02 : 08",
        timeColor: "rgb(20, 134, 71)",
        isClosed: false,
        maintain: false,
      },
    ],
  },
];

function PopUpMenuLiveKu() {
  const { setScheduleId, setRegionId, setTypeId } = useMenuStore();
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [activeTab, setActiveTab] = useState<"LIVE" | "BCT" | "HOME">("LIVE");
  const isOpen = useModalStore((state) =>
    state.isModalOpen(MODAL.MENU_LIVE_KU)
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const handleClose = () => {
    closeModal();
  };

  const router = useRouter();

  const handleNavigate = (href: string, name: string) => {
    closeModal();
    router.push(href);
  };

  const handleTimerZero = useCallback(() => {
    setShouldRefetch(true);
  }, []);

  const [liveKuMenu, setLiveKuMenu] = useState<MenuItemType[]>([]);

  const fetch = useCallback(async () => {
    const resp = await getVnLotto();
    setLiveKuMenu(resp.data);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetch();
    }
  }, [isOpen, fetch]);

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
        <Box
          className="Game_menu_title mMenuTitle"
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            textAlign: "center",
            color: "#fff",
            padding: "10px 0 0",
            minHeight: "50px",
            backgroundColor: "#206B61",
            "& ul": {
              width: "100%",
              margin: "0 auto",
              padding: 0,
              listStyle: "none",
            },
            "& ul li": {
              position: "relative",
              width: "30%",
              float: "left",
              opacity: 0.8,
              margin: 0,
              padding: 0,
              listStyle: "none",
              lineHeight: "40px",
              cursor: "pointer",
            },
            "& ul li.on": {
              opacity: 1,
            },
            "& ul li.on::after": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "5px",
              margin: "auto",
              width: "64%",
              height: "3px",
              backgroundColor: "#fff",
            },
            // Clear floats
            "&::after": {
              content: '""',
              display: "block",
              clear: "both",
            },
          }}
        >
          <ul>
            <li
              id="btnCategory_Video"
              className={`anchorAnyTime ${
                activeTab === "LIVE" ? "on" : ""
              } !font-bold`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("LIVE");
              }}
              // active class controlled below using state
              data-active={undefined}
            >
              LIVE
            </li>
            <li
              id="btnCategory_Block"
              className={`${activeTab === "BCT" ? "on" : ""} !font-bold`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("BCT");
              }}
            >
              BCT / RNG
            </li>
            <li
              id="btnCategory_Official"
              className={`${activeTab === "HOME" ? "on" : ""} !font-bold`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("HOME");
              }}
            >
              Trang chủ
            </li>
          </ul>
        </Box>
        <Box sx={{ textAlign: "center", padding: "20px" }}>
          {/* Tabs content */}
          {/* LIVE */}
          {activeTab === "LIVE" && (
            <div className="Game_menu_in Game_menu_m">
              <div id="divMenuList_Video">
                {mockLiveSections.map((section) => (
                  <div key={section.title}>
                    <div className="Game_menuT_Text">{section.title}</div>
                    <div style={{ display: "block" }}>
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="Game_menuT_List"
                          onClick={() => handleNavigate(item.href, item.name)}
                        >
                          <div className="logo girls">
                            <img src={item.banner} />
                            <span className="girlsText"></span>
                          </div>
                          <div className="dataBox">
                            <div className="name !text-[18.24px] text-start font-bold">
                              {item.name}
                            </div>
                            <div className="text-[17.328px] text-[#f00] text-start px-1 mt-2">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* BCT / RNG */}
          {activeTab === "BCT" && (
            <CustomText sx={{ color: "#206B61" }}>BCT / RNG</CustomText>
          )}
          {/* Trang chủ */}
          {activeTab === "HOME" && (
            <CustomText sx={{ color: "#206B61" }}>Trang chủ</CustomText>
          )}
        </Box>
        <style jsx global>{`
          .Game_menu_m .Game_menuT_Text {
            margin: 3% 0 0 10%;
            font-weight: bold;
          }
          .Game_menuT_Text {
            margin-top: 9px;
            margin-left: 8px;
            margin-bottom: -9px;
            text-align: left;
            font-size: 0.87em;
            color: #000;
            position: relative;
            font-weight: bold;
          }
          .Game_menuT_Text:before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #000;
            top: 50%;
            left: -8px;
            transform: translate(-100%, -50%);
          }
          @media (min-width: 400px) {
            .Game_menu_m .Game_menuT_List {
              height: 80px !important;
              minheight: 80px !important;
              margin-top: 10px;
              margin-bottom: 10px;
            }
          }
          @media (min-width: 350px) {
            .Game_menu_m .Game_menuT_List {
              height: 70px !important;
              minheight: 70px !important;
            }
          }
          .Game_menu_m .Game_menuT_List {
            display: flex;
            box-sizing: border-box;
            align-items: center;
            height: 60px;
            border-radius: 6px;
            background-color: #dde8e2;
            margin-top: 10px;
            line-height: normal;
          }
          @media (min-width: 400px) {
            .Game_menuList,
            .Game_menuT_List {
              height: 50px;
              line-height: 50px;
              font-size: 0.95em;
            }
          }
          .Game_menuList,
          .Game_menuT_List {
            position: relative;
            text-align: center;
            line-height: 48px;
            height: 48px;
            font-size: 0.9em;
            border-top: #eeeeee solid 1px;
            z-index: 2;
          }
          .Game_menu_m .Game_menuT_List .logo.girls {
            height: 100%;
          }
          .Game_menu_m .Game_menuT_List .logo {
            float: left;
            position: relative;
            width: 42%;
          }
          .Game_menu_m .Game_menuT_List .logo.girls img {
            width: auto;
            height: 100%;
          }
          @media (min-width: 400px) {
            .Game_menu_m .Game_menuT_List .logo img {
              width: 46px;
            }
          }
          @media (min-width: 400px) {
            .Game_menu_m .Game_menuT_List .logo.girls .girlsText {
              height: 22px;
            }
          }
          @media (min-width: 380px) {
            .Game_menu_m .Game_menuT_List .logo.girls .girlsText {
              width: 64%;
            }
          }
          @media (min-width: 350px) {
            .Game_menu_m .Game_menuT_List .logo.girls .girlsText {
              width: 70%;
              height: 20px;
            }
          }
          .Game_menu_m .Game_menuT_List .logo.girls .girlsText {
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            bottom: 0;
            width: 80%;
            max-width: 100px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            border-radius: 30px;
            color: #fff;
            font-size: 0.7em;
          }
          .Game_menu_m .Game_menuT_List .dataBox {
            float: right;
            width: 45%;
            padding-left: calc(6px + 5%);
          }
          @media (min-width: 400px) {
            .Game_menu_m .Game_menuT_List .name,
            .Game_menu_m .Game_menuT_List .time,
            .Game_menu_m .Game_menuT_List .icon_maintain {
              height: 22px;
              line-height: 22px;
            }
          }
          .Game_menu_m .Game_menuT_List .name,
          .Game_menu_m .Game_menuT_List .time,
          .Game_menu_m .Game_menuT_List .icon_maintain {
            display: table;
            margin: 0;
            padding: 0px 4px;
            float: none;
            width: auto;
            height: 20px;
            line-height: 20px;
            text-align: left;
          }
          .Game_menu_m .Game_menuT_List .time > span,
          .Game_menu_m .Game_menuT_List .time > div {
            color: #f00;
          }
        `}</style>
        {/* LiveKU 播放弹窗由 Hot.tsx 全局挂载，这里无需再渲染 */}
      </FlexReverse>
    </Dialog>
  );
}

export default PopUpMenuLiveKu;
