import { forwardRef, Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./service/ai.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ExpressionEntity } from "../expression/domain/expression.entity";
import { QdrantAdapter } from "./adapter/out/qdrant.adapter";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmExpressionAdapter } from "src/expression/adapter/out/expression.adapter";
import { ExpressionModule } from "src/expression/expression.module";
import { ExpressionBlackListEntity } from "src/expression/domain/expression-black-list.entity";

@Module({
  imports : [
    TypeOrmModule.forFeature([
      ExpressionEntity, 
      ExpressionBlackListEntity,
    ]),
    ConfigModule, 
    HttpModule,
    forwardRef(() => ExpressionModule),
  ],
  controllers : [AiController],
  providers : [
    AiService,
    // TODO AiService를 OpenaiAdapter로 변경할 것,
    // {
    //   provide: 'OpenaiPort',
    //   useClass: OpenaiAdapter,
    // },
    QdrantAdapter,
    {
      provide: 'QdrantPort',
      useClass: QdrantAdapter,
    },
    {
      provide: 'ExpressionPort',
      useClass: TypeOrmExpressionAdapter,
    },
  ],
  exports : [
    AiService,
    {
      provide: 'QdrantPort',
      useClass: QdrantAdapter,
    },
    {
      provide: 'ExpressionPort',
      useClass: TypeOrmExpressionAdapter,
    },
  ]
})
export class AiModule{};