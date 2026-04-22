import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import type { carType, driverType, lapType } from "../utils/types";
import type { RootState } from "../store/store";
import { useQuery } from "@tanstack/react-query";
import { getCarsByDrivers } from "../services/carService";
import Spinner from "../ui/Spinner";
import { getLapsByDrivers } from "../services/lapService";
import Chart from "./Chart";
import { formatDate } from "../utils/helpers";

function SpeedTelemetry({
  selectedDrivers,
}: {
  selectedDrivers: driverType[];
}) {
  const sessionData = useSelector((store: RootState) => store.session);
  const [selectedLap, setSelectedLap] = useState<number | undefined>(undefined);
  const [selectedLapCarsData, setSelectedLapCarsData] = useState<carType[]>([]);
  let maxNumberOfLaps: number = 0;

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

  const { data: lapsData = [] } = useQuery({
    queryKey: ["laps", sessionKey, driverNumbers],
    queryFn: () => getLapsByDrivers(sessionKey, driverNumbers),
    enabled: sessionKey > 0 && driverNumbers.length > 0,
  });

  const carsByDriver = useMemo(() => {
    const groupedCars: Record<number, { car: carType[]; laps: lapType[] }> = {};
    for (const carSample of carsData) {
      if (!groupedCars[carSample.driver_number]) {
        groupedCars[carSample.driver_number] = { car: [], laps: [] };
      }
      groupedCars[carSample.driver_number].car.push(carSample);
    }
    for (const lapSample of lapsData) {
      if (!groupedCars[lapSample.driver_number]) {
        groupedCars[lapSample.driver_number] = { car: [], laps: [] };
      }
      groupedCars[lapSample.driver_number].laps.push(lapSample);
    }
    return groupedCars;
  }, [carsData, lapsData]);

  selectedDrivers.map((driver) => {
    const driversNumberOfLaps: number[] = [];
    const driverSessionData = carsByDriver[driver.driver_number] ?? {
      car: [],
      laps: [],
    };
    driversNumberOfLaps.push(driverSessionData.laps.length);

    driversNumberOfLaps.sort((a, b) => a - b);

    maxNumberOfLaps = driversNumberOfLaps[0] ?? 0;
  });

  useEffect(() => {
    const laps = lapsData.filter((l) => l.lap_number === selectedLap);
    const cars: carType[] = [];
    laps.map((l) => {
      const start = new Date(l.date_start);
      const end = new Date(l.date_start);
      end.setSeconds(end.getSeconds() + l.lap_duration);
      cars.push(
        ...carsData.filter((c) => {
          const carIstant = new Date(c.date).getTime();
          if (
            c.driver_number === l.driver_number &&
            carIstant >= start.getTime() &&
            carIstant <= end.getTime()
          )
            return { ...c, date: formatDate(c.date) };
        }),
      );
      setSelectedLapCarsData([...selectedLapCarsData, ...cars]);
    });
  }, [selectedLap]);

  //TODO installare e implementare Recharts per i grafici

  return (
    <>
      {isLoadingCars && <Spinner />}
      {isErrorCars && <div>Alcuni dati non sono disponibili al momento.</div>}

      <div>Campioni telemetria totali: {carsData.length}</div>
      <ul>
        {selectedDrivers.map((driver) => {
          const driverSessionData = carsByDriver[driver.driver_number] ?? {
            car: [],
            laps: [],
          };
          const driverCars = driverSessionData.car;
          const driverLaps = driverSessionData.laps;

          return (
            <li key={driver.driver_number}>
              {driver.broadcast_name} #{driver.driver_number} — campioni:{" "}
              {driverCars.length} Giri: #{driverLaps.length}
            </li>
          );
        })}
      </ul>
      {!selectedLap ? (
        <select
          style={{ color: "var(--color-grey-800)" }}
          onChange={(e) => setSelectedLap(Number(e.target.value))}
        >
          {Array.from(
            {
              length: maxNumberOfLaps ?? 0,
            },
            (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ),
          )}
        </select>
      ) : (
        <Chart
          carsData={selectedLapCarsData}
          selectedDrivers={selectedDrivers}
        />
      )}
    </>
  );
}

export default SpeedTelemetry;
