import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDTO {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
