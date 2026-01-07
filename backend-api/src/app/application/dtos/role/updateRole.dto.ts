import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
