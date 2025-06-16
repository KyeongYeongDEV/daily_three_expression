import { forwardRef, Module } from "@nestjs/common";
import { AiController } from "./adapter/In/ai.controller";
import { OpenaiAdapter } from "./adapter/out/openai.adapter"; 
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ExpressionEntity } from "../expression/domain/expression.entity";
import { QdrantAdapter } from "./adapter/out/qdrant.adapter";
import { HttpModule } from "@nestjs/axios";
import { ExpressionAdapter } from "src/expression/adapter/out/expression.adapter";
import { ExpressionModule } from "src/expression/expression.module";
import { ExpressionBlackListEntity } from "src/expression/domain/expression-black-list.entity";
import { GeminiAdapter } from "./adapter/out/gemini.adapter";
import { AiService } from "./service/ai.service";


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
    OpenaiAdapter,
    GeminiAdapter,
    AiService,
    QdrantAdapter,
    {
      provide: 'QdrantPort',
      useClass: QdrantAdapter,
    },
    {
      provide: 'ExpressionPort',
      useClass: ExpressionAdapter,
    },
    {
      provide: 'GeminiPort',
      useClass: GeminiAdapter,
    },  
    {
      provide: 'OpenaiPort',
      useClass: OpenaiAdapter,
    },   
  ],
  exports : [
    OpenaiAdapter,
    AiService,
    {
      provide: 'QdrantPort',
      useClass: QdrantAdapter,
    },
    {
      provide: 'ExpressionPort',
      useClass: ExpressionAdapter,
    },
    {
      provide: 'GeminiPort',
      useClass: GeminiAdapter,
    },
        {
      provide: 'OpenaiPort',
      useClass: OpenaiAdapter,
    },
    
  ]
})
export class AiModule{};