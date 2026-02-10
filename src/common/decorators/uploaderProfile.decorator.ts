import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import {  multerStorage } from "../utils/multer.utils";

export function ProfileFileUploader(){
    return applyDecorators(
        UseInterceptors(FileFieldsInterceptor([
            {name:"image_profile",maxCount:1},
            {name:"image_bg",maxCount:1},
          ],{
            storage:multerStorage("user-profile")
          }
            ))
    )
}