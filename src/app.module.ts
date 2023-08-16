import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  // imports: [MongooseModule.forRoot('mongodb://localhost/reqres'), AuthModule, UserModule],
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://reqres:1234@cluster0.zdj1tou.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
