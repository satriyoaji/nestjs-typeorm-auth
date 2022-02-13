import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      //     signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
      signOptions: {expiresIn: '1d'}
    })
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
