import { Box, Input } from "@mui/material";
import CustomText from "@/components/text/CustomText";

interface InputType1Props {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputType1: React.FC<InputType1Props> = ({ input, onChange }) => {
  return (
    <>
      <textarea
        style={{
          height: "119px",
          margin: "0 2%",
          width: "96%",
          backgroundColor: "#ecfff6",
          padding: "2% 3%",
          marginBottom: "-4px",
          color: "#595959",
          fontSize: "1.1em",
          border: 0,
          resize: "none",
        }}
        placeholder="Nhập số đặt cược"
        value={input}
        onChange={onChange}
      />
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          padding: "1px 0",
        }}
      >
        <Box sx={{ width: "96%", margin: "6px auto", height: "29px" }}>
          <Box
            sx={{
              position: "static",
              width: "25%",
              marginRight: "1.5%",
              height: "30px",
              lineHeight: "30px",
              textAlign: "center",
              fontSize: "1em",
              marginBottom: "3px",
              border: "#3b5247 1px solid",
              borderRadius: "3px",
              color: "#fff",
              float: "left",
            }}
          >
            Số nóng
          </Box>
          <Box
            sx={{
              width: "47%",
              marginRight: "0.5%",
              position: "relative",
              float: "left",
            }}
          >
            <Input
              sx={{
                backgroundColor: "#ecfff6",
                color: "#595959",
                border: 0,
                borderRadius: "0",
                width: "100%",
                height: "30px",
                float: "left",
                padding: "0 2.5%",
              }}
              placeholder="Nhập số lật bài"
            />
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.3)",
              width: "25%",
              borderRadius: 0,
              float: "left",
              marginLeft: "1%",
              height: "30px",
              lineHeight: "30px",
              color: "#fff",
              textAlign: "center",
              fontSize: "1em",
              cursor: "pointer",
              border: 0,
              padding: 0,
            }}
          >
            Lật bài
          </Box>
        </Box>
      </Box>
      <CustomText
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#ffcc00",
          fontSize: "0.75em",
          padding: "8px 3.5%",
        }}
      >
        ※Mỗi tổ hợp hãy dùng khoảng trắng, dấu phẩy, chấm phẩy để cách ra
      </CustomText>
      <CustomText
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#ffcc00",
          fontSize: "0.75em",
          padding: "0 3.5% 8px 3.5%",
        }}
      >
        Ví dụ đặt cược: 11,12,13,14,15,16
      </CustomText>
    </>
  );
};

export default InputType1;