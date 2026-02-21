import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsDate, IsEnum, IsOptional, IsString, Length } from "class-validator"
import { GENDER_ENUM } from "src/common/enums/gender.enum"

export class ProfileDto {
        @ApiPropertyOptional({nullable:true})
        @IsOptional()
        @IsString()
        @Length(3,26)
        nick_name: string
        @ApiPropertyOptional({nullable:true})
        @IsOptional()
        @IsString()
        @Length(10,200)
        bio:string
        @ApiPropertyOptional({nullable:true,format:"binary"})
        @IsOptional()
        @IsString()
        image_profile:string
        @ApiPropertyOptional({nullable:true,format:"binary"})
        @IsOptional()
        @IsString()
        image_bg:string
        @ApiPropertyOptional({nullable:true,enum:GENDER_ENUM})
        @IsEnum(GENDER_ENUM)
        @IsOptional()
        gender:string
        @ApiPropertyOptional({nullable:true,example:"2000-02-10T07:48:53.096Z"})
        @IsOptional()
        @IsDate()
        birthday:Date
        @ApiPropertyOptional({nullable:true})
        @IsOptional()
        @IsString()
        linkedin_profile:string
        @ApiPropertyOptional({nullable:true})
        @IsOptional()
        @IsString()
        x_profile:string
} 
