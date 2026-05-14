import {
  ModalHeader,
  ModalTitle,
  Overlay,
  StyledDriverModal,
  StyledTeamModal,
} from '../style/styles';
import DriversList from '../components/DriversList.tsx';
import type { DriverType, ModalProps, TeamType } from '../utils/types.ts';
import Button from './Button.tsx';
import TeamsList from '../components/TeamsList.tsx';

function Modal({
  drivers,
  selectedDrivers,
  teams,
  selectedTeams,
  onSelect,
  onClose,
}: ModalProps) {
  return (
    <Overlay>
      {drivers && (
        <StyledDriverModal>
          <ModalHeader>
            <ModalTitle>Select drivers</ModalTitle>
            <Button type="close" onClick={() => onClose()} />
          </ModalHeader>
          <DriversList
            drivers={drivers}
            selectedDrivers={selectedDrivers}
            onSelect={onSelect as (drivers: DriverType[]) => void}
          />
        </StyledDriverModal>
      )}
      {teams && (
        <StyledTeamModal>
          <ModalHeader>
            <ModalTitle>Select teams</ModalTitle>
            <Button type="close" onClick={() => onClose()} />
          </ModalHeader>
          <TeamsList
            teams={teams}
            selectedTeams={selectedTeams}
            onSelect={onSelect as (teams: TeamType[]) => void}
          />
        </StyledTeamModal>
      )}
    </Overlay>
  );
}

export default Modal;
