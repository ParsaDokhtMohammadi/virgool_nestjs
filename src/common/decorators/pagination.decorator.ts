import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function Pagination(){
    return applyDecorators(
        ApiQuery({name:"page",example:1,  required:false , type:"interger"}),
        ApiQuery({name:"limit",example:5, required:false , type:"interger"})
    )
}