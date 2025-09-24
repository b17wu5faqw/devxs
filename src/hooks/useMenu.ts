import { getHotMenu, getHotMenuV2 } from "@/apis/menu";
import { useCallback, useEffect, useState } from "react";

export interface MenuDetails {
  id: number;
  name: string;
  img: string;
  flag: string;
  subMenu: any[];
}

const useFetchMenu = () => {
  const [listHotMenu, setListHotMenu] = useState<MenuDetails[]>([]);

  const fetchHotMenu = useCallback(async () => {
    try {
      const resp = await getHotMenuV2();
      const data = resp.data;
      if (resp.data.status === 1) {
        let arr: any = [];

        data.Data.forEach((item: any) => {
          arr.push({
            ...item,
          });
        });
        setListHotMenu(arr);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchHotMenu();
  }, [fetchHotMenu]);
  return { listHotMenu };
};

export default useFetchMenu;
