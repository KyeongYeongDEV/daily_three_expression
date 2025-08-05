import { UsersWithUuidType } from "../../../common/types/user.type";
import { ExpressionResponseDto } from "../../../expression/dto/response.dto";

export interface SendMailPort {
  sendExpression(usersWithUuid : UsersWithUuidType[], expressions : ExpressionResponseDto[], todayLastDeliveriedId : number): Promise<void>
  sendEmailVerificationCode(to: string, code: string): Promise<boolean>;
}