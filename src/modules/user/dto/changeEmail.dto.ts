import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class changeEmailDto {
    @ApiProperty()
    @IsEmail()
    @IsString()
    email:string
}