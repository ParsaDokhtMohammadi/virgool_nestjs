import { mkdirSync } from 'fs';
import { nanoid } from 'nanoid';
import { extname, join } from 'path';
import { AuthRequest } from 'src/common/types/authRequest.type';
import { IMAGE_MESSAGES } from '../enums/message.enum';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export type callbackDestinationType = (error: Error|null, destination: string) => void
export type callbackFileNameType = (error: Error|null, filename: string) => void
export type MulterFile = Express.Multer.File
export function multerDestination(fieldName: string) {
    return function (
        req: AuthRequest,
        file: MulterFile,
        callback: callbackDestinationType
    ) {
        let path = join("public", "uploads", fieldName)
        mkdirSync(path,{recursive:true})
        callback(null,path)
    }
}
export function multerFileName(
        req: AuthRequest,
        file: MulterFile,
        callback: callbackFileNameType
    ) {
        const ext = extname(file.originalname)
        const correctFormat = validateFormat(ext.toLowerCase())
        if(!correctFormat){
            callback(new BadRequestException(IMAGE_MESSAGES.INVALID_FORMAT),file.originalname)
        }
        const filename = `img_${nanoid(15)}.${ext}`
        callback(null,filename)
}

function validateFormat (ext:string){
    return [".png",".jpg",".jpeg",".webp"].includes(ext)
}

export function multerStorage(folderName:string) {
            return diskStorage({
              destination:multerDestination(folderName),
              filename:multerFileName
            })
          }