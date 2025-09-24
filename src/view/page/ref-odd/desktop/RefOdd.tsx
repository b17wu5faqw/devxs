import Img from "@/components/img/Img";
import LotteryTableSection from "@/components/table-data/LotteryTableSection";
import CustomText from "@/components/text/CustomText";
import Flex from "@/components/utils/Flex";
import {
  tables2D,
  tablesGroup,
  tablesFixed,
  tablesRegion,
  tablesSpecial,
} from "@/data/tableData";
import { Box, Typography } from "@mui/material";

function RefOdd() {
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
          Tỷ lệ
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
          <Flex
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
                url={`/images/main/icon_menuVnLotto.png`}
              />
            </Flex>
            <CustomText
              fw="700"
              sx={{
                fontSize: "13px",
                flex: 1,
              }}
            >
              Xổ số Việt Nam
            </CustomText>
          </Flex>
          <Flex
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
                url={`/images/main/icon_VnLottoElec27_pc.png`}
              />
            </Flex>
            <CustomText
              fw="700"
              sx={{
                fontSize: "13px",
                flex: 1,
              }}
            >
              27 Lô KU
            </CustomText>
          </Flex>
          <Flex
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
                url={`/images/main/icon_VnLottoElec_pc.png`}
              />
            </Flex>
            <CustomText
              fw="700"
              sx={{
                fontSize: "13px",
                flex: 1,
              }}
            >
              18 Lô KU
            </CustomText>
          </Flex>
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
          <LotteryTableSection
            title="Bảng tỉ lệ xổ số Việt Nam"
            data={tables2D}
          />
          <LotteryTableSection
            title="Bảng tỉ lệ xổ số Việt Nam"
            data={tablesGroup}
          />
          <LotteryTableSection
            title="Bảng tỉ lệ xổ số Việt Nam"
            data={tablesFixed}
          />
          <LotteryTableSection
            title="Bảng tỉ lệ xổ số Việt Nam"
            data={tablesRegion}
          />
          <LotteryTableSection
            title="Bảng tỉ lệ xổ số Việt Nam"
            data={tablesSpecial}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default RefOdd;
