export enum AuthMessage {

}

export enum LOGINMESSAGE {
    INVALID_LOGIN_DATA = "invalid login data",
    USERNAME_NOT_FOUND = "user with this username does not exist",
    EMAIL_NOT_FOUND = "user with this email does not exist",
    USER_NOT_EXISTS = "user with this credentials does not exist"
}
export enum REGISTERMESSAGE {
    INVALID_REGISTER_DATA = "invalid register data",
    INVAID_EMAIL_FORMAT = "invalid email format",
    CONFLICT = "user with this email already exists",
    OTPSENT = "otp code sent to "
}

