"use client";
import MenuItem from "@/components/menu-item/MenuItem";
import { liveMenu } from "@/view/page/home/desktop/sidebar/data/menu";
import Flex from "@/components/utils/Flex";
import FlexReverse from "@/components/utils/FlexReverse";
import { baseColors } from "@/utils/colors";
import CustomText from "@/components/text/CustomText";
import TitleHead from "@/components/sidebar/TitleHead";
import { useCallback, useEffect, useState } from "react";
import { getHotMenu } from "@/apis/menu";
import { useMenuStore } from "@/stores/useMenuStore";
import useModalStore from "@/stores/modalStore";
import { MODAL } from "@/constant/modal";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

function Sidebar() {
  const openModal = useModalStore((state) => state.openModal);
  const [isHotMenuVisible, setHotMenuVisible] = useState(true);
  const [isLiveMenuVisible, setLiveMenuVisible] = useState(true);
  const [isActive, setIsActive] = useState<number | null>(1);
  const [reloadMenu, setReloadMenu] = useState(false);
  const router = useRouter();
  const {
    activeMenuId,
    activeSubMenuId,
    setActiveMenu,
    setActiveSubMenu,
    setRegionId,
  } = useMenuStore();
  const { accessToken } = useAuthStore();

  interface MenuItemType {
    id: number;
    img: string;
    name: string;
    flag?: string;
    live: boolean;
    subMenu: any[];
  }

  const [hotMenu, setHotMenu] = useState<MenuItemType[]>([]);

  const fetch = useCallback(async () => {
    const resp = await getHotMenu({ jwt_key: accessToken || "" });
    setHotMenu(resp.data);
    if (!activeMenuId && resp.data && resp.data.length > 0) {
      setActiveMenu(resp.data[0].id);
    }
    if (activeSubMenuId === null || activeSubMenuId === undefined) {
      setActiveSubMenu(0);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (
      activeMenuId &&
      (activeSubMenuId === null || activeSubMenuId === undefined)
    ) {
      setActiveSubMenu(0);
    }
  }, [activeMenuId, activeSubMenuId, setActiveSubMenu]);

  useEffect(() => {
    if (reloadMenu) {
      fetch();
      setReloadMenu(false);
    }
  }, [reloadMenu, fetch]);

  const handleTimeExpired = () => {
    setReloadMenu(true);
  };

  const toggleHotMenu = (type: number) => {
    if (type === 1) {
      setHotMenuVisible((prev) => !prev);
    }
    if (type === 2) {
      setLiveMenuVisible((prev) => !prev);
    }
  };

  const handleSubMenuClick = (
    menuId: number,
    subMenuId: number,
    regionId: number
  ) => {
    setIsActive(menuId);
    setActiveMenu(menuId);
    setActiveSubMenu(subMenuId);
    setRegionId(regionId);
  };

  const handleMenuClick = (menuId: number, subMenus: any[]) => {
    setIsActive(menuId);
    setActiveMenu(menuId);
  };

  return (
    <FlexReverse
      sx={{ width: "230px", height: "100%", padding: "5px 0 0 5px" }}
    >
      <Flex
        sx={{
          background: baseColors.bgBlue,
          height: "35px",
          lineHeight: "35px",
          fontWeight: "600",
          border: "1px solid #3474b4",
        }}
      >
        <CustomText
          sx={{
            background: "url(/images/main/icon_listShow.svg) no-repeat center;",
            backgroundSize: "18px 18px",
            width: "50px",
            height: "35px",
            float: "left",
            opacity: "0.3",
            cursor: "pointer",
          }}
        ></CustomText>
        <CustomText
          sx={{
            fontSize: "13px",
            color: baseColors.white,
            fontWeight: "600",
            flex: "1",
          }}
        >
          KU XỔ SỐ
        </CustomText>
        <CustomText
          sx={{
            background: "url(/images/main/btn_arrow_w.svg) no-repeat center;",
            backgroundSize: "20px 20px",
            transform: "rotate(180deg)",
            width: "40px",
            height: "35px",
            float: "right",
            opacity: "0.3",
            cursor: "pointer",
          }}
        ></CustomText>
      </Flex>
      <TitleHead
        onClick={() => toggleHotMenu(1)}
        name="HOT"
        active={isHotMenuVisible}
      />
      {isHotMenuVisible &&
        hotMenu.map((item) => (
          <MenuItem
            parentId={item.id}
            isActive={item.id === isActive}
            onSubMenuClick={handleSubMenuClick}
            key={item.id}
            img={`/images/main/${item.img}`}
            name={item.name}
            flag={item.flag ? `/images/main/${item.flag}` : ``}
            live={item.live}
            subMenu={item.subMenu}
            onTimeExpired={handleTimeExpired}
            onClick={() => {
              if (item.id === 6) {
                handleMenuClick(item.id, item.subMenu);
                router.push("sicbo");
              } else if (item.subMenu && item.subMenu.length > 0) {
                handleMenuClick(item.id, item.subMenu);
              } else {
                openModal(MODAL.NETWORK_ERROR);
              }
            }}
            // onClick={() =>
            //   item.subMenu && item.subMenu.length > 0
            //     ? handleMenuClick(item.id, item.subMenu)
            //     : openModal(MODAL.NETWORK_ERROR)
            // }
          />
        ))}
      <TitleHead
        onClick={() => toggleHotMenu(2)}
        name="LIVE"
        active={isLiveMenuVisible}
      />
      {isLiveMenuVisible &&
        liveMenu.map((item) => (
          <MenuItem
            parentId={item.id}
            isActive={activeMenuId === item.id}
            onSubMenuClick={handleSubMenuClick}
            key={item.id}
            img={`/images/main/${item.img}`}
            name={item.name}
            flag={item.flag ? `/images/main/${item.flag}` : ``}
            live={item.live}
            subMenu={item.subMenu}
            onTimeExpired={handleTimeExpired}
          />
        ))}
    </FlexReverse>
  );
}

export default Sidebar;
