export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNAUTHORIZED"] = "AUTH_001";
    ErrorCode["FORBIDDEN"] = "AUTH_002";
    ErrorCode["INTERNAL_ERROR"] = "SRV_001";
    ErrorCode["INVALID_INPUT"] = "VAL_001";
    ErrorCode["NOT_FOUND"] = "SRV_002";
})(ErrorCode || (ErrorCode = {}));
