import { UserEmailType } from "src/common/types/user.type";
import { ExpressionResponseDto } from "../../expression/dto/response.dto";

export interface SendExpressionMailParams {
  users : UserEmailType[];
  expressions: ExpressionResponseDto[];
  unsubscribeUrls: string[]; 
}
