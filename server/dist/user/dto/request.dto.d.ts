export declare class UserEmailRequestDto {
    email: string;
}
export declare class UserRegisterRequestDto {
    email: string;
    is_email_subscribed: boolean;
    is_email_verified: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export declare class UserVerifiedUpdateRequestDto {
    u_id: number;
    verified: boolean;
}
