import { useSelector } from 'react-redux';
import { useFetchDrivers } from '../hooks/useFetchDriver';
import {
  DriversListContainer,
  StyledAnalyze,
  StyledTelemetry,
  TelemetryContainer,
} from '../style/styles';
import type { RootState } from '../store/store';
import { queryClient } from '../hooks/queryClient';
import type {
  carType,
  driverType,
  lapType,
  sessionType,
  TelemetryMetric,
} from '../utils/types';
import Spinner from '../ui/Spinner';
import { useMemo, useState } from 'react';
import Session from '../components/Session';
import { useQuery } from '@tanstack/react-query';
import { getCarsByDrivers } from '../services/carService';
import { getLapsByDrivers } from '../services/lapService';
import DriversList from '../components/DriversList';
import Chart from '../components/Chart';

const telemetryMetrics: TelemetryMetric[] = ['speed', 'brake', 'rpm', 'gear'];

function Analyze() {
  const [selectedDrivers, setSelectedDrivers] = useState<driverType[]>([]);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const [selectedLap, setSelectedLap] = useState<number>(1);

  const sessionData = useSelector((store: RootState) => store.session);
  const meetingData = useSelector((store: RootState) => store.meeting);

  const { selectedSessionKey } = sessionData;
  const { selectedMeetingKey } = meetingData;

  const selectedSessions = queryClient.getQueryData<sessionType[]>([
    'sessions',
    selectedMeetingKey,
  ]);

  const { data: drivers, isLoading: isLoadingDrivers } = useFetchDrivers(
    selectedSessionKey ?? 0
  );
  let maxNumberOfLaps: number = 0;

  const sessionKey = selectedSessionKey ?? 0;

  const driverNumbers = useMemo(
    () => selectedDrivers.map((driver) => driver.driver_number).sort(),
    [selectedDrivers]
  );

  const {
    data: carsData = [],
    isLoading: isLoadingCars,
    isError: isErrorCars,
  } = useQuery({
    queryKey: ['cars', sessionKey, driverNumbers],
    queryFn: () => getCarsByDrivers(driverNumbers, sessionKey),
    enabled: sessionKey > 0 && driverNumbers.length > 0,
  });

  const { data: lapsData = [] } = useQuery({
    queryKey: ['laps', sessionKey, driverNumbers],
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

  const selectedLapCarsData = useMemo<carType[]>(() => {
    if (!selectedLap) return [];

    return lapsData
      .filter((lap) => lap.lap_number === selectedLap)
      .flatMap((lap) => {
        const start = new Date(lap.date_start);
        const end = new Date(lap.date_start);
        end.setSeconds(end.getSeconds() + lap.lap_duration);

        return carsData.filter((carSample) => {
          const carInstant = new Date(carSample.date).getTime();

          return (
            carSample.driver_number === lap.driver_number &&
            carInstant >= start.getTime() &&
            carInstant <= end.getTime()
          );
        });
      });
  }, [carsData, lapsData, selectedLap]);

  const handleDriversSelection = (drivers: driverType[]) => {
    setSelectedDrivers(drivers);
    setIsButtonClicked(true);
  };

  if (!selectedSessions) return;
  const session = selectedSessions[selectedSessions.length - 1];

  if (isLoadingDrivers) return <Spinner />;

  return (
    <>
      <StyledAnalyze>
        {isLoadingCars && <Spinner />}
        {isErrorCars && <div>Alcuni dati non sono disponibili al momento.</div>}
        <Session
          session={session}
          selectedLap={selectedLap ?? 0}
          setSelectedLap={setSelectedLap}
          maxNumberOfLaps={maxNumberOfLaps}
        />
        {!isButtonClicked ? (
          <div>
            <DriversList
              drivers={drivers ? drivers : []}
              onSelect={handleDriversSelection}
              type="main"
            />
          </div>
        ) : (
          <>
            <DriversListContainer>
              <DriversList drivers={selectedDrivers} type="secondary" />
            </DriversListContainer>
            <TelemetryContainer>
              {telemetryMetrics.map((metric) => (
                <StyledTelemetry key={metric}>
                  <h2>{metric.toUpperCase()}</h2>
                  <Chart
                    carsData={selectedLapCarsData ?? []}
                    metric={metric}
                    selectedDrivers={selectedDrivers ?? []}
                  />
                </StyledTelemetry>
              ))}
            </TelemetryContainer>
          </>
        )}
      </StyledAnalyze>
    </>
  );
}

export default Analyze;
