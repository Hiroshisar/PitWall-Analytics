import styled, { css } from 'styled-components';

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

export const StyledFromField = styled.div`
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
  border: solid 1 var(--color-grey-800);
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
  grid-template-columns: 15rem minmax(0, 1fr);
  gap: 1rem;
  width: 100%;
  min-height: 100vh;
  padding-left: 10px;
  box-sizing: border-box;

  & > :nth-child(2) {
    min-width: 0;
    width: 100%;
    overflow-x: hidden;
    overflow-wrap: anywhere;
  }
`;

export const StyledSidebar = styled.div`
  position: sticky;
  top: 10px;
  align-self: start;
  height: calc(100vh - 20px);
  overflow-y: auto;
  box-sizing: border-box;
`;

export const StyledDashboard = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 5px;
  padding: 1rem;
  width: 100%;
  min-height: 100vh;
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
  border-color: var(--color-grey-400);
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
`;

export const DriversListContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
`;

export const StyledDriversList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  overflow-x: none;

  height: fit-content;
  width: 100%;

  padding: 1.5rem 2rem;
  gap: 1rem;
`;

export const StyledDriversGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 1rem;
  justify-content: center;
  width: 100%;
`;

export const ColoredCircle = styled.div<{ color: string }>`
  border: 1px solid white;
  border-radius: 50%;
  background-color: #${(props) => props.color};
  height: 1.2rem;
  width: 1.2rem;
  margin-right: 1rem;
`;

export const StyledDriverMain = styled.div<{ selected: boolean }>`
  display: flex;
  min-width: 10rem;
  width: 40rem;
  height: 100%;
  align-items: center;

  background-color: ${(props) =>
    props.selected ? 'var(--color-grey-200)' : 'var(--color-grey-800)'};

  color: ${(props) =>
    props.selected ? 'var(--color-grey-800)' : 'var(--color-grey-200)'};

  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-3xl);
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  column-gap: 1rem;
`;

export const StyledDriverSecondary = styled.div`
  display: flex;
  width: 12rem;
  height: fit-content;
  vertical-align: middle;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-3xl);
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
  justify-content: center;
  align-items: center;
  margin-right: auto;

  font-weight: 800;
  font-size: xx-large;
`;

export const StyledDriverRow = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  align-items: center;

  margin-left: 0.5rem;

  p {
    font-weight: 600;
  }
`;

export const StyledAnalyze = styled.div`
  min-width: 100%;
  box-sizing: border-box;
  height: fit-content;

  padding: 3rem;

  display: grid;
  grid-template-rows: 1fr auto 1fr;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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

export const StyledSession = styled.div<{
  $islive: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.$islive ? 'space-between' : 'center')};
  gap: 5rem;
  align-content: center;
  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
  box-shadow: var(--shadow-lg);
  padding: 1.5rem 2rem;

  width: 100%;
  box-sizing: border-box;

  & > div {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
`;

export const StyledSelect = styled.select`
  width: 8rem;
  text-align: center;
  background-color: var(--color-grey-800);
  color: var(--color-grey-300);
`;

export const StyledOption = styled.option`
  color: var(--color-grey-300);
`;
