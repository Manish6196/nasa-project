"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abortLaunchById = exports.scheduleNewLaunch = exports.getAllLaunches = exports.existsLaunchWithId = exports.loadLaunchData = void 0;
const axios_1 = __importDefault(require("axios"));
const launches_mongo_1 = __importDefault(require("./launches.mongo"));
const planets_mongo_1 = __importDefault(require("./planets.mongo"));
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
function populateLaunches() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Downloading launch data...');
        const response = yield axios_1.default.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: 'rocket',
                        select: {
                            name: 1,
                        },
                    },
                    {
                        path: 'payloads',
                        select: {
                            customers: 1,
                        },
                    },
                ],
            },
        });
        if (response.status !== 200) {
            console.log('Problem downloading launch data');
            throw new Error('Launch data download failed');
        }
        const launchDocs = response.data.docs;
        for (const launchDoc of launchDocs) {
            const payloads = launchDoc['payloads'];
            const customers = payloads.flatMap((payload) => {
                return payload['customers'];
            });
            const launch = {
                flightNumber: launchDoc['flight_number'],
                mission: launchDoc['name'],
                rocket: launchDoc['rocket']['name'],
                launchDate: launchDoc['date_local'],
                upcoming: launchDoc['upcoming'],
                success: launchDoc['success'],
                customers,
            };
            console.log(`${launch.flightNumber} ${launch.mission}`);
            yield saveLaunch(launch);
        }
    });
}
function loadLaunchData() {
    return __awaiter(this, void 0, void 0, function* () {
        const firstLaunch = yield findLaunch({
            flightNumber: 1,
            rocket: 'Falcon 1',
            mission: 'FalconSat',
        });
        if (firstLaunch) {
            console.log('Launch data already loaded!');
        }
        else {
            yield populateLaunches();
        }
    });
}
exports.loadLaunchData = loadLaunchData;
function findLaunch(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield launches_mongo_1.default.findOne(filter);
    });
}
function existsLaunchWithId(launchId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield findLaunch({
            flightNumber: launchId,
        });
    });
}
exports.existsLaunchWithId = existsLaunchWithId;
function getLatestFlightNumber() {
    return __awaiter(this, void 0, void 0, function* () {
        const latestLaunch = yield launches_mongo_1.default.findOne().sort('-flightNumber');
        if (!latestLaunch) {
            return DEFAULT_FLIGHT_NUMBER;
        }
        return latestLaunch.flightNumber;
    });
}
function getAllLaunches(skip, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield launches_mongo_1.default
            .find({}, { _id: 0, __v: 0 })
            .sort({ flightNumber: 1 })
            .skip(skip)
            .limit(limit);
    });
}
exports.getAllLaunches = getAllLaunches;
function saveLaunch(launch) {
    return __awaiter(this, void 0, void 0, function* () {
        yield launches_mongo_1.default.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        });
    });
}
function scheduleNewLaunch(launch) {
    return __awaiter(this, void 0, void 0, function* () {
        const planet = yield planets_mongo_1.default.findOne({
            keplerName: launch.target,
        });
        if (!planet) {
            throw new Error('No matching planet found');
        }
        const newFlightNumber = (yield getLatestFlightNumber()) + 1;
        const newLaunch = Object.assign(launch, {
            success: true,
            upcoming: true,
            customers: ['Zero to Mastery', 'NASA'],
            flightNumber: newFlightNumber,
        });
        yield saveLaunch(newLaunch);
    });
}
exports.scheduleNewLaunch = scheduleNewLaunch;
function abortLaunchById(launchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const aborted = yield launches_mongo_1.default.updateOne({
            flightNumber: launchId,
        }, {
            upcoming: false,
            success: false,
        });
        return aborted.modifiedCount === 1;
    });
}
exports.abortLaunchById = abortLaunchById;
