export enum AuthMessage {
 EXPIRED_CODE = "otp code expired",
 TRY_AGAIN = "please try again",
 INVALID_OTP = "invalid otp code",
 OTP_EXPIRED = "otp code expired",
 LOGIN_REQUIRED = "login to your account",
 UNEXPECTED_ERR = "an unexpected error accured"
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

export enum RESET_PASS_MESSAGE {
    NO_COOKIE = "you are not authorize to do this action",
    EXPIRED_TOKEN = "issue another password reset request",
    USER_NOT_EXIST = "user with this id does not exist",
    SUCCESS = "password changed successFully"
}


//public
export enum PUBLIC_MESSAGES {
    
}


//Category
export enum CATEGORY_MESSAGES {
 CONFLICT = "a title with this name already exists",
 NOT_FOUND = "no category found",
 DELETED = "category deleted",
 INVALID_UPDATE_DATA = "no data was sent to update",
 UPDATE_SUCCESS = "category updated"
}
//Profile
export enum PROFILE_MESSAGES {
    NOT_LOGGEDIN = "please login"
}
//images
export enum IMAGE_MESSAGES {
    INVALID_FORMAT = "invalid image format only jpg png jpeg amd webp allowed"
}

