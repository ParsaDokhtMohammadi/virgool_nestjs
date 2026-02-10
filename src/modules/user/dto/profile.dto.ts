import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString, Length } from "class-validator"
import { GENDER_ENUM } from "src/common/enums/gender.enum"

export class ProfileDto {
        @ApiPropertyOptional({nullable:true})
        @Length(3,26)
        @IsOptional()
        nick_name: string
        @ApiPropertyOptional({nullable:true})
        @Length(10,200)
        @IsOptional()
        bio:string
        @ApiPropertyOptional({nullable:true,format:"binary"})
        @IsOptional()
        image_profile:string
        @ApiPropertyOptional({nullable:true,format:"binary"})
        @IsOptional()
        image_bg:string
        @ApiPropertyOptional({nullable:true,enum:GENDER_ENUM})
        @IsEnum(GENDER_ENUM)
        @IsOptional()
        gender:string
        @ApiPropertyOptional({nullable:true,example:"2000-02-10T07:48:53.096Z"})
        @IsOptional()
        birthday:Date
        @ApiPropertyOptional({nullable:true})
        @IsOptional()
        linkedin_profile:string
        @ApiPropertyOptional({nullable:true})
        @IsOptional()
        x_profile:string
} 