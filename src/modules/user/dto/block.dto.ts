import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class BlockDto {
    @ApiProperty()
    @IsNumberString()
    user_id:number
}