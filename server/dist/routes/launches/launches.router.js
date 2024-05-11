"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const launches_controller_1 = require("./launches.controller");
const launchesRouter = express_1.default.Router();
launchesRouter.get('/', launches_controller_1.httpGetAllLaunches);
launchesRouter.post('/', launches_controller_1.httpAddNewLaunch);
launchesRouter.delete('/:id', launches_controller_1.httpAbortLaunch);
exports.default = launchesRouter;
