import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import DriversList from '../components/DriversList';
import Session from '../components/Session';
import TelemetryLineChart from '../components/TelemetryLineChart';
import { useFetchDrivers } from '../hooks/useFetchDriver';
import { useFetchMeetings } from '../hooks/useFetchMeetings';
import { useFetchAllSessions } from '../hooks/useFetchSession';
import { getCarsByDrivers } from '../services/carService';
import { getLapsByDrivers } from '../services/lapService';
import {
  StyledTelemetryPage,
  StyledTelemetry,
  TelemetryContainer,
} from '../style/styles';
import Spinner from '../ui/Spinner';
import type {
  DriverType,
  MeetingType,
  SessionType,
  SelectedLapCarSample,
  TelemetryMetric,
} from '../utils/types';
import Modal from '../ui/Modal.tsx';
import { isValidOpenF1Key } from '../utils/helpers.ts';

const telemetryMetrics: TelemetryMetric[] = [
  'speed',
  'throttle',
  'brake',
  'rpm',
  'gear',
];

function Telemetry() {
  const [selectedDrivers, setSelectedDrivers] = useState<DriverType[]>([]);
  const [selectedLap, setSelectedLap] = useState<number>(0);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState<number | null>(
    null
  );
  const [selectedSessionKey, setSelectedSessionKey] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: meetings = [], isLoading: isLoadingMeetings } =
    useFetchMeetings(new Date().getFullYear());
  const defaultMeetingKey = useMemo(() => {
    if (meetings.length === 0) return null;

    return [...meetings].sort(
      (a, b) =>
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    )[0].meeting_key;
  }, [meetings]);

  const effectiveMeetingKey = selectedMeetingKey ?? defaultMeetingKey ?? 0;

  const { data: sessions = [], isLoading: isLoadingSessions } =
    useFetchAllSessions(effectiveMeetingKey);

  const defaultSessionKey = useMemo(() => {
    if (sessions.length === 0) return null;

    return [...sessions].sort(
      (a, b) =>
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    )[0].session_key;
  }, [sessions]);

  const effectiveSessionKey = selectedSessionKey ?? defaultSessionKey ?? 0;

  const { data: drivers, isLoading: isLoadingDrivers } =
    useFetchDrivers(effectiveSessionKey);

  const selectedMeeting = useMemo<MeetingType | undefined>(
    () =>
      meetings.find((meeting) => meeting.meeting_key === effectiveMeetingKey),
    [meetings, effectiveMeetingKey]
  );

  const selectedSession = useMemo<SessionType | undefined>(
    () =>
      sessions.find((session) => session.session_key === effectiveSessionKey),
    [effectiveSessionKey, sessions]
  );

  const sessionKey = effectiveSessionKey;

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
    enabled: isValidOpenF1Key(sessionKey) && driverNumbers.length > 0,
  });

  const {
    data: lapsData = [],
    isLoading: isLoadingLaps,
    isError: isErrorLaps,
  } = useQuery({
    queryKey: ['laps', sessionKey, driverNumbers],
    queryFn: () => getLapsByDrivers(sessionKey, driverNumbers),
    enabled: isValidOpenF1Key(sessionKey) && driverNumbers.length > 0,
  });

  const selectedLapCarsData = useMemo<SelectedLapCarSample[]>(() => {
    if (selectedDrivers.length === 0) return [];

    const selectedLaps = selectedLap
      ? lapsData.filter((lap) => lap.lap_number === selectedLap)
      : selectedDrivers
          .map(
            (driver) =>
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

      return carsData
        .filter((carSample) => {
          const carInstant = new Date(carSample.date).getTime();

          return (
            carSample.driver_number === lap.driver_number &&
            carInstant >= start.getTime() &&
            carInstant <= end.getTime()
          );
        })
        .map((carSample) => ({
          ...carSample,
          selectedLapNumber: selectedLap ? undefined : lap.lap_number,
          selectedLapTime: lap.lap_duration,
        }));
    });
  }, [carsData, lapsData, selectedDrivers, selectedLap]);

  const handleDriversSelection = (drivers: DriverType[]) => {
    setSelectedDrivers(drivers);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
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

  const handleMeetingSelection = (meetingKey: number) => {
    setSelectedMeetingKey(meetingKey);
    setSelectedSessionKey(null);
    setSelectedDrivers([]);
    setSelectedLap(0);
  };

  const handleSessionSelection = (sessionKey: number) => {
    setSelectedSessionKey(sessionKey);
    setSelectedDrivers([]);
    setSelectedLap(0);
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

  if (
    isLoadingMeetings ||
    isLoadingSessions ||
    isLoadingDrivers ||
    isLoadingLaps ||
    isLoadingCars ||
    !effectiveMeetingKey ||
    !effectiveSessionKey
  )
    return <Spinner />;

  // TODO risolvere reset lista piloti selezionati cambiando meeting o sessione
  //  (fallback in caso di assenza pilota)

  return (
    <StyledTelemetryPage>
      {(isErrorCars || isErrorLaps) && (
        <div>Alcuni dati non sono disponibili al momento.</div>
      )}
      <Session
        meeting={selectedMeeting}
        meetings={meetings}
        session={selectedSession}
        sessions={sessions}
        selectedMeetingKey={effectiveMeetingKey}
        selectedSessionKey={effectiveSessionKey}
        selectedLap={selectedLap ?? 0}
        setSelectedLap={setSelectedLap}
        maxNumberOfLaps={maxNumberOfLaps}
        onMeetingSelect={handleMeetingSelection}
        onSessionSelect={handleSessionSelection}
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
