import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchController } from './batch/batch.controller';
import { BatchService } from './batch/batch.service';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { SendController } from './send/send.controller';
import { SendService } from './send/send.service';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [],
  controllers: [AppController, BatchController, AiController, UserController, SendController, AdminController],
  providers: [AppService, BatchService, AiService, UserService, SendService, AdminService],
})
export class AppModule {}
