import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { carType, driverType } from "../utils/types";
import type { RootState } from "../store/store";
import { useQuery } from "@tanstack/react-query";
import { getCarsByDrivers } from "../services/carService";
import Spinner from "../ui/Spinner";

function SpeedTelemetry({
  selectedDrivers,
}: {
  selectedDrivers: driverType[];
}) {
  const sessionData = useSelector((store: RootState) => store.session);

  const { selectedSessionKey } = sessionData;
  const sessionKey = selectedSessionKey ?? 0;

  const driverNumbers = useMemo(
    () => selectedDrivers.map((driver) => driver.driver_number).sort(),
    [selectedDrivers],
  );

  const {
    data: carsData = [],
    isLoading: isLoadingCars,
    isError: isErrorCars,
  } = useQuery({
    queryKey: ["cars", sessionKey, driverNumbers],
    queryFn: () => getCarsByDrivers(driverNumbers, sessionKey),
    enabled: sessionKey > 0 && driverNumbers.length > 0,
  });

  const carsByDriver = useMemo(() => {
    const groupedCars: Record<number, carType[]> = {};
    for (const carSample of carsData) {
      if (!groupedCars[carSample.driver_number]) {
        groupedCars[carSample.driver_number] = [];
      }
      groupedCars[carSample.driver_number].push(carSample);
    }
    return groupedCars;
  }, [carsData]);

  // implementare recupero dei giri, selezione giro desiderato, installare e implementare Recharts per i grafici

  return (
    <>
      {isLoadingCars && <Spinner />}
      {isErrorCars && <div>Alcuni dati non sono disponibili al momento.</div>}

      <div>Campioni telemetria totali: {carsData.length}</div>
      <ul>
        {selectedDrivers.map((driver) => {
          const driverCars = carsByDriver[driver.driver_number] ?? [];

          return (
            <li key={driver.driver_number}>
              {driver.broadcast_name} #{driver.driver_number} — campioni:{" "}
              {driverCars.length}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default SpeedTelemetry;
