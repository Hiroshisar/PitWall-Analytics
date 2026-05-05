export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('it', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatLapTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '';

  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const minutes = Math.floor(totalMs / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function normalizeHexColor(color?: string): string | null {
  if (!color) return null;

  const trimmedColor = color.trim();
  if (!trimmedColor) return null;

  return trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`;
}

export function checkIfIsLiveSession(
  dateStart: string,
  dateEnd: string
): boolean {
  const startLiveSessionGracePeriodMs = 5 * 60 * 1000;
  const endLiveSessionGracePeriodMs = 20 * 60 * 1000;
  const now = new Date().getTime();
  const start = new Date(dateStart).getTime() + startLiveSessionGracePeriodMs;
  const end = new Date(dateEnd).getTime() + endLiveSessionGracePeriodMs;

  return now >= start && now <= end;
}

export function formatTime(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const days = Math.floor(totalSeconds / 86400);
  const hrs = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${days > 1 ? `${days.toString()} days and ` : ''} ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} hours`;
}
