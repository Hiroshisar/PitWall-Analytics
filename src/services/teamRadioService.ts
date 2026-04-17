import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { teamRadioType } from "../utils/types";
import { Bounce, toast } from "react-toastify";

export async function getSessionTeamRadio(
  session_key: number,
): Promise<teamRadioType[]> {
  try {
    const res = await api.get(
      `${endpoints.team_radio}?session_key=${session_key}`,
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load team radio data`, {
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
