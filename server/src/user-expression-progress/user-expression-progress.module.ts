import { Module } from "@nestjs/common";
import { UserExpressionRepository} from "./user-expression-progress.repository";
import { UserExpressionService } from "./user-expression-progress.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserExpressionProgress } from "./entitys/user-expression-progress.entity";

@Module({
  imports : [
      ConfigModule, 
      TypeOrmModule.forFeature([UserExpressionProgress]),
    ],
  providers : [UserExpressionService, UserExpressionRepository]
})
export class UserExpressionProgressModule{};