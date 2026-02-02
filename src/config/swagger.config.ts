import { INestApplication } from "@nestjs/common"
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"
export const SwaggerConfigInit=(app:INestApplication):void => {
    const document = new DocumentBuilder()
    .setTitle("Virgool clone")
    .setDescription("backend endpoints of virgool clone")
    .setVersion("v1.0.0")
    .build()
    const swaggerDocument = SwaggerModule.createDocument(app,document)
    SwaggerModule.setup("/swagger",app,swaggerDocument)
}