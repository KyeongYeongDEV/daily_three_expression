import { ExpressionResponseDto } from "src/expression/dto/response/expression-response.dto";

interface ApiResponse<T> {
  success : boolean;
  statusCode : number;
  message : string;
  data : T | null;
}

export type ExpressionListResponse = ApiResponse<ExpressionResponseDto[]>;