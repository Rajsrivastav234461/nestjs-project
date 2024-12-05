import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './users/users.module';
import { ValidationPipe } from '@nestjs/common';


//throttler
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('POST MANAGEMENT SYSTEM WITH PERMISSION')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer Authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //included modules for support 
  const configOption=new DocumentBuilder()
  .setTitle('For support')
  .setDescription('for details and modules')
  .build();
  const document_sop =SwaggerModule.createDocument(app,configOption,{
    include:[UsersModule]
  })
  SwaggerModule.setup('api-doc',app,document_sop);
 
 
  
  //automatic validation of incoming requests:
  app.useGlobalPipes(new ValidationPipe());
 

  await app.listen(3000);
}
bootstrap();
