import type { DriverType, TeamType } from '../utils/types.ts';

function StatisticsItem({
  driver,
  team,
}: {
  driver?: DriverType;
  team?: TeamType;
}) {
  return (
    <>
      {driver && <h1>{driver.full_name}</h1>}
      {team && <h1>{team.teamName}</h1>}
    </>
  );
}

export default StatisticsItem;
