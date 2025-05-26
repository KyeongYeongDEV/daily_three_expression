import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ExpressionEntity } from "../expression/domain/expression.entity";
import { ExpressionGenerationService } from "./service/expression-generation.service";
import { QdrantAdapter } from "./adapter/out/qdrant.adapter";

@Module({
  imports : [
    ConfigModule, 
    TypeOrmModule.forFeature([ExpressionEntity]),
  ],
  controllers : [AiController],
  providers : [
    AiService,
    ExpressionGenerationService,
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
    }
  ],
  exports : [
    ExpressionGenerationService,
  ]
})
export class AIModule{};