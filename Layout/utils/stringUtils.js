//chuyển số thành dạng ngăn cách có dấu . ví dụ 10000 => 10.000
export function numberUtils(x) {
  return parseInt(x).toLocaleString("en-ES") + " ₫";
}

// viết hoa chữ cái đầu tiên
export function upperCaseFirstItem(str) {
  if (!str || typeof str !== 'string') return ''; // Kiểm tra giá trị đầu vào
  return str.charAt(0).toUpperCase() + str.slice(1); 
}

// viết hoa chữ cái đầu tiên
export function upperCaseItem(string) {
  return string.toUpperCase();
}

export const validateSDT = (sdt) => {
  const regex2 = /^(?:\+84|0)([0-9]{9})$/;
  return regex2.test(sdt);
};
