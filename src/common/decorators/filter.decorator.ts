import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function FilterBlog(){
    return applyDecorators(
        ApiQuery({name:"category",example:"fun",  required:false})    )
}