import { useFetchStandings } from '../hooks/useFetchStandings.ts';
import Spinner from '../ui/Spinner.tsx';
import styled from 'styled-components';
import DriverStandingCard from '../ui/DriverStandingCard.tsx';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import type { driverType } from '../utils/types.ts';
import TeamStandingCard from '../ui/TeamStandingCard.tsx';

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
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  gap: 1.5rem;

  @media (max-width: 1200px) {
    max-width: 100%;
    overflow-x: auto;
  }
`;

const StyledChampionshipsTitle = styled.h1`
  margin-top: 5rem;
`;

const standingsColumns =
  '10rem minmax(35rem, 1fr) 7rem minmax(35rem, 1fr) 10rem';

const StyledChampionshipsHeader = styled.div`
  display: grid;
  grid-template-columns: ${standingsColumns};
  gap: 1rem;
  min-width: 100rem;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  text-align: center;
`;

const StyledDriversTitle = styled.h2`
  grid-column: 1 / 3;
`;

const StyledTeamsTitle = styled.h2`
  grid-column: 4 / 6;
`;

const StyledPositionRow = styled.div`
  display: grid;
  grid-template-columns: ${standingsColumns};
  gap: 1rem;
  min-width: 100rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  align-items: center;
  justify-items: center;
`;

const StyledPoints = styled.h3`
  width: 100%;
`;

const StyledPosition = styled.h3`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StyledEmptyStandingCell = styled.div`
  width: 35rem;
  height: 120px;
`;

function Championships() {
  const { data: standings, isLoading: standingsLoading } = useFetchStandings();
  const { data: drivers, isLoading: driversLoading } = useFetchDrivers();

  if (!standings || !drivers) return null;
  if (standingsLoading || driversLoading) return <Spinner />;

  const sortedPositions = Array.from(
    new Set([
      ...standings.drivers.map((driver) => driver.position_current),
      ...standings.teams.map((team) => team.position_current),
    ])
  ).sort((a, b) => a - b);

  return (
    <StyledChampionshipsContainer>
      <StyledChampionshipsTitle>CHAMPIONSHIPS</StyledChampionshipsTitle>
      <StyledChampionshipsRow>
        <StyledChampionshipsHeader>
          <StyledDriversTitle>Piloti</StyledDriversTitle>
          <StyledTeamsTitle>Team</StyledTeamsTitle>
        </StyledChampionshipsHeader>
        {sortedPositions.map((position) => {
          const driverStanding = standings.drivers.find(
            (driver) => driver.position_current === position
          );
          const driver = drivers.find(
            (d) => d.driver_number === driverStanding?.driver_number
          );
          const teamStanding = standings.teams.find(
            (team) => team.position_current === position
          );

          return (
            <StyledPositionRow key={position}>
              <StyledPoints>
                {driverStanding ? `${driverStanding.points_current} pts` : ''}
              </StyledPoints>
              {driverStanding ? (
                <DriverStandingCard driver={driver ?? ({} as driverType)} />
              ) : (
                <StyledEmptyStandingCell />
              )}
              <StyledPosition>{`${position}\u00b0`}</StyledPosition>
              {teamStanding ? (
                <TeamStandingCard team={teamStanding} />
              ) : (
                <StyledEmptyStandingCell />
              )}
              <StyledPoints>
                {teamStanding ? `${teamStanding.points_current} pts` : ''}
              </StyledPoints>
            </StyledPositionRow>
          );
        })}
      </StyledChampionshipsRow>
    </StyledChampionshipsContainer>
  );
}

export default Championships;
