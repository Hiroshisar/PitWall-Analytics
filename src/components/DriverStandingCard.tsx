import styled from 'styled-components';
import type { driverType } from '../utils/types.ts';
import {
  DriverNumber,
  DriverPortrait,
  StyledDriverRow,
} from '../style/styles.ts';

const StyledDriverCard = styled.div`
  display: grid;
  align-items: center;
  min-width: 10rem;
  width: 35rem;
  height: 120px;

  background-color: var(--color-grey-800);
  color: var(--color-grey-200);

  grid-template-columns: 2fr 3fr 1fr;
  column-gap: 1rem;
`;

function DriverStandingCard({ driver }: { driver: driverType }) {
  return (
    <StyledDriverCard>
      <DriverPortrait>
        <img
          src={`./${driver.driver_number}.png`}
          alt={`${driver.name_acronym}-${driver.driver_number}`}
          width={150}
        />
      </DriverPortrait>
      <StyledDriverRow>
        <h3>{driver.last_name.toLocaleUpperCase()}</h3>
        <h4>{driver.team_name}</h4>
      </StyledDriverRow>
      <DriverNumber>
        <h2>{driver.driver_number}</h2>
      </DriverNumber>
    </StyledDriverCard>
  );
}

export default DriverStandingCard;
