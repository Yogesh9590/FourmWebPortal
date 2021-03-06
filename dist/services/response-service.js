"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructResponseJson = (statusCode, status, responseData) => {
    return ({
        "payload": {
            "status": status,
            "code": statusCode,
            "type": "application/JSON",
            "body": responseData
        }
    });
};
// "payload": {
//     "responseType" : "application/JSON",
//     "responseCode" : "200 | 400 | 401 | 500", 
//     "status" : "FAIL | SUCCESS | ERROR ",
//     "responseBody" : {
//     }
// } 
//# sourceMappingURL=response-service.js.map