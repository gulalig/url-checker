import { CreateJobDto } from '../create-job.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const validateDto = async (payload: object) => {
  const dto = plainToInstance(CreateJobDto, payload);

  return validate(dto);
};

describe('CreateJobDto', () => {
  it('should pass validation for valid HTTP and HTTPS URLs', async () => {
    const errors = await validateDto({
      urls: ['https://example.com', 'http://example.org'],
    });

    expect(errors).toHaveLength(0);
  });

  it('should fail when urls is empty', async () => {
    const errors = await validateDto({
      urls: [],
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('arrayMinSize');
  });

  it('should fail when URL has no protocol', async () => {
    const errors = await validateDto({
      urls: ['example.com'],
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isUrl');
  });

  it('should fail when urls is not an array', async () => {
    const errors = await validateDto({
      urls: 'https://example.com',
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should fail when one of the URLs is invalid', async () => {
    const errors = await validateDto({
      urls: ['https://example.com', 'invalid-url'],
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isUrl');
  });
});
