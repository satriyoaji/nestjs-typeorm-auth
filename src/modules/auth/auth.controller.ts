import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import * as bcrypt from 'bcrypt';
import {Response, Request} from "express";
import {JwtService} from "@nestjs/jwt";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService
    ) {}

    @Post('register')
    async register(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await this.authService.create({
             name,
            email,
            password: hashedPassword
        });

        if (Object.prototype.toString.apply(user) == '[object String]') {
            if (user.includes("Duplicate entry")) {
                throw new BadRequestException('the same email is exist !');
            } else {
                throw new BadRequestException(user);
            }
        }

        delete user.password;

        return {
            message: "User created !",
            data: user
        };
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response //give passthrough to true in order to send the cookie out of this backend
    ) {
        const user = await this.authService.findOne({email});

        if (!user) {
            throw new BadRequestException('invalid credentials');
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});
        //frontend won't be able to access this jwt, so httpOnly set to true

        return {
            message: 'Login success'
        };
    }

    @Get('user')
    async user(@Req() request: Request) {
        try {
            console.log(request.cookies)
            const cookie = request.cookies['jwt'];

            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                throw new UnauthorizedException();
            }

            const user = await this.authService.findOne({id: data['id']});

            const {password, ...result} = user;

            return result;
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException();
        }
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'logout success'
        }
    }
}
