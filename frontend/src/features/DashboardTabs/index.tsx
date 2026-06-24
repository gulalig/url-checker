import { type FC, type ReactNode, type SyntheticEvent, useState } from 'react';
import { Tab } from '@/components';
import { DASHBOARD_TAB_LABEL, DASHBOARD_TAB_VALUE } from '@/constants';
import type { DashboardTabValue } from '@/types';
import { JobsList, JobDetails, CreateJobForm } from '@/features';
import {
  DashboardTabsContent,
  DashboardTabsHeader,
  DashboardTabsRoot,
  StyledTabs,
  TabPanelRoot,
} from './styles';

type TabPanelProps = {
  activeValue: DashboardTabValue;
  children: ReactNode;
  value: DashboardTabValue;
};

const TabPanel: FC<TabPanelProps> = ({ activeValue, children, value }) => {
  if (activeValue !== value) {
    return null;
  }

  return <TabPanelRoot>{children}</TabPanelRoot>;
};

export const DashboardTabs: FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTabValue>(
    DASHBOARD_TAB_VALUE.CREATE_JOB,
  );

  const handleTabChange = (
    _: SyntheticEvent,
    value: DashboardTabValue,
  ): void => {
    setActiveTab(value);
  };

  const handleJobSelected = (): void => {
    setActiveTab(DASHBOARD_TAB_VALUE.JOB_DETAILS);
  };

  return (
    <DashboardTabsRoot>
      <DashboardTabsHeader>
        <StyledTabs
          onChange={handleTabChange}
          value={activeTab}
          variant="scrollable"
        >
          <Tab
            label={DASHBOARD_TAB_LABEL.CREATE_JOB}
            value={DASHBOARD_TAB_VALUE.CREATE_JOB}
          />
          <Tab
            label={DASHBOARD_TAB_LABEL.JOBS_LIST}
            value={DASHBOARD_TAB_VALUE.JOBS_LIST}
          />
          <Tab
            label={DASHBOARD_TAB_LABEL.JOB_DETAILS}
            value={DASHBOARD_TAB_VALUE.JOB_DETAILS}
          />
        </StyledTabs>
      </DashboardTabsHeader>

      <DashboardTabsContent>
        <TabPanel
          activeValue={activeTab}
          value={DASHBOARD_TAB_VALUE.CREATE_JOB}
        >
          <CreateJobForm />
        </TabPanel>

        <TabPanel
          activeValue={activeTab}
          value={DASHBOARD_TAB_VALUE.JOBS_LIST}
        >
          <JobsList onJobSelected={handleJobSelected} />
        </TabPanel>

        <TabPanel
          activeValue={activeTab}
          value={DASHBOARD_TAB_VALUE.JOB_DETAILS}
        >
          <JobDetails />
        </TabPanel>
      </DashboardTabsContent>
    </DashboardTabsRoot>
  );
};