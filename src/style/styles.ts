import styled, { css } from "styled-components";

export const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-500);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2.2rem 3rem;
  transition: all 0.5s;
`;

export const StyledForm = styled.form`
  background-color: var(--color-grey-400);
  color: var(--color-grey-600);

  border-radius: var(--border-radius-lg);
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
  border-radius: var(--border-radius-sm);
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
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  padding: 2px;
  padding-left: 3rem;
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

export const Analyzebg = styled.div`
  width: 100%;
  height: 100%;
  background-color: green;
`;
