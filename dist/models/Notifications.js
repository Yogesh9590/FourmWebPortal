"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const notificationsSchema = new mongoose.Schema({
    notifyTo: { type: Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
    audition: { type: Schema.Types.ObjectId, ref: 'Audition' },
}, { timestamps: true });
const notification = mongoose.model("notifications", notificationsSchema);
exports.default = notification;
//# sourceMappingURL=Notifications.js.map