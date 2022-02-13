import {Controller, Get, NotFoundException, Param, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";
import {UserAuthenticated} from "../../guards/userAuthenticated.guard";

@Controller('user')
@UseGuards(UserAuthenticated)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserEntity|any> {
        try {
            const user = await this.userService.findOne({
                id: id
            });
            if (!user) {
                return new NotFoundException('This User doesn\'t exist').getResponse();
            }

            return user;
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException();
        }
    }
}
