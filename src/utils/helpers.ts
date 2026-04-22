export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("it", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatLapTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "";

  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const minutes = Math.floor(totalMs / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function normalizeHexColor(color?: string): string | null {
  if (!color) return null;

  const trimmedColor = color.trim();
  if (!trimmedColor) return null;

  return trimmedColor.startsWith("#") ? trimmedColor : `#${trimmedColor}`;
}
