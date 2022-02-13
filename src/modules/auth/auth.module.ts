import {Module} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {UserService} from "../user/user.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            //     signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
            signOptions: {expiresIn: '1d'}
        })
    ],
    providers: [
        UserService,
    ],
    controllers: [AuthController]
})
export class AuthModule {}