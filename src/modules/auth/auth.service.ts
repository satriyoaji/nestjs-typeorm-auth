import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { UserEntity } from 'src/modules/user/user.entity';
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {
    }

    async create(data: any) {
        try {
            return await this.userRepository.save(data)
        } catch (err) {
            // console.log(err)
            return err.sqlMessage
        }
    }

    async findOne(condition: any): Promise<UserEntity> {
        try {
            return await this.userRepository.findOne(condition)
        } catch (err) {
            // console.log(err)
            return err.sqlMessage
        }
    }
}