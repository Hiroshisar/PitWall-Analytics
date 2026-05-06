import { useFetchStandings } from '../hooks/useFetchStandings.ts';
import Spinner from '../ui/Spinner.tsx';
import styled from 'styled-components';
import DriverStandingCard from '../components/DriverStandingCard.tsx';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import type { driverType } from '../utils/types.ts';
import TeamStandingCard from '../components/TeamStandingCard.tsx';

const StyledChampionshipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 2rem 4rem;
`;

const StyledChampionshipsRow = styled.div`
  width: 100%;
  max-width: 122rem;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: flex-start;
  justify-items: center;
  margin-top: 5rem;
  gap: 5rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const StyledChampionshipsTitle = styled.h1`
  margin-top: 5rem;
`;

const StyledChampionshipsSection = styled.section`
  width: 100%;
  max-width: 58rem;
  text-align: center;
`;

const StyledChampionshipsColumn = styled.div`
  display: grid;
  grid-template-columns: 7rem minmax(35rem, 1fr) 10rem;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;

  text-align: center;
  align-items: center;
  justify-items: center;

  padding-right: 1rem;
  padding-left: 1rem;
`;

const StyledPositionRow = styled.div`
  border: 1px solid var(--color-grey-400);
  border-radius: var(--border-radius-3xl);
  margin-top: 1rem;
`;

function Championships() {
  const { data: standings, isLoading: standingsLoading } = useFetchStandings();
  const { data: drivers, isLoading: driversLoading } = useFetchDrivers();

  if (!standings || !drivers) return null;
  if (standingsLoading || driversLoading) return <Spinner />;

  return (
    <StyledChampionshipsContainer>
      <StyledChampionshipsTitle>CHAMPIONSHIPS</StyledChampionshipsTitle>
      <StyledChampionshipsRow>
        <StyledChampionshipsSection>
          <h1>Piloti</h1>
          <StyledChampionshipsColumn>
            <h2>Pos</h2>
            <h2>Driver</h2>
            <h2>Points</h2>
          </StyledChampionshipsColumn>
          {standings.drivers.map((driver) => (
            <StyledPositionRow key={driver.driver_number}>
              <StyledChampionshipsColumn>
                <h3>{`${driver.position_current}°`}</h3>
                <DriverStandingCard
                  driver={
                    drivers.find(
                      (d) => d.driver_number === driver.driver_number
                    ) ?? ({} as driverType)
                  }
                />
                <h3>{`${driver.points_current} pts`}</h3>
              </StyledChampionshipsColumn>
            </StyledPositionRow>
          ))}
        </StyledChampionshipsSection>
        <StyledChampionshipsSection>
          <h1>Team</h1>
          <StyledChampionshipsColumn>
            <h2>Pos</h2>
            <h2>Team</h2>
            <h2>Points</h2>
          </StyledChampionshipsColumn>
          {standings.teams.map((team) => (
            <StyledPositionRow key={team.team_name}>
              <StyledChampionshipsColumn>
                <h3>{`${team.position_current}°`}</h3>
                <TeamStandingCard team={team} />
                <h3>{team.points_current}</h3>
              </StyledChampionshipsColumn>
            </StyledPositionRow>
          ))}
        </StyledChampionshipsSection>
      </StyledChampionshipsRow>
    </StyledChampionshipsContainer>
  );
}

export default Championships;
