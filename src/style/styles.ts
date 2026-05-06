import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export type DriversListVariant = 'main' | 'secondary';

const driverCardBase = css`
  display: grid;
  align-items: center;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-3xl);
`;

export const StyledModal = styled.div`
  position: fixed;
  inset: 5rem 10rem;
  box-sizing: border-box;
  overflow: auto;
  overscroll-behavior: contain;
  background-color: var(--color-grey-500);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
  padding: 2.2rem 3rem;
  transition: all 0.5s;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  overscroll-behavior: contain;
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

export const StyledNavLink = styled(Link)<{ $isSelected: boolean }>`
  background: none;
  border: 1px solid var(--color-grey-600);
  padding: 1rem 2rem;
  width: 200px;
  border-radius: var(--border-radius-3xl);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  margin-top: 1rem;
  text-align: center;
  background-color: ${(props) =>
    props.$isSelected ? 'var(--color-grey-200)' : 'transparent'};
  color: ${(props) =>
    props.$isSelected ? 'var(--color-grey-800)' : 'inherit'};

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

  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;

  overflow-y: auto;
  overflow-x: hidden;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);

  gap: 0.5rem;
`;

export const StyledLivePage = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  row-gap: 5px;
  width: 100%;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
`;

export const LivePageRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: space-evenly;
  padding: 2px;
  gap: 10px;
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
`;

export const LivePageCenter = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr;
  column-gap: 5px;
  padding: 1rem;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
`;

export const LivePageColumn = styled.div`
  display: grid;
  grid-template-rows: 2fr 4fr;

  padding: 2px;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
`;

export const StyledRacePosition = styled.div`
  height: 40px;
  width: 100%;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 2fr 2fr 3fr 3fr 1fr 1fr;

  justify-content: center;
  align-items: center;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);

  padding: 1px;
`;

export const StyledRacePositionTags = styled.div`
  height: 40px;
  width: 100%;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: 2fr 2fr 3fr 3fr 1fr 1fr;

  justify-content: center;
  align-items: center;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);

  padding: 1px;
`;

export const LivePageGridColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-self: stretch;
  padding: 2px;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;

  & > * {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    min-height: 0;
    box-sizing: border-box;
  }
`;

export const LiveCountdownPanel = styled.div`
  text-align: center;
  margin-top: 15rem;
`;

export const SvgMap = styled.svg`
  display: block;
  overflow: visible;
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
  background-color: ${(props) =>
    props.$color.startsWith('#') ? props.$color : `#${props.$color}`};
  height: 2rem;
  width: 2rem;
  margin-right: 1rem;
  color: var(--color-grey-300);
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;

  input {
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

export const StyledDriverTag = styled.h5<{ $color: string }>`
  height: 100%;
  width: 80px;
  padding: 2px;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);
  background-color: ${(props) =>
    props.$color
      ? props.$color.startsWith('#')
        ? props.$color
        : `#${props.$color}`
      : 'transparent'};
  text-align: center;
  align-content: center;
`;

export const StyledBestLap = styled.h5`
  color: var(--color-indigo-700);
`;

export const StyledLastLap = styled.h5`
  color: var(--color-grey-200);
`;

export const TyresCircle = styled.div<{ $color: string }>`
  border: 1px solid white;
  border-radius: 50%;
  background-color: #${(props) => props.$color};
  height: 2rem;
  width: 2rem;
  margin-right: 1rem;
  text-align: center;
  color: var(--color-grey-300);
`;

export const StyledDriverMain = styled.div<{ $selected: boolean }>`
  ${driverCardBase};

  min-width: 10rem;
  width: 35rem;
  height: 100%;

  background-color: ${(props) =>
    props.$selected ? 'var(--color-grey-200)' : 'var(--color-grey-800)'};

  color: ${(props) =>
    props.$selected ? 'var(--color-grey-800)' : 'var(--color-grey-200)'};

  grid-template-columns: 2fr 3fr 1fr;
  column-gap: 1rem;
  transition: transform 150ms ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

export const StyledDriverSecondary = styled.div`
  ${driverCardBase};

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

export const StyledNotRacePosition = styled.div`
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);
  padding: 2px;
`;

export const StyledBestAndLastLap = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  padding-left: 2px;
`;

export const LapSummaryRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledCloseButton = styled.button`
  ${driverCardBase};

  min-width: 10rem;
  height: 4rem;
  display: inline-flex;
  width: fit-content;
  justify-content: center;
  align-items: center;
  padding: 0.4rem 0.8rem;
  font-size: 2rem;
  background-color: var(--color-red-700);
  color: var(--color-grey-200);
  border-radius: var(--border-radius-3xl);

  &:hover {
    background-color: var(--color-grey-200);
    color: var(--color-red-700);
  }
`;

export const AddDriverButton = styled.div`
  ${driverCardBase};

  min-width: 14.5rem;
  position: relative;
  display: inline-flex;
  width: fit-content;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.8rem;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const ModalTitle = styled.h2`
  margin-left: 5rem;
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

export const StyledTelemetryPage = styled.div`
  min-width: 100%;
  box-sizing: border-box;
  height: fit-content;

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

export const ChartTooltip = styled.div`
  background: var(--color-grey-200);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-lg);
  padding: 8px 10px;
`;

export const ChartTooltipTitle = styled.div`
  margin-bottom: 6px;
  font-weight: 600;
  color: var(--color-grey-500);
`;

export const ChartTooltipValue = styled.div<{ $color: string }>`
  color: ${(props) => props.$color};
  line-height: 1.4;
`;

export const StyledSelect = styled.select`
  width: fit-content;
  background-color: var(--color-grey-800);
  color: var(--color-grey-300);
  border: 1px solid var(--color-grey-600);
  border-radius: 15px;
  max-height: 8rem;
  padding: 5px;
  font-size: 2rem;
  text-align: center;
`;

export const StyledOption = styled.option`
  color: var(--color-grey-300);
`;

export const StyledTeamName = styled.h2`
  font-size: 2.5rem;
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

export const SessionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export const SessionData = styled.div`
  display: flex;
  align-items: start;
  flex-direction: row;
  gap: 10px;
`;

export const StyledFlagBadge = styled.div<{ $flagColor: string }>`
  min-width: 8rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);
  background-color: ${(props) =>
    props.$flagColor ? `var(${props.$flagColor})` : 'transparent'};
  color: var(--color-grey-900);
  text-align: center;
`;

export const RaceControlContainer = styled.div`
  padding: 1rem;
  margin: 0.5rem;
  width: 50%;
  max-height: max(0px, calc(100dvh - 64rem));
  overflow-y: auto;
`;

export const RaceControlCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  margin-bottom: 0.5rem;
  padding: 1rem 1.5rem;
  text-align: start;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
`;

export const RaceControlTitle = styled.h1`
  padding-left: 4rem;
`;

export const RaceControlMessage = styled.h5`
  padding-left: 1rem;
`;

export const RaceControlMessageTime = styled.h5`
  padding-left: 2.5rem;
`;

export const SessionGridContainer = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  align-content: start;
  gap: 3px;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const RacePositionDriverHeader = styled.h5`
  padding-left: 1rem;
`;

export const WeatherItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;

export const WeatherIcon = styled.div`
  width: 40px;
  height: 40px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const WeatherWindRow = styled.h4`
  display: flex;
  justify-content: space-between;
`;

export const WeatherWindDirection = styled.span<{ $degrees: number }>`
  svg {
    transform: rotate(${(props) => props.$degrees}deg);
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

export const TyresSummary = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2px;
`;

export const HomeTitleContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoImage = styled.img`
  width: 100%;
`;
