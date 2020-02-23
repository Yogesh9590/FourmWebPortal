"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notifications_1 = require("../models/Notifications");
const JSONRes = require("../services/response-service");
exports.getNotificationList = (req, res) => {
    let query = { 'notifyTo': req.body.decoded.userId };
    Notifications_1.default.find(query).populate({ path: 'audition', select: 'status', populate: [{ path: 'artist', model: 'User', select: 'firstName lastName' }, { path: 'job', model: 'Job', select: 'jobTitle jobCreatedBy' }] }).exec(function (err, notifications) {
        if (err) {
        }
        res.status(200).json(JSONRes.constructResponseJson(200, "SUCCESS", notifications));
    });
};
//# sourceMappingURL=notifications.js.map