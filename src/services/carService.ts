import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { carType } from "../utils/types";
import { Bounce, toast } from "react-toastify";

export async function getCar(driver_number: number): Promise<carType[]> {
  try {
    const res = await api.get(
      `${endpoints.car}?driver_number=${driver_number}`,
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load car data`, {
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
