"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const planets_controller_1 = require("./planets.controller");
const planetsRouter = express_1.default.Router();
planetsRouter.get('/', planets_controller_1.httpGetAllPlanets);
exports.default = planetsRouter;
