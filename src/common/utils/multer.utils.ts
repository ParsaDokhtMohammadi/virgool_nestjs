import { mkdirSync } from 'fs';
import { nanoid } from 'nanoid';
import { extname, join } from 'path';
import { AuthRequest } from 'src/common/types/authRequest.type';

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
        const filename = `img_${nanoid(15)}.${ext}`
        callback(null,filename)
}