import { PageHeader } from '@/components';
import { Layout } from '@/shared/Layout';
import { DashboardTabs } from '@/features';
import { APP_COPY } from '@/constants'

export const App = () => (
  <Layout>
      <PageHeader
        title={APP_COPY.TITLE}
        description={APP_COPY.DESCRIPTION}
      />

      <DashboardTabs />
  </Layout>
);