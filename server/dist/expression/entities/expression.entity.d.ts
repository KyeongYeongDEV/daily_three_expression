import { ExpressionDelivery } from './expression_delivery.entity';
export declare class Expression {
    e_id: number;
    expression_numer: number;
    category: string;
    expression: string;
    example1: string;
    example2: string;
    translation_expression: string;
    translation_example1: string;
    translation_example2: string;
    created_at: Date;
    is_active: boolean;
    deliveries: ExpressionDelivery[];
}
