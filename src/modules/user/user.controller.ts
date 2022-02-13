import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    UnauthorizedException, UploadedFile,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";
import {UserAuthenticated} from "../../guards/userAuthenticated.guard";
import * as bcrypt from "bcrypt";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {editFileName, imageFileFilter} from "../../helpers/fileFormatter";

@Controller('user')
@UseGuards(UserAuthenticated)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get()
    async getAll(@Param('id') id: number): Promise<UserEntity|any> {
        try {
            const user = await this.userService.findAll();
            if (!user) {
                return new NotFoundException('No User found').getResponse();
            }

            return user;
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException();
        }
    }

    @Get(':id')
    async show(@Param('id') id: number): Promise<UserEntity|any> {
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

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/users',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter, //error callback must be sent to JSON response
        }),
    )
    async store(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @UploadedFile() image
    ): Promise<UserEntity|any> {
        let responseFile = {
            originalName: image.originalname,
            imageName: image.filename,
        };

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.userService.create({
            name,
            email,
            password: hashedPassword,
            image: responseFile.imageName
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
            message: "New user created !",
            data: user
        };
    }
}
