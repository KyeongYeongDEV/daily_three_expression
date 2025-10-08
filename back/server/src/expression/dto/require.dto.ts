import { DeliveryStatus } from "../domain/expression-delivery.entity";

export class DeliveryLogDto {
  u_id: number;
  e_id: number;
  status: DeliveryStatus;
};