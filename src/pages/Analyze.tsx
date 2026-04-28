import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DriversList from '../components/DriversList';
import Session from '../components/Session';
import TelemetryLineChart from '../components/TelemetryLineChart';
import { queryClient } from '../hooks/queryClient';
import { useFetchDrivers } from '../hooks/useFetchDriver';
import { getCarsByDrivers } from '../services/carService';
import { getLapsByDrivers } from '../services/lapService';
import type { RootState } from '../store/store';
import {
  DriversListContainer,
  StyledAnalyze,
  StyledTelemetry,
  TelemetryContainer,
} from '../style/styles';
import Spinner from '../ui/Spinner';
import type {
  carType,
  driverType,
  sessionType,
  TelemetryMetric,
} from '../utils/types';

const telemetryMetrics: TelemetryMetric[] = [
  'speed',
  'throttle',
  'brake',
  'rpm',
  'gear',
];

function Analyze() {
  const [selectedDrivers, setSelectedDrivers] = useState<driverType[]>([]);
  const [isSelectionConfirmed, setIsSelectionConfirmed] =
    useState<boolean>(false);
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

  const {
    data: lapsData = [],
    isLoading: isLoadingLaps,
    isError: isErrorLaps,
  } = useQuery({
    queryKey: ['laps', sessionKey, driverNumbers],
    queryFn: () => getLapsByDrivers(sessionKey, driverNumbers),
    enabled: sessionKey > 0 && driverNumbers.length > 0,
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
    setIsSelectionConfirmed(true);
  };

  const maxNumberOfLaps = useMemo<number>(() => {
    if (lapsData.length === 0) return 0;
    if (selectedDrivers.length === 0) return 0;

    const groupedLaps: Record<number, number> = {};

    for (const lap of lapsData) {
      groupedLaps[lap.driver_number] =
        (groupedLaps[lap.driver_number] ?? 0) + 1;
    }

    const lapsByDriver = selectedDrivers
      .map((driver) => groupedLaps[driver.driver_number] ?? 0)
      .filter((lapCount) => lapCount > 0);

    if (lapsByDriver.length === 0) return 0;

    return Math.min(...lapsByDriver);
  }, [lapsData, selectedDrivers]);

  if (!selectedSessions) return;
  const session = selectedSessions[selectedSessions.length - 1];

  if (isLoadingDrivers || isLoadingLaps) return <Spinner />;

  return (
    <>
      <StyledAnalyze>
        {(isLoadingCars || isLoadingDrivers) && <Spinner />}
        {(isErrorCars || isErrorLaps) && (
          <div>Alcuni dati non sono disponibili al momento.</div>
        )}
        <Session
          session={session}
          selectedLap={selectedLap ?? 0}
          setSelectedLap={setSelectedLap}
          maxNumberOfLaps={maxNumberOfLaps}
        />
        {!isSelectionConfirmed ? (
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
                  <TelemetryLineChart
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
