//chuyển số thành dạng ngăn cách có dấu . ví dụ 10000 => 10.000
export function numberUtils(x) {
  return parseInt(x).toLocaleString("en-ES") + " ₫";
}
// viết hoa chữ cái đầu tiên
export function upperCaseFirstItem(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
export const validateSDT = (sdt) => {
  const regex2 = /^(?:\+84|0)([0-9]{9})$/;
  return regex2.test(sdt);
};
