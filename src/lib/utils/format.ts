export function formatPrice(value: number) {
  return `${value.toLocaleString("ko-kr")}원`;
}

// ISO 날짜 → "2026.10.13" (한국 시간 기준)
export function formatDate(value: string) {
  return new Date(value)
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
    .replaceAll("-", ".");
}
