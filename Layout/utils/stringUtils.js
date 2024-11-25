//chuyển số thành dạng ngăn cách có dấu . ví dụ 10000 => 10.000
export function numberUtils(x) {
  const parsedNumber = parseInt(x);
  if (isNaN(parsedNumber)) {
    return "Giá trị không hợp lệ";  // Xử lý trường hợp không hợp lệ
  }
  
  // Chuyển đổi số thành chuỗi và thay thế dấu phẩy thành dấu chấm
  return parsedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + "₫";
}

// viết hoa chữ cái đầu tiên
export function upperCaseFirstItem(str) {
  if (!str || typeof str !== 'string') return ''; // Kiểm tra giá trị đầu vào
  return str.charAt(0).toUpperCase() + str.slice(1); 
}

// viết hoa chữ cái 
export function upperCaseItem(string) {
  return string.toUpperCase();
}

export const validateSDT = (sdt) => {
  const regex2 = /^(?:\+84|0)([0-9]{9})$/;
  return regex2.test(sdt);
};
