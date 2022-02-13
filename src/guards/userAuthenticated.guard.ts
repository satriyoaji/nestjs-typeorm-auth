import {CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {UserService} from "../modules/user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserAuthenticated implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const cookie = request.cookies['jwt'];

        if (!cookie) {
            throw new UnauthorizedException();
            return false
        }

        const data = await this.jwtService.verifyAsync(cookie);
        if (!data) {
            throw new UnauthorizedException();
            return false
        } else {
            return true
        }

    }
}
