import { UsersWithUuidType } from "src/common/types/user.type";
import { ExpressionResponseDto } from "src/expression/dto/response.dto";

export interface SendMailPort {
  sendExpression(usersWithUuid : UsersWithUuidType[], expressions : ExpressionResponseDto[], todayLastDeliveriedId : number): Promise<void>
  sendEmailVerificationCode(to: string, code: string): Promise<boolean>;
}