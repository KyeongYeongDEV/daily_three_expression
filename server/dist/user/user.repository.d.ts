import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";
export declare class UserRepository {
    private readonly datasource;
    constructor(datasource: DataSource);
    findUserByEmail(email: string): Promise<UserEntity>;
}
