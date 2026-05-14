import { useEffect, useState } from 'react';
import {
  ListItem,
  ListContainer,
  StyledListGrid,
  StyledListGridColumn,
  StyledList,
  StyledButton,
  StyledListGridRows,
} from '../style/styles';
import type { TeamType, TeamsListProps } from '../utils/types';
import { FaPlus } from 'react-icons/fa';
import Button from '../ui/Button.tsx';
import Team from './Team.tsx';

const noSelectedTeams: TeamType[] = [];

function TeamsList({
  teams,
  selectedTeams = noSelectedTeams,
  onSelect,
  type = 'main',
  onOpen,
}: TeamsListProps) {
  const [tempTeams, setTempTeams] = useState<TeamType[]>(selectedTeams);
  const canSelectTeams = Boolean(onSelect);

  useEffect(() => {
    setTempTeams(selectedTeams);
  }, [selectedTeams]);

  const handleConfirmSelection = () => {
    if (onSelect) onSelect(tempTeams);
  };

  const handleClick = (teamName: string) => {
    if (!canSelectTeams) return;

    setTempTeams((currentTeams) => {
      const alreadySelected = currentTeams.some(
        (t) => t.team_name === teamName
      );

      if (alreadySelected) {
        return currentTeams.filter((t) => t.team_name !== teamName);
      }

      const selectedTeam = teams.find((t) => t.team_name === teamName);

      return selectedTeam ? [...currentTeams, selectedTeam] : currentTeams;
    });
  };

  const isItemSelected = (teamName: string) =>
    !!tempTeams.find((t) => t.team_name === teamName);

  const handleRemoveTeam = (teamName: string) => {
    const filteredList = teams.filter((team) => team.team_name !== teamName);
    if (onSelect) {
      setTempTeams(filteredList);
      onSelect(filteredList);
    }
  };

  return (
    <ListContainer>
      <StyledList $variant={type}>
        <StyledListGrid $variant={type}>
          <StyledListGridColumn $variant={type}>
            {teams.map((team) => (
              <StyledListGridRows key={`${team.team_name}`} $variant={type}>
                <ListItem
                  $isInteractive={canSelectTeams}
                  onClick={
                    canSelectTeams
                      ? () => handleClick(team.team_name)
                      : undefined
                  }
                >
                  <Team
                    team={team}
                    isItemSelected={isItemSelected(team.team_name)}
                    type={type}
                    onRemove={handleRemoveTeam}
                  />
                </ListItem>
              </StyledListGridRows>
            ))}
            {type === 'secondary' && (
              <ListItem $isInteractive={true}>
                <StyledButton
                  onClick={() => {
                    if (onOpen) onOpen(true);
                  }}
                >
                  <FaPlus />
                </StyledButton>
              </ListItem>
            )}
          </StyledListGridColumn>
        </StyledListGrid>
        {type === 'main' ? (
          <Button
            type="confirm"
            disabled={tempTeams.length < 1}
            onClick={handleConfirmSelection}
          >
            PROCEDI
          </Button>
        ) : null}
      </StyledList>
    </ListContainer>
  );
}

export default TeamsList;
