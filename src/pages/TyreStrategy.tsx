import { useFetchStints } from '../hooks/useFetchStints.ts';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import Spinner from '../ui/Spinner.tsx';
import { StyledTitle, StyledToolContainer } from '../style/styles.ts';
import { useFetchPit } from '../hooks/useFetchPit.ts';
import { TyreStrategyBarChart } from '../components/TyreStrategyBarChart.tsx';

function TyreStrategy() {
  const { data: stints = [], isLoading: isLoadingStints } = useFetchStints();
  const { data: drivers = [], isLoading: isLoadingDrivers } = useFetchDrivers();
  const { data: pits = [], isLoading: isLoadingPits } = useFetchPit();

  if (isLoadingDrivers || isLoadingStints || isLoadingPits) return <Spinner />;

  return (
    <StyledToolContainer>
      <StyledTitle>TYRE STRATEGY</StyledTitle>

      <TyreStrategyBarChart drivers={drivers} pits={pits} stints={stints} />
    </StyledToolContainer>
  );
}

export default TyreStrategy;
