import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsEmail, IsNotEmpty} from "class-validator";


@Entity('users') //table_name
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    name: string;

    // @Unique('Email', ['email'])
    @IsEmail()
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    image: string;

    @Column({ default: true })
    isActive: boolean;
}