import { Injectable } from '@nestjs/common';
import {Connection, QueryRunner} from "typeorm";
import {UserEntity} from "../modules/user/user.entity";

@Injectable()
export class BaseService {
    private _queryRunner: QueryRunner

    constructor(private _connection: Connection) {
        this._connection = _connection
    }

    get connection(): Connection {
        return this._connection;
    }
    set connection(value: Connection) {
        this._connection = value;
    }

    protected async openTransaction(): Promise<any> {
        this._queryRunner = this._connection.createQueryRunner();

        this._queryRunner.connect();
        this._queryRunner.startTransaction();
    }
    protected async closeTransaction(): Promise<any> {
        this._queryRunner.rollbackTransaction();
    }
    protected async releaseTransaction(): Promise<any> {
        this._queryRunner.release();
    }

}
