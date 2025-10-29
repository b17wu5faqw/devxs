import { useState, useEffect, useCallback } from "react";
import { getBetType, getBetTypeList } from "@/apis/ku-lotto";

export const useBetType = () => {
  const [betTypes, setBetTypes] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<any>(null);
  const [subType, setSubType] = useState<any>(null);

  const fetchBetTypeList = useCallback(async () => {
    const resp = await getBetTypeList();
    if (resp.status === 1) {
      setBetTypes(resp.data);
      const firstTab = Object.keys(resp.data)[0];
      setActiveTab(firstTab);
      setSelectedButton(resp.data[firstTab][0]?.buttons[0] || null);
    }
  }, []);

  useEffect(() => {
    fetchBetTypeList();
  }, [fetchBetTypeList]);

  const fetchBetTypeDetail = useCallback(async () => {
    if (!selectedButton) return;
    const resp = await getBetType({ betTypeId: selectedButton.id });
    if (resp.status === 1) {
      setSubType(resp.data);
    }
  }, [selectedButton]);

  useEffect(() => {
    fetchBetTypeDetail();
  }, [fetchBetTypeDetail]);

  return {
    betTypes,
    activeTab,
    setActiveTab,
    selectedButton,
    setSelectedButton,
    subType,
  };
};
