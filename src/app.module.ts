import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PetController } from './pet/pet.controller';
import { JoiController } from './joi/joi.controller';
import { NestjsKnexModule } from 'nestjs-knexjs';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      /*  rootPath: join(__dirname, '..', 'client'), */
      rootPath: join(__dirname, '..', 'docLogin'),
    }),
    NestjsKnexModule.register({
      client: 'mysql',
      connection: {
        host: 'remotemysql.com',
        user: 'sMpFQ7ov6w',
        password: 'IaBbGcj7vZ',
        database: 'sMpFQ7ov6w',
        port: 3306,
      },
    }),
  ],
  controllers: [AppController, HealthController, PetController, JoiController],
  providers: [AppService],
})
export class AppModule {}
