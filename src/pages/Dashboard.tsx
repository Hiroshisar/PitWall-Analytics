import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { sessionsType } from "../utils/types";
import {
  DashboardRow,
  DashboardRowItem,
  StyledDashboard,
} from "../style/styles";
import { queryClient } from "../hooks/queryClient";
import { formatDate } from "../utils/helpers";
import Modal from "../ui/Modal";

function Dashboard() {
  const meetingData = useSelector((store: RootState) => store.meeting);
  const sessionData = useSelector((store: RootState) => store.session);

  const { selectedMeetingKey } = meetingData;
  const { selectedSessionKey } = sessionData;

  const sessions = queryClient.getQueryData<sessionsType[]>([
    "sessions",
    selectedMeetingKey,
  ]);

  const s = sessions?.find((s) => s.session_key === selectedSessionKey);

  return (
    <>
      {!selectedMeetingKey || !selectedSessionKey ? (
        <Modal />
      ) : (
        <StyledDashboard>
          <DashboardRow>
            <DashboardRowItem>
              {`${s?.circuit_short_name ?? "Circuito"} (${s?.country_name ?? "Nazione"})`}
            </DashboardRowItem>
            <DashboardRowItem>
              {formatDate(s?.date_start ?? "01/05/2026")}
            </DashboardRowItem>
            <DashboardRowItem>Timer</DashboardRowItem>
            <DashboardRowItem>Meteo</DashboardRowItem>
            <DashboardRowItem>Bandiere</DashboardRowItem>
          </DashboardRow>
          <DashboardRow>
            <DashboardRowItem>Griglia</DashboardRowItem>
            <DashboardRowItem>Circuito</DashboardRowItem>
          </DashboardRow>
          <DashboardRow>
            <DashboardRowItem>Race control</DashboardRowItem>
            <DashboardRowItem>Team radio</DashboardRowItem>
          </DashboardRow>
        </StyledDashboard>
      )}
    </>
  );
}

export default Dashboard;
