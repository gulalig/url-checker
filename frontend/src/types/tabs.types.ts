import { DASHBOARD_TAB_VALUE } from '@/constants';

export type DashboardTabValue =
  (typeof DASHBOARD_TAB_VALUE)[keyof typeof DASHBOARD_TAB_VALUE];