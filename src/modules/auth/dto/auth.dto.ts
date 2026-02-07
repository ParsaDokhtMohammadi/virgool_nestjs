import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator"
import { OTP_TYPE_ENUM } from "src/common/enums/checkOtpType.enum"
import { AuthMethod } from "src/common/enums/method.enum"
import { AuthTypes } from "src/common/enums/type.enum"

export class AuthDto {
    @ApiProperty()
    @IsString()
    @Length(5, 50)
    username: string
    @ApiProperty({ enum: AuthTypes })
    @IsEnum(AuthTypes)
    type: string
    @ApiProperty({ enum: AuthMethod })
    @IsEnum(AuthMethod)
    method: AuthMethod
    @ApiProperty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message:
        'Password must be at least 8 characters long and include uppercase, lowercase letters and a number',
    })
    password: string;
    @ApiProperty({required:false})
    @IsOptional()
    @IsString()
    confirm_password: string;
}


export class CheckOtpDto {
    @ApiProperty()
    @IsString()
    @Length(5, 5)
    code: string
    @ApiProperty({enum:OTP_TYPE_ENUM})
    @IsEnum(OTP_TYPE_ENUM)
    type:OTP_TYPE_ENUM
}