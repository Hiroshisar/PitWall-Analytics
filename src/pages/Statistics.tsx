import {
  StyledTab,
  StyledTabContainer,
  StyledTitle,
  StyledToolContainer,
} from '../style/styles.ts';
import { useState } from 'react';
import DriversStatistics from '../components/DriversStatistics.tsx';
import TeamsStatistics from '../components/TeamsStatistics.tsx';

const tab_options = ['Drivers', 'Teams'];

function Statistics() {
  const [activeTab, setActiveTab] = useState<string>('');

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
        {activeTab === 'Drivers' && <DriversStatistics />}
        {activeTab === 'Teams' && <TeamsStatistics />}
      </StyledTabContainer>
    </StyledToolContainer>
  );
}

export default Statistics;
