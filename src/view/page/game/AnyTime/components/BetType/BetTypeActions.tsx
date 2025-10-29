import { Box, Button } from "@mui/material";

interface BetTypeActionsProps {
  subType: any; // thông tin loại cược hiện tại (có input_type, rule...)
  betData: any; // dữ liệu người chơi đã nhập/chọn
  onCancel: () => void;
  onSubmit: (payload: any) => void;
}

const BetTypeActions: React.FC<BetTypeActionsProps> = ({
  subType,
  betData,
  onCancel,
  onSubmit,
}) => {
  // Hàm validate dựa trên input_type
  const validate = () => {
    const errors: string[] = [];

    if (!subType) {
      errors.push("Chưa chọn loại cược.");
      return { isValid: false, errors };
    }

    switch (subType.input_type) {
      case 1: {
        // Nhập số
        if (!betData || betData.trim() === "") {
          errors.push("Bạn cần nhập ít nhất 1 số.");
        }
        break;
      }
      case 2: {
        // Ghép số
        const rows = ["C.ngàn", "Ngàn", "Trăm", "Chục", "Đơn vị"];
        rows.forEach((row) => {
          if (!betData[row] || betData[row].length === 0) {
            errors.push(`Hàng ${row} cần chọn ít nhất 1 số.`);
          }
        });
        break;
      }
      case 6: {
        // Nhóm 120: chọn 5-7 số
        const count = betData?.length || 0;
        if (count < 5) errors.push("Phải chọn ít nhất 5 số.");
        if (count > 7) errors.push("Không được chọn quá 7 số.");
        break;
      }
      case 7: {
        // Nhóm 60, 30, 20, 10, 5 (tùy subtype)
        if (subType.name.includes("60")) {
          if ((betData["Trùng nhị"]?.length || 0) < 1)
            errors.push("Cần chọn ≥ 1 số ở Trùng nhị.");
          if ((betData["Số đơn"]?.length || 0) < 3)
            errors.push("Cần chọn ≥ 3 số ở Số đơn.");
        }
        if (subType.name.includes("30")) {
          if ((betData["Trùng nhị"]?.length || 0) < 2)
            errors.push("Cần chọn 2 số ở Trùng nhị.");
          if ((betData["Số đơn"]?.length || 0) < 1)
            errors.push("Cần chọn 1 số ở Số đơn.");
        }
        if (subType.name.includes("20")) {
          if ((betData["Trùng tam"]?.length || 0) < 1)
            errors.push("Cần chọn 1 số ở Trùng tam.");
          if ((betData["Số đơn"]?.length || 0) < 2)
            errors.push("Cần chọn 2 số ở Số đơn.");
        }
        if (subType.name.includes("10")) {
          if ((betData["Trùng tam"]?.length || 0) < 1)
            errors.push("Cần chọn 1 số ở Trùng tam.");
          if ((betData["Trùng nhị"]?.length || 0) < 1)
            errors.push("Cần chọn 1 số ở Trùng nhị.");
        }
        if (subType.name.includes("5")) {
          if ((betData["Trùng tứ"]?.length || 0) < 1)
            errors.push("Cần chọn 1 số ở Trùng tứ.");
          if ((betData["Số đơn"]?.length || 0) < 1)
            errors.push("Cần chọn 1 số ở Số đơn.");
        }
        break;
      }
      default:
        errors.push("Loại cược chưa được hỗ trợ validate.");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = () => {
    const { isValid, errors } = validate();
    if (!isValid) {
      alert(errors.join("\n"));
      return;
    }

    const payload = {
      betTypeId: subType.id,
      numbers: betData,
      amount: 1000, // TODO: có thể thêm input tiền cược
    };

    onSubmit(payload);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button
        variant="outlined"
        color="error"
        onClick={onCancel}
        sx={{ flex: 1, mr: 1 }}
      >
        Hủy
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        sx={{ flex: 1, ml: 1 }}
      >
        Xác nhận
      </Button>
    </Box>
  );
};

export default BetTypeActions;
