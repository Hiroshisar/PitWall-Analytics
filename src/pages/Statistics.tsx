import {
  StyledTab,
  StyledTabContainer,
  StyledTitle,
  StyledToolContainer,
} from '../style/styles.ts';
import { useState } from 'react';
import DriversStatistics from '../components/DriversStatistics.tsx';
import TeamsStatistics from '../components/TeamsStatistics.tsx';
import type { DriverType, TeamType } from '../utils/types.ts';

const tab_options = ['Drivers', 'Teams'];

function Statistics() {
  const [activeTab, setActiveTab] = useState<string>('');
  const [selectedDrivers, setSelectedDrivers] = useState<DriverType[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([]);

  return (
    <StyledToolContainer>
      <StyledTitle>STATISTICS</StyledTitle>

      <StyledTabContainer $quantity={tab_options.length}>
        {tab_options.map((option) => (
          <StyledTab
            key={option}
            $isSelected={option === activeTab}
            onClick={() => setActiveTab(option)}
          >
            {option}
          </StyledTab>
        ))}
      </StyledTabContainer>
      <div
        style={{
          width: '100%',
          height: 'min(100%, calc(100vw - 1rem))',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '1rem',
        }}
      >
        {activeTab === 'Drivers' && (
          <DriversStatistics
            selectedDrivers={selectedDrivers}
            onSelect={setSelectedDrivers}
          />
        )}
        {activeTab === 'Teams' && (
          <TeamsStatistics
            selectedTeams={selectedTeams}
            onSelect={setSelectedTeams}
          />
        )}
      </div>
    </StyledToolContainer>
  );
}

export default Statistics;
