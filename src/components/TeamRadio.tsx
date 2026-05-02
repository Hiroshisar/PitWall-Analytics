import styled from 'styled-components';
import { useFetchTeamRadio } from '../hooks/useFetchTeamRadio.ts';

const StyledTeamRadioContainer = styled.div`
  padding: 1rem;
  margin: 0.5rem;

  width: 50%;
  max-height: max(0px, calc(100dvh - 64rem));

  overflow-y: auto;
`;

const StyledTeamRadioCard = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: fit-content;

  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  text-align: start;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);

  scroll-behavior: auto;
`;

const StyledTeamRadioTitle = styled.h1`
  padding-left: 4rem;
`;

const StyledTeamRadioUrl = styled.h5`
  padding-left: 1rem;
`;

const StyledTeamRadioDriver = styled.h5`
  padding-left: 2.5rem;
`;

function TeamRadio({ sessionKey }: { sessionKey: number }) {
  const { data: teamRadio } = useFetchTeamRadio(sessionKey);

  if (!teamRadio) return null;

  return (
    <StyledTeamRadioContainer>
      <StyledTeamRadioTitle>TEAM RADIO</StyledTeamRadioTitle>
      <StyledTeamRadioCard>
        {teamRadio.map((tr) => (
          <div key={`${tr.driver_number}-${tr.date}`}>
            <StyledTeamRadioUrl>{tr.recording_url}</StyledTeamRadioUrl>
            <StyledTeamRadioDriver>{tr.driver_number}</StyledTeamRadioDriver>
          </div>
        ))}
      </StyledTeamRadioCard>
    </StyledTeamRadioContainer>
  );
}

export default TeamRadio;
