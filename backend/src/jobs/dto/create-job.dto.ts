import { ArrayMinSize, ArrayUnique, IsArray, IsUrl } from 'class-validator';

const normalizeUrlForUniqueness = (url: string): string =>
  url.trim().replace(/\/+$/, '').toLowerCase();

export class CreateJobDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique(normalizeUrlForUniqueness, {
    message: 'Duplicate URLs are not allowed',
  })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      each: true,
    },
  )
  urls!: string[];
}
