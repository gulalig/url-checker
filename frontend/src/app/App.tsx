import { PageHeader } from '@/components';
import { Layout } from "@/shared/Layout";
import { CreateJobForm, JobsList, JobDetails } from "@/features";

export const App = () => (
  <Layout>
    <PageHeader
      title="URL Checker"
      description="Create asynchronous URL checking jobs, track their progress and inspect per-URL results."
    />
    <CreateJobForm />
    <JobsList />
    <JobDetails />
  </Layout>
);