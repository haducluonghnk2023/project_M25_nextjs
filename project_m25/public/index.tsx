export function formatCurrencyUSD(amount: number): string {
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formattedAmount; // Trả về định dạng tiền tệ USD
}
