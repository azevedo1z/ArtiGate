import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDTO {
    
    @ApiProperty()
    name: string;
    
    constructor(name: string){
        this.name = name;
    }
}