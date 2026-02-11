import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class changeEmailDto {
    @ApiProperty()
    @IsEmail()
    @IsString()
    email:string
}
export class changeUsernameDto{
    @ApiProperty()
    @IsString()
    @Length(3,26)
    username:string
}
