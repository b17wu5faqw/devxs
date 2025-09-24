import { create } from "zustand";

interface MenuState {
  scheduleId: number | null;
  setScheduleId: (id: number) => void;
  regionId: number | null;
  setRegionId: (id: number) => void;
  typeId: number | null;
  setTypeId: (id: number) => void;
  activeMenuId: number | null;
  activeSubMenuId: number | null;
  setActiveMenu: (menuId: number) => void;
  setActiveSubMenu: (subMenuId: number) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  scheduleId: 1,
  setScheduleId: (id) => set({ scheduleId: id }),
  regionId: 1,
  setRegionId: (id) => set({ regionId: id }),
  typeId: 1,
  setTypeId: (id) => set({ typeId: id }),
  activeMenuId: 1,
  activeSubMenuId: 1,
  setActiveMenu: (menuId) => set({ activeMenuId: menuId }),
  setActiveSubMenu: (subMenuId) => set({ activeSubMenuId: subMenuId }),
}));
