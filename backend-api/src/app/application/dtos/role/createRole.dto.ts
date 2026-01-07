import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty()
  @IsString()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
