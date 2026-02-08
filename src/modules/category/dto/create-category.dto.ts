import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    title:string
    @ApiPropertyOptional()
    priority:number
}
