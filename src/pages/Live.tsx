import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { sessionType } from "../utils/types";
import {
  DashboardRow,
  DashboardItem,
  StyledDashboard,
  DashboardMain,
  DashboardColumn,
} from "../style/styles";
import { queryClient } from "../hooks/queryClient";
import { formatDate } from "../utils/helpers";
import Modal from "../ui/Modal";

function Live() {
  const meetingData = useSelector((store: RootState) => store.meeting);
  const sessionData = useSelector((store: RootState) => store.session);

  const { selectedMeetingKey } = meetingData;
  const { selectedSessionKey } = sessionData;

  const sessions = queryClient.getQueryData<sessionType[]>([
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
            <DashboardItem>
              <p>
                {`${s?.circuit_short_name ?? "Circuito"} (${s?.country_name ?? "Nazione"})`}
              </p>
              <p>{s?.session_name ?? "Sessione"}</p>
            </DashboardItem>
            <DashboardItem>
              {formatDate(s?.date_start ?? "01/05/2026")}
            </DashboardItem>
            <DashboardItem>Timer</DashboardItem>
            <DashboardItem>Meteo</DashboardItem>
            <DashboardItem>Bandiere</DashboardItem>
          </DashboardRow>
          <DashboardRow>
            <DashboardMain>
              <DashboardColumn>
                <DashboardItem>Griglia</DashboardItem>
              </DashboardColumn>
              <DashboardColumn>
                <DashboardRow>
                  <DashboardItem>Mappa</DashboardItem>
                </DashboardRow>
                <DashboardRow>
                  <DashboardItem>Race control</DashboardItem>
                  <DashboardItem>Team radio</DashboardItem>
                </DashboardRow>
              </DashboardColumn>
            </DashboardMain>
          </DashboardRow>
        </StyledDashboard>
      )}
    </>
  );
}

export default Live;
