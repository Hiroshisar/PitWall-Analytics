import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { lapType } from "../utils/types";
import { getHttpStatus, notifyServiceError } from "./serviceError";

export async function getLaps(
  session_key: number,
  driver_number: number,
): Promise<lapType[]> {
  try {
    const res = await api.get(
      `${endpoints.laps}?session_key=${session_key}&driver_number=${driver_number}`,
    );
    console.log(res.data);
    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, "Unable to load laps data", "laps-data-error");

    return [];
  }
}

export async function getLapsByDrivers(
  session_key: number,
  driver_numbers: number[],
): Promise<lapType[]> {
  const uniqueDriverNumbers = [...new Set(driver_numbers)].filter(
    (driverNumber) => driverNumber > 0,
  );

  if (session_key <= 0 || uniqueDriverNumbers.length === 0) return [];

  const params = new URLSearchParams({ session_key: String(session_key) });
  uniqueDriverNumbers.forEach((driverNumber) => {
    params.append("driver_number", String(driverNumber));
  });

  try {
    const res = await api.get(`${endpoints.laps}?${params.toString()}`);
    return res.data;
  } catch (err: unknown) {
    const status = getHttpStatus(err);

    if (status === 400 || status === 404 || status === 422) {
      const mergedLapsData: lapType[] = [];
      let hasFallbackErrors = false;

      for (const driverNumber of uniqueDriverNumbers) {
        try {
          const laps = await getLaps(session_key, driverNumber);
          mergedLapsData.push(...laps);
          await new Promise((resolve) => setTimeout(resolve, 120));
        } catch {
          hasFallbackErrors = true;
        }
      }

      if (hasFallbackErrors && mergedLapsData.length === 0) {
        notifyServiceError(
          err,
          "Unable to load laps data for selected drivers",
          "laps-data-error",
        );
      }

      return mergedLapsData;
    }

    notifyServiceError(
      err,
      "Unable to load laps data for selected drivers",
      "laps-data-error",
    );
    return [];
  }
}
