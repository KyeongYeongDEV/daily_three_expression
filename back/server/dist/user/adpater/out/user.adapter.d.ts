import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../domain/user.entity';
import { UserPort } from '../../port/user.port';
import { UserExistDTO } from '../../dto/response.dto';
import { UserEmailType } from '../../../common/types/user.type';
export declare class UserAdapter implements UserPort {
    private readonly userRepository;
    private readonly dataSource;
    constructor(userRepository: Repository<UserEntity>, dataSource: DataSource);
    findAllUsersEmail(): Promise<UserEmailType[]>;
    findUserInfoByEmail(email: string): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserExistDTO | null>;
    findUserByUid(u_id: number): Promise<UserEntity | null>;
    saveUser(user: UserEntity): Promise<UserEntity>;
    updateSubscribeStatus(email: string, isSubscribed: boolean): Promise<void>;
    updateSubscribeByEmail(email: string): Promise<UserEntity>;
}
