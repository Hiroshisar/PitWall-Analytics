import type { DriverType, TeamType } from '../utils/types.ts';
import DriverStandingCard from '../ui/DriverStandingCard.tsx';
import TeamStandingCard from '../ui/TeamStandingCard.tsx';

function StatisticsItem({
  driver,
  team,
}: {
  driver?: DriverType;
  team?: TeamType;
}) {
  return (
    <>
      {driver && <DriverStandingCard driver={driver} />}
      {team && <TeamStandingCard team={team} />}
    </>
  );
}

export default StatisticsItem;
