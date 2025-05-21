import { ExpressionResponseDto } from "src/expression/dto/response.dto";
import { UserEntity } from "src/user/user.entity";

interface ApiResponse<T> {
  success : boolean;
  statusCode : number;
  message : string;
  data : T | null;
}

export type ExpressionResponse = ApiResponse<ExpressionResponseDto>;
export type ExpressionListResponse = ApiResponse<ExpressionResponseDto[]>;

export type UserInfoResponse = ApiResponse<UserEntity>;