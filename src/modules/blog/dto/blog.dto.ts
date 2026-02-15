import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateBlogDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(10,100)
    title:string
    @ApiPropertyOptional()
    @IsString()
    @Length(10,40)
    @IsOptional()
    slug:string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(10,250)
    description:string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(200,2000)
    content:string
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    read_time:number
    @ApiPropertyOptional()
    @IsOptional({always:true})
    image:string
    
}