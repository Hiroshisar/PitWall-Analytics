import { useSelector } from "react-redux";
import { useFetchDrivers } from "../hooks/useFetchDriver";
import { StyledAnalyze } from "../style/styles";
import type { RootState } from "../store/store";
import { queryClient } from "../hooks/queryClient";
import type { driverType, sessionType } from "../utils/types";
import Driver from "../components/Driver";
import Spinner from "../ui/Spinner";
import { useState } from "react";
import SpeedTelemetry from "../components/SpeedTelemetry";

function Analyze() {
  const [selectedDrivers, setSelectedDrivers] = useState<driverType[]>([]);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const sessionData = useSelector((store: RootState) => store.session);
  const meetingData = useSelector((store: RootState) => store.meeting);

  const { selectedSessionKey } = sessionData;
  const { selectedMeetingKey } = meetingData;

  const selectedSessions = queryClient.getQueryData<sessionType[]>([
    "sessions",
    selectedMeetingKey,
  ]);

  const { data: drivers, isLoading: isLoadingDrivers } = useFetchDrivers(
    selectedSessionKey ?? 0,
  );
  if (!selectedSessions) return;
  const session = selectedSessions[0];
  if (isLoadingDrivers) return <Spinner />;

  return (
    <>
      <div>
        <h1>{session.circuit_short_name}</h1>
        <h2>{session.country_name}</h2>
      </div>
      <StyledAnalyze>
        {!isButtonClicked ? (
          <>
            <Driver
              drivers={drivers ? drivers : []}
              selectedDrivers={selectedDrivers}
              onSelect={setSelectedDrivers}
            />
            <button
              style={{ color: "black", width: "100%", height: "5rem" }}
              disabled={selectedDrivers?.length === 0 ? true : false}
              onClick={() => {
                setIsButtonClicked(true);
              }}
            >
              PROCEDI
            </button>
          </>
        ) : (
          <div>
            <SpeedTelemetry selectedDrivers={selectedDrivers} />
          </div>
        )}
      </StyledAnalyze>
    </>
  );
}

export default Analyze;
