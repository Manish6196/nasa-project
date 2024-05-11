"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const planetSchema = new mongoose_1.default.Schema({
    keplerName: {
        type: String,
        required: true,
    },
});
// Connects planetSchema with the "planets" collection
exports.default = mongoose_1.default.model('Planet', planetSchema);
