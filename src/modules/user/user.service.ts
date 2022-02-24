import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Connection, QueryRunner, Repository} from "typeorm";
import {BaseService} from "../../abstracts/base.service";

@Injectable()
export class UserService{
    private queryRunner: QueryRunner
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private connection: Connection
    ) {}

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
           this.queryRunner = this.connection.createQueryRunner();

            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            try {
                await this.userRepository.save(data)

                await this.queryRunner.commitTransaction();
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
            } finally {
                await this.queryRunner.release();
            }
        } catch (err) {
            // console.log(err)
            return err.sqlMessage
        }
    }

}
