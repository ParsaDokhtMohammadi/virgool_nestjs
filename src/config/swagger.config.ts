import { INestApplication } from "@nestjs/common"
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"
export const SwaggerConfigInit=(app:INestApplication):void => {
    const document = new DocumentBuilder()
    .setTitle("Virgool clone")
    .setDescription("backend endpoints of virgool clone")
    .setVersion("v1.0.0")
    .addBearerAuth(swaggerAuthConfig(),"Authorization")
    .build()
    const swaggerDocument = SwaggerModule.createDocument(app,document)
    SwaggerModule.setup("/swagger",app,swaggerDocument)
}
function swaggerAuthConfig():SecuritySchemeObject{
    return {
        type:"http",
        bearerFormat:"JWT",
        in:"header",
        scheme:"bearer"
    }
}