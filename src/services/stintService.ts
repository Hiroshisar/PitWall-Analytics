import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { stintsType } from "../utils/types";
import { Bounce, toast } from "react-toastify";

export async function getAllDriverStint(
  session_key: number,
  driver_number: number,
): Promise<stintsType[]> {
  try {
    const res = await api.get(
      `${endpoints.stints}?session_key=${session_key}&driver_number=${driver_number}`,
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load stints data`, {
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
