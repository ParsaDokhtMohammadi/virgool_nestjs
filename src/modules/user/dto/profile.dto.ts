import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsString, Length } from "class-validator"
import { GENDER_ENUM } from "src/common/enums/gender.enum"

export class ProfileDto {
        @ApiPropertyOptional({nullable:true})
        @Length(3,26)
        nick_name: string
        @ApiPropertyOptional({nullable:true})
        @Length(10,200)
        bio:string
        @ApiPropertyOptional({nullable:true,format:"binary"})
        image_profile:string
        @ApiPropertyOptional({nullable:true,format:"binary"})
        image_bg:string
        @ApiPropertyOptional({nullable:true,enum:GENDER_ENUM})
        @IsEnum(GENDER_ENUM)
        gender:string
        @ApiPropertyOptional({nullable:true,example:"2000-02-10T07:48:53.096Z"})
        birthday:Date
        @ApiPropertyOptional({nullable:true})
        linkedin_profile:string
        @ApiPropertyOptional({nullable:true})

        x_profile:string
}