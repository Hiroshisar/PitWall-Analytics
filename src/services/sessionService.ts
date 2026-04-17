import { toast, Bounce } from "react-toastify";
import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { sessionType } from "../utils/types";

export async function getAllSessions(
  meeting_key: number,
): Promise<sessionType[]> {
  try {
    const today = new Date();

    const res = await api.get(
      `${endpoints.sessions}?meeting_key=${meeting_key}`,
    );

    const filteredSessions = res.data.filter(
      (elem: sessionType) => new Date(elem.date_start) <= today,
    );

    return filteredSessions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load data for this weekend`, {
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

    return [];
  }
}
