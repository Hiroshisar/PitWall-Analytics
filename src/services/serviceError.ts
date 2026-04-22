import { isAxiosError } from "axios";
import { Bounce, toast } from "react-toastify";

const TOAST_COOLDOWN_MS = 10000;
const lastToastById = new Map<string, number>();

export function getHttpStatus(err: unknown): number | null {
  if (isAxiosError(err)) {
    return err.response?.status ?? err.status ?? null;
  }

  if (typeof err === "object" && err !== null && "status" in err) {
    const status = (err as { status?: unknown }).status;
    return typeof status === "number" ? status : null;
  }

  return null;
}

function shouldShowToast(status: number | null): boolean {
  if (status === 429) return false;
  if (status === null) return true;
  if (status >= 500) return true;
  if (status === 401 || status === 403) return true;

  return false;
}

export function notifyServiceError(
  err: unknown,
  message: string,
  toastId: string,
) {
  const status = getHttpStatus(err);
  if (!shouldShowToast(status)) return;

  const now = Date.now();
  const lastToastTime = lastToastById.get(toastId) ?? 0;
  if (now - lastToastTime < TOAST_COOLDOWN_MS) return;
  lastToastById.set(toastId, now);

  toast.error(message, {
    toastId,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
}
