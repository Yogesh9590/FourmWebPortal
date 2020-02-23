"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
exports.jwtTokan = (payload) => {
    return (jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }));
};
//# sourceMappingURL=utils-service.js.map