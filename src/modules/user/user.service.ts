import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) {
    }

    async findAll(): Promise<UserEntity[]> {
        try {
            return await this.userRepository.find()
        } catch (err) {
            return err.sqlMessage
        }
    }

    async findOne(condition: any): Promise<UserEntity> {
        try {
            return await this.userRepository.findOne(condition)
        } catch (err) {
            return err.sqlMessage
        }
    }

    async create(data: any) {
        try {
            return await this.userRepository.save(data)
        } catch (err) {
            // console.log(err)
            return err.sqlMessage
        }
    }

}
