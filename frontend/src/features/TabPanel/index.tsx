import { FC, ReactNode } from "react";
import { DashboardTabValue } from "@/types";
import { TabPanelRoot} from "./styles";

type TabPanelProps = {
  activeValue: DashboardTabValue;
  children: ReactNode;
  value: DashboardTabValue;
};

export const TabPanel: FC<TabPanelProps> = ({ activeValue, children, value }) => {
  if (activeValue !== value) {
    return null;
  }

  return <TabPanelRoot>{children}</TabPanelRoot>;
};