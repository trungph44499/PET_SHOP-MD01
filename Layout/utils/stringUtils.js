export function numberUtils(x) {
  return parseInt(x).toLocaleString("en-ES") + " ₫";
}

export function upperCaseFirstItem(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
