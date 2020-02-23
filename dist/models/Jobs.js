"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const jobSchema = new mongoose.Schema({
    jobTitle: String,
    description: String,
    isDeadline: { type: Boolean, default: false },
    deadlineDate: Number,
    isDelete: { type: Boolean, default: false },
    status: { type: String, default: 'REQUESTS' },
    attachments: { type: [String], default: [] },
    jobCreatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    auditionsDetails: [{ type: Schema.Types.ObjectId, ref: 'Audition' }],
}, { timestamps: true });
const Job = mongoose.model("Job", jobSchema);
exports.default = Job;
//# sourceMappingURL=Jobs.js.map