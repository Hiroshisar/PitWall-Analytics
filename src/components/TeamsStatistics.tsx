import type { DriverType, TeamType } from '../utils/types.ts';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import { useMemo, useState } from 'react';
import { getTeamImageSrc } from '../utils/helpers.ts';
import Modal from '../ui/Modal.tsx';
import TeamsList from './TeamsList.tsx';
import Spinner from '../ui/Spinner.tsx';

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
          car_image: getTeamImageSrc(driver.team_name, 'background'),
          logo: getTeamImageSrc(driver.team_name, 'logo'),
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
        {selectedTeams &&
          selectedTeams.map((team: TeamType) => <h1>{team.team_name}</h1>)}
      </div>
    </div>
  );
}

export default TeamsStatistics;
