"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.Backend = void 0;
var axios_1 = __importDefault(require("axios"));
var https_1 = __importDefault(require("https"));
var client_1 = require("./client");
Object.defineProperty(exports, "Backend", { enumerable: true, get: function () { return client_1.Backend; } });
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return client_1.Entity; } });
var agent = new https_1.default.Agent({
    rejectUnauthorized: false
});
axios_1.default.defaults.httpsAgent = agent;
