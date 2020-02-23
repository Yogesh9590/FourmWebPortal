"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    agentOrAgencyName: String,
    agencyLogoURL: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    gender: String,
    age: String,
    language: [String],
    phoneNumber: Number,
    description: String,
    characteristics: [String],
    jobCategory: [String],
    recordingMethods: [String],
    voiceDemo: [String],
    subscriptionStatus: { type: String, default: 'NOT_SUBSCRIBE' },
    subscriptionDate: Number,
    subscriptionPlan: String,
    connectedArtist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=Users.js.map