import {Module} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '1d'}
        })
        // PassportModule,
        // UsersModule,
        // JwtModule.register({
        //     secret: process.env.JWTKEY,
        //     signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
        // }),
    ],
    providers: [
        AuthService,
        // LocalStrategy,
        // JwtStrategy,
    ],
    controllers: [AuthController]
})
export class AuthModule {}