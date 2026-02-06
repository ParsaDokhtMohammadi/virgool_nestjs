export enum AuthMessage {
 EXPIRED_CODE = "otp code expired",
 TRY_AGAIN = "please try again",
 INVALID_OTP = "invalid otp code",
 OTP_EXPIRED = "otp code expired",
 LOGIN_REQUIRED = "login to your account"
}

export enum LOGINMESSAGE {
    INVALID_LOGIN_DATA = "invalid login data",
    USERNAME_NOT_FOUND = "user with this username does not exist",
    EMAIL_NOT_FOUND = "user with this email does not exist",
    USER_NOT_EXISTS = "user with this credentials does not exist",
    LOGIN_AGAIN = "login again",
    INCORRECT_PASSWORD = "incorrect email username or password"
}
export enum REGISTERMESSAGE {
    INVALID_REGISTER_DATA = "invalid register data",
    INVAID_EMAIL_FORMAT = "invalid email format",
    CONFLICT = "user with this email already exists",
    OTPSENT = "otp code sent to ",
    PASSWORD_MISMATCH = "password and confirm password do not match",
    USER_VERIFIED = "user already verified",
    VERIFICATION_CODE_SENT = "a verification code was sent to your account"
}

