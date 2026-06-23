import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { JobsService } from '../../jobs/jobs.service';
import { InngestFunctionsService } from '../inngest-functions.service';

describe('InngestFunctionsService', () => {
  let service: InngestFunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InngestFunctionsService,
        {
          provide: JobsService,
          useValue: {},
        },
        {
          provide: getLoggerToken(InngestFunctionsService.name),
          useValue: {
            info: jest.fn<void, [unknown?, string?]>(),
            warn: jest.fn<void, [unknown?, string?]>(),
            debug: jest.fn<void, [unknown?, string?]>(),
          },
        },
      ],
    }).compile();

    service = module.get(InngestFunctionsService);
  });

  it('should expose registered Inngest functions', () => {
    const functions = service.getFunctions();

    expect(functions).toHaveLength(1);
  });
});
