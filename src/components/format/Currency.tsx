const formatCurrency = (value: number | string) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const isGreaterThanZero = (value: string) => {
  const numericValue = parseFloat(value.replace(/,/g, ""));
  return numericValue > 0;
};

export default formatCurrency;
