import { ArrayMinSize, IsArray, IsUrl } from 'class-validator';

export class CreateJobDto {
  @IsArray()
  @ArrayMinSize(1)
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