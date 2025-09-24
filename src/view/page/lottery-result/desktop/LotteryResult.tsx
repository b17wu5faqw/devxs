import { getAllScheduler } from "@/apis/result";
import Flex from "@/components/utils/Flex";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ResultTable } from "./components/ResultTable";
import Img from "@/components/img/Img";
import CustomText from "@/components/text/CustomText";

interface MenuItem {
  id: number;
  name: string;
  img: string;
  subMenu: SubMenuItem[];
}

interface SubMenuItem {
  id: number;
  lotto_type: number;
  name: string;
}

function LotteryResult() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<number>(1);
  const [selectedSchedulerId, setSelectedSchedulerId] = useState<number>(1);
  const [selectedLottoType, setSelectedLottoType] = useState<number>(1);
  const [isCollapsed, setIsCollapsed] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSchedulers = async () => {
      try {
        const response = await getAllScheduler();
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to fetch schedulers:", error);
      }
    };

    fetchSchedulers();
  }, []);

  const handleMenuClick = (menuId: number) => {
    setIsCollapsed((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleSubMenuClick = (schedulerId: number, lottoType: number) => {
    setSelectedSchedulerId(schedulerId);
    setSelectedLottoType(lottoType);
  };

  return (
    <Box
      sx={{ height: "100vh", backgroundColor: "#e5e5e5", overflowY: "hidden" }}
    >
      <Flex
        sx={{
          backgroundColor: "#30679f",
          height: "80px",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#fff", mb: 0 }}
        >
          Kết quả
        </Typography>
      </Flex>
      <Flex sx={{ gap: "5px", alignItems: "flex-start" }}>
        <Box
          className="custom-scrollbar"
          sx={{
            width: "200px",
            flexShrink: 0,
            backgroundColor: "#fff",
            borderRight: "1px solid #eee",
            overflowY: "scroll",
            maxHeight: "630px",
          }}
        >
          {menuItems.map((menu) => (
            <div key={menu.id}>
              <Flex
                onClick={() => handleMenuClick(menu.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "33px",
                  width: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Flex sx={{ width: "50px" }}>
                  <Img
                    sx={{ width: "23px", height: "23px", margin: "auto" }}
                    url={`/images/main/${menu.img}`}
                  />
                </Flex>
                <CustomText
                  fw="700"
                  sx={{
                    fontSize: "13px",
                    flex: 1,
                  }}
                >
                  {menu.name}
                </CustomText>
              </Flex>

              <List
                sx={{
                  maxHeight: isCollapsed[menu.id] ? "0px" : "1000px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                  paddingY: 0,
                }}
              >
                {menu.subMenu.map((subMenu) => (
                  <ListItem
                    key={subMenu.id}
                    onClick={() =>
                      handleSubMenuClick(subMenu.id, subMenu.lotto_type)
                    }
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      backgroundColor:
                        selectedSchedulerId === subMenu.id
                          ? "#ffefa7"
                          : "inherit",
                      "&:hover": {
                        backgroundColor: "#ffefa7",
                        "& .MuiTypography-root": {
                          color: "#007fff",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: ".8rem",
                        transition: "color 0.2s ease",
                        color:
                          selectedSchedulerId === subMenu.id
                            ? "#007fff"
                            : "inherit",
                      }}
                    >
                      {subMenu.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </Box>
        <Box
          className="custom-scrollbar"
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            overflowY: "scroll",
            maxHeight: "630px",
          }}
        >
          <ResultTable
            lottoType={selectedLottoType}
            schedulerId={selectedSchedulerId}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default LotteryResult;
