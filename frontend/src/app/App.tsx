import { PageHeader, SectionCard } from '@/components';
import { Layout } from "@/shared/Layout";

export const App = () => (
  <Layout>
    <PageHeader
      title="URL Checker"
      description="Create asynchronous URL checking jobs, track their progress and inspect per-URL results."
    />

    <SectionCard
      title="Frontend foundation"
      description="Global layout, theme and reusable UI primitives are ready."
    >
      The application is ready for feature implementation.
    </SectionCard>
  </Layout>
);