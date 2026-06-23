import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import * as jobInterface from './interfaces/job.interface';
import { JobsService } from './jobs.service';
import { CreateJobResponse } from './interfaces/job.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  createJob(@Body() dto: CreateJobDto): Promise<CreateJobResponse> {
    return this.jobsService.createJob(dto);
  }

  @Get()
  getJobs(): jobInterface.JobSummary[] {
    return this.jobsService.getJobs();
  }

  @Get(':id')
  getJobDetails(@Param('id') jobId: string): jobInterface.JobDetails {
    return this.jobsService.getJobDetails(jobId);
  }

  @Delete(':id')
  cancelJob(@Param('id') jobId: string): Promise<CreateJobResponse> {
    return this.jobsService.cancelJob(jobId);
  }
}
