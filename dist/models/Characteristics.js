"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const characteristicSchema = new mongoose.Schema({
    characteristic: String,
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });
const Characteristic = mongoose.model("Characteristic", characteristicSchema);
exports.default = Characteristic;
//# sourceMappingURL=Characteristics.js.map