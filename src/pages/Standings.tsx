import { useFetchStandings } from '../hooks/useFetchStandings.ts';
import Spinner from '../ui/Spinner.tsx';
import DriverStandingCard from '../ui/DriverStandingCard.tsx';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import type { driverType } from '../utils/types.ts';
import TeamStandingCard from '../ui/TeamStandingCard.tsx';
import {
  StyledToolContainer,
  StyledChampionshipsHeader,
  StyledChampionshipsRow,
  StyledTitle,
  StyledDriversTitle,
  StyledEmptyStandingCell,
  StyledPoints,
  StyledPosition,
  StyledPositionRow,
  StyledTeamsTitle,
} from '../style/styles.ts';

function Standings() {
  const { data: standings, isLoading: standingsLoading } = useFetchStandings();
  const { data: drivers, isLoading: driversLoading } = useFetchDrivers();

  if (!standings || !drivers) return null;

  const sortedPositions = Array.from(
    new Set([
      ...standings.drivers.map((driver) => driver.position_current),
      ...standings.teams.map((team) => team.position_current),
    ])
  ).sort((a, b) => a - b);

  return (
    <StyledToolContainer>
      {(standingsLoading || driversLoading) && <Spinner />}
      <StyledTitle>STANDINGS</StyledTitle>
      <StyledChampionshipsRow>
        <StyledChampionshipsHeader>
          <StyledDriversTitle>Drivers</StyledDriversTitle>
          <StyledTeamsTitle>Teams</StyledTeamsTitle>
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
    </StyledToolContainer>
  );
}

export default Standings;
