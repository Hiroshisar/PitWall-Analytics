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
  StyledTelemetryPage,
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
import Modal from '../ui/Modal.tsx';

const telemetryMetrics: TelemetryMetric[] = [
  'speed',
  'throttle',
  'brake',
  'rpm',
  'gear',
];

function Telemetry() {
  const [selectedDrivers, setSelectedDrivers] = useState<driverType[]>([]);
  const [selectedLap, setSelectedLap] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (selectedDrivers.length === 0) return [];

    const selectedLaps = selectedLap
      ? lapsData.filter((lap) => lap.lap_number === selectedLap)
      : selectedDrivers
          .map((driver) =>
            lapsData
              .filter(
                (lap) =>
                  lap.driver_number === driver.driver_number &&
                  Number.isFinite(lap.lap_duration) &&
                  lap.lap_duration > 0
              )
              .sort((a, b) => a.lap_duration - b.lap_duration)[0]
          )
          .filter((lap) => Boolean(lap));

    return selectedLaps.flatMap((lap) => {
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
  }, [carsData, lapsData, selectedDrivers, selectedLap]);

  const handleDriversSelection = (drivers: driverType[]) => {
    setSelectedDrivers(drivers);
    setIsModalOpen(false);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isModalOpen)
    return (
      <Modal
        drivers={drivers ?? []}
        selectedDrivers={selectedDrivers}
        onSelect={handleDriversSelection}
        onClose={handleCloseModal}
      />
    );

  if (!selectedSessions) return;

  if (isLoadingDrivers || isLoadingLaps) return <Spinner />;
  // TODO Quando si selezionano i piloti, deve apparire il confronto tra i giri più veloci, non un giro specifico o vuoto
  return (
    <StyledTelemetryPage>
      {(isLoadingCars || isLoadingDrivers) && <Spinner />}
      {(isErrorCars || isErrorLaps) && (
        <div>Alcuni dati non sono disponibili al momento.</div>
      )}
      <Session
        selectedLap={selectedLap ?? 0}
        setSelectedLap={setSelectedLap}
        maxNumberOfLaps={maxNumberOfLaps}
      />

      <DriversList
        drivers={selectedDrivers}
        onSelect={handleDriversSelection}
        type="secondary"
        onOpen={setIsModalOpen}
      />

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
    </StyledTelemetryPage>
  );
}

export default Telemetry;
