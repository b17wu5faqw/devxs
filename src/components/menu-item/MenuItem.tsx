import { Box, BoxProps } from "@mui/material";
import SubMenuItem from "@/components/menu-item/SubMenuItem";
import { Key } from "react";
import Img from "@/components/img/Img";
import Flex from "@/components/utils/Flex";
import CustomText from "@/components/text/CustomText";
import { baseColors } from "@/utils/colors";
import FlexReverse from "@/components/utils/FlexReverse";
import { useMenuStore } from "@/stores/useMenuStore";

interface Props extends BoxProps {
  img: string;
  name: string;
  flag?: string | null;
  live: boolean;
  subMenu: any;
  parentId: number;
  isActive: boolean;
  onSubMenuClick: any;
  onTimeExpired: () => void;
}

function MenuItem({
  img,
  name,
  flag,
  live,
  subMenu,
  parentId,
  isActive,
  onSubMenuClick,
  onTimeExpired,
  ...props
}: Props) {
  const { activeSubMenuId } = useMenuStore();
  return (
    <Box {...props}>
      <Flex
        sx={{
          background: isActive ? "#f5a13e" : baseColors.bgGray,
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
          cursor: "pointer",
          width: "100%",
        }}
      >
        <Flex
          sx={{
            display: "flex",
            alignItems: "center",
            height: "33px",
            width: "100%",
          }}
        >
          <Flex sx={{ width: "50px" }}>
            <Img
              sx={{ width: "23px", height: "23px", margin: "auto" }}
              url={img}
            />
          </Flex>
          <CustomText
            fw="700"
            sx={{
              fontSize: "13px",
              flex: 1,
            }}
          >
            {name}
          </CustomText>
          {flag && (
            <Img
              sx={{ width: "18px", height: "18px", margin: "auto 12px" }}
              url={flag}
            />
          )}
          {live && (
            <Img
              sx={{ width: "40px", height: "14px", margin: "auto 12px" }}
              url="/images/main/icon_liveHint.png"
            />
          )}
        </Flex>
      </Flex>
      {subMenu && (
        <FlexReverse sx={{ borderTop: "1px solid #ccc" }}>
          {isActive &&
            subMenu
              .filter(
                (item: { id: Key | null | undefined }) =>
                  item.id !== undefined && item.id !== null
              )
              .map(
                (item: {
                  id: number;
                  name: string;
                  time: string;
                  region_id: number;
                  lotto_type: number;
                  active: boolean;
                }) => (
                  <SubMenuItem
                    onClick={() => onSubMenuClick(parentId, item.id, item.region_id)}
                    key={item.id}
                    id={item.id.toString()}
                    name={item.name}
                    time={item.time}
                    regionId={item.region_id}
                    lottoType={item.lotto_type}
                    active={activeSubMenuId === item.id}
                    onTimeExpired={onTimeExpired}
                  />
                )
              )}
        </FlexReverse>
      )}
    </Box>
  );
}

export default MenuItem;
