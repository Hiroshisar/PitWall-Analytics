import { useFetchTeamRadio } from '../hooks/useFetchTeamRadio.ts';

function TeamRadio({ sessionKey }: { sessionKey: number }) {
  const { data: teamRadio } = useFetchTeamRadio(sessionKey);
  console.log(teamRadio);
  return (
    <>
      <h1>TEAM RADIO</h1>
      {teamRadio && teamRadio.map((tr) => <h3>{tr.recording_url}</h3>)}
    </>
  );
}

export default TeamRadio;
