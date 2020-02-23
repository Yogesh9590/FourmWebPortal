"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const jobTypeSchema = new mongoose.Schema({
    jobType: String,
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });
const JobType = mongoose.model("JobType", jobTypeSchema);
exports.default = JobType;
//# sourceMappingURL=JobTypes.js.map