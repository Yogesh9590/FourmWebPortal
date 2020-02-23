"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const auditionSchema = new mongoose.Schema({
    status: { type: String, default: 'PENDING' },
    job: { type: Schema.Types.ObjectId, ref: 'Job' },
    artist: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const Audition = mongoose.model("Audition", auditionSchema);
exports.default = Audition;
//# sourceMappingURL=Auditions.js.map