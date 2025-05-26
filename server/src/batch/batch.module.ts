import { Module } from "@nestjs/common";
import { BatchService } from "./batch.service";

@Module({
  imports : [],
  providers : [BatchService],
})
export class BatchModule{};