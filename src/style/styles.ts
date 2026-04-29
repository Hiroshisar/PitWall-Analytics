import styled, { css } from 'styled-components';

export type DriversListVariant = 'main' | 'secondary';

const driverCardBase = css`
  display: grid;
  align-items: center;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-3xl);
`;

export const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-500);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
  padding: 2.2rem 3rem;
  transition: all 0.5s;
`;

export const StyledForm = styled.form`
  background-color: var(--color-grey-400);
  color: var(--color-grey-600);

  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
  }

  input,
  select {
    background-color: var(--color-grey-300);
    height: 30px;
    width: 400px;

    text-align: center;
  }
`;

export const StyledFormField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 9999;
  transition: all 0.5s;
`;

const spinAnimation = css`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: spin 1.5s linear infinite;
`;

export const SpinnerRing = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  margin: 4.8rem auto;

  ${spinAnimation}

  background: 
    radial-gradient(farthest-side, var(--color-red-700) 94%, transparent) top/10px 10px no-repeat,
    conic-gradient(transparent 30%, var(--color-red-700));

  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 10px),
    black 0
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 10px),
    var(--color-grey-900) 0
  );
`;

export const Button = styled.button`
  background: none;
  border: 1px solid var(--color-grey-800);
  padding: 0.4rem;
  border-radius: var(--border-radius-3xl);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: var(--color-grey-500);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

export const StyledMainLayout = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  margin-left: 1rem;

  & > :nth-child(2) {
    min-width: 0;
    width: calc(100% - 2rem);
    min-height: calc(100vh - 2rem);
    margin: 1rem;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-wrap: anywhere;
  }
`;

export const StyledSidebar = styled.div`
  position: sticky;
  top: 10px;
  align-self: start;
  height: calc(100vh - 20px);
  width: 250px;

  justify-items: center;
  align-items: center;

  overflow-y: auto;
  overflow-x: hidden;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);

  padding: 3px;
`;

export const StyledDashboard = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 5px;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
`;

export const DashboardRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  padding: 2px;
  gap: 10px;
`;

export const DashboardItem = styled.div`
  background-color: var(--color-grey-700);
  border: 1px solid var(--color-grey-400);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  vertical-align: middle;
`;

export const DashboardMain = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  column-gap: 5px;
  padding: 1rem;
  width: 100%;
`;

export const DashboardColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  padding: 2px;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
`;

export const DriversListContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  margin-right: auto;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
`;

export const StyledDriversList = styled.div<{ $variant: DriversListVariant }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  height: fit-content;
  width: 100%;
  padding: ${(props) =>
    props.$variant === 'main' ? '1.5rem 2rem' : '1rem 1.2rem'};
  gap: ${(props) => (props.$variant === 'main' ? '1rem' : '0.8rem')};
`;

export const StyledDriversGrid = styled.div<{ $variant: DriversListVariant }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => (props.$variant === 'main' ? '2rem' : '1rem')};
  justify-content: center;
  width: 100%;
`;

export const ColoredCircle = styled.div<{ $color: string }>`
  border: 1px solid white;
  border-radius: 50%;
  background-color: #${(props) => props.$color};
  height: 1.2rem;
  width: 1.2rem;
  margin-right: 1rem;
`;

export const StyledDriverMain = styled.div<{ $selected: boolean }>`
  ${driverCardBase}

  min-width: 10rem;
  width: 35rem;
  height: 100%;

  background-color: ${(props) =>
    props.$selected ? 'var(--color-grey-200)' : 'var(--color-grey-800)'};

  color: ${(props) =>
    props.$selected ? 'var(--color-grey-800)' : 'var(--color-grey-200)'};

  grid-template-columns: 2fr 3fr 1fr;
  column-gap: 1rem;
`;

export const StyledDriverSecondary = styled.div`
  ${driverCardBase}

  min-width: 14.5rem;
  position: relative;
  display: inline-flex;
  width: fit-content;
  justify-content: center;
  align-items: center;
  padding: 0.4rem 0.8rem;
  overflow: hidden;
  transition:
    padding 200ms ease,
    background-color 200ms ease,
    border-color 200ms ease;

  .remove-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0;
    min-width: 0;
    margin-left: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-red-700);
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    transform: translateX(-0.4rem) scale(0.85);
    transition:
      width 200ms ease,
      margin-left 200ms ease,
      opacity 200ms ease,
      transform 200ms ease;
  }

  &:hover,
  &:focus-within {
    padding-right: 0.9rem;

    .remove-button {
      width: 2.2rem;
      margin-left: 0.6rem;
      opacity: 1;
      pointer-events: auto;
      transform: translateX(0) scale(1);
    }
  }

  .remove-button svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
  }
`;

export const DriverPortrait = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  margin-bottom: 2rem;
`;

export const DriverNumber = styled.div`
  display: flex;

  font-weight: 800;
  font-size: large;
  padding: 5px;

  justify-content: start;
`;

export const StyledDriverRow = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  align-items: center;
  text-align: center;

  margin-left: 0.5rem;

  p {
    font-weight: 600;
  }
`;

export const StyledAnalyze = styled.div`
  min-width: 100%;
  box-sizing: border-box;
  height: fit-content;

  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  gap: 1rem;
`;

export const TelemetryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
  gap: 1rem;

  padding: 1.5rem 2rem;
`;

export const StyledTelemetry = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;

  padding: 1rem;
`;

export const StyledSelect = styled.select`
  width: 8rem;
  background-color: var(--color-grey-800);
  color: var(--color-grey-300);
  border: 1px solid var(--color-grey-600);
  border-radius: 15px;
  text-align: center;
  max-height: 8rem;
`;

export const StyledOption = styled.option`
  color: var(--color-grey-300);
`;

export const StyledTeamName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-left: 3rem;
`;

export const StyledTeamNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledDriversRowContainer = styled.div<{
  $variant: DriversListVariant;
}>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${(props) => (props.$variant === 'main' ? 'nowrap' : 'wrap')};
  gap: 1rem;
  justify-content: center;
`;

export const StyledDriversGridColumn = styled.div<{
  $variant: DriversListVariant;
}>`
  display: ${(props) => (props.$variant === 'main' ? 'grid' : 'flex')};
  grid-template-columns: ${(props) =>
    props.$variant === 'main' ? 'repeat(2, minmax(0, 1fr))' : 'none'};
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  gap: ${(props) => (props.$variant === 'main' ? '2rem' : '1rem')};
  margin-bottom: ${(props) => (props.$variant === 'main' ? '2rem' : '0')};
  width: 100%;
`;

export const StyledDriversGridRows = styled.div<{
  $variant: DriversListVariant;
}>`
  display: grid;
  grid-template-rows: ${(props) =>
    props.$variant === 'main' ? 'auto auto' : 'auto'};
  gap: 0.8rem;
  justify-content: center;
`;

export const DriverListItem = styled.div<{ $isInteractive: boolean }>`
  cursor: ${(props) => (props.$isInteractive ? 'pointer' : 'default')};
`;

export const DriversConfirmButton = styled.button`
  width: 30rem;
  height: 5rem;
  color: var(--color-grey-900);
`;

export const StyledSession = styled.div<{
  $islive: boolean;
}>`
  display: flex;
  flex-direction: row;
  margin-right: auto;
  gap: 3rem;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
  padding: 1.5rem 2rem;
  align-items: center;
  justify-content: ${(props) => (props.$islive ? 'space-between' : 'start')};

  width: 100%;
  box-sizing: border-box;
`;

export const SessionNationAndDate = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const SessionData = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 10px;
`;
