import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/user.entity';
import { UserPort } from '../../port/user.port';
import { UserExistDTO } from '../../dto/response.dto';
export declare class TypeOrmUserAdapter implements UserPort {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    findAllUsersEmail(): Promise<string[]>;
    findUserInfoByEmail(email: string): Promise<UserEntity | null>;
    findUserByEmail(email: string): Promise<UserExistDTO | null>;
    findUserByUid(u_id: number): Promise<UserEntity | null>;
    saveUser(user: UserEntity): Promise<UserEntity>;
}
