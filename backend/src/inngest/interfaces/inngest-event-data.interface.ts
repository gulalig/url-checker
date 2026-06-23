export interface UrlCheckRequestedEventData {
  jobId: string;
  urlCheckId: string;
  url: string;
}

export interface JobCancelledEventData {
  jobId: string;
}
