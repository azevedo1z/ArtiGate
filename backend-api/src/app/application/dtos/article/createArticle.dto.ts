import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Transform } from 'class-transformer';

const parseAuthorIds = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((v) => String(v));

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v));
      } catch {
        return [trimmed];
      }
    }
    return trimmed.length > 0 ? [trimmed] : [];
  }

  return [];
};

export class CreateArticleDTO {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  summary: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @Transform(({ value }) => parseAuthorIds(value))
  authorIds: string[];

  constructor(summary: string, authorIds: string[]) {
    this.summary = summary;
    this.authorIds = authorIds;
  }
}
