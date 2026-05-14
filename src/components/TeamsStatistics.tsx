import type { DriverType, TeamType } from '../utils/types.ts';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import { useMemo, useState } from 'react';
import Modal from '../ui/Modal.tsx';
import TeamsList from './TeamsList.tsx';
import Spinner from '../ui/Spinner.tsx';
import StatisticsItem from './StatisticsItem.tsx';
import { StyledTabContainer } from '../style/styles.ts';

function TeamsStatistics({
  selectedTeams,
  onSelect,
}: {
  selectedTeams: TeamType[];
  onSelect: (teams: TeamType[]) => void;
}) {
  const { data: drivers, isLoading: isLoadingDrivers } = useFetchDrivers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamsData = useMemo(() => {
    const teams: TeamType[] = [];

    drivers?.map((driver: DriverType) => {
      const driverTeam = teams.find(
        (team) => team.team_name === driver.team_name
      );
      if (driverTeam) {
        driverTeam.team_drivers.push(driver);
      } else {
        teams.push({
          team_name: driver.team_name,
          team_colour: driver.team_colour,
          team_drivers: [driver],
        });
      }
    });

    return teams;
  }, [drivers]);

  const handleTeamsSelection = (teams: TeamType[]) => {
    onSelect(teams);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isModalOpen)
    return (
      <Modal
        teams={teamsData ?? []}
        selectedTeams={selectedTeams}
        onSelect={handleTeamsSelection}
        onClose={handleCloseModal}
      />
    );

  if (isLoadingDrivers) return <Spinner />;

  return (
    <div>
      <div>
        <TeamsList
          type="secondary"
          teams={selectedTeams}
          onSelect={handleTeamsSelection}
          onOpen={setIsModalOpen}
        />
      </div>
      <div>
        {selectedTeams.length > 0 && (
          <StyledTabContainer $numberOfElements={selectedTeams.length}>
            {selectedTeams.map((team: TeamType) => {
              return <StatisticsItem team={team} />;
            })}
          </StyledTabContainer>
        )}
      </div>
    </div>
  );
}

export default TeamsStatistics;
