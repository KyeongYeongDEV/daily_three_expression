import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AiRepository } from "./ai.repository";

@Module({
  imports : [ConfigModule, TypeOrmModule],
  controllers : [AiController],
  providers : [AiService, AiRepository],
})
export class AIModule{};