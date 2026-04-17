import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { meetingsType } from "../utils/types";
import { Bounce, toast } from "react-toastify";

export async function getMeeting(year: number): Promise<meetingsType[]> {
  try {
    const today = new Date();

    const res = await api.get(`${endpoints.meetings}?year=${year}`);

    const filteredMeetings = res.data.filter(
      (elem: meetingsType) =>
        new Date(elem.date_start) <= today && !elem.is_cancelled,
    );

    return filteredMeetings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load data for year ${year}`, {
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
