"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.Backend = void 0;
var axios_1 = __importDefault(require("axios"));
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
var lodash_1 = __importDefault(require("lodash"));
var Yup = __importStar(require("yup"));
var client_1 = __importDefault(require("@winkgroup/error-manager/build/client"));
var Backend = /** @class */ (function () {
    function Backend(baseUrl) {
        this.token = '';
        this.isTokenLoaded = false;
        this.baseUrl = baseUrl;
    }
    Backend.prototype.getToken = function () {
        if (!this.isTokenLoaded)
            this.token = window.localStorage.getItem("token") || '';
        this.isTokenLoaded = true;
        return this.token;
    };
    Backend.prototype.loginHashedPassword = function (pwdHash, username) {
        if (username === void 0) { username = 'admin'; }
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/login"), { pwdHash: pwdHash })];
                    case 1:
                        response = _a.sent();
                        this.token = response.data;
                        window.localStorage.setItem('token', this.token);
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Backend.prototype.login = function (password, username) {
        if (username === void 0) { username = 'admin'; }
        var pwdHash = (0, sha256_1.default)(password).toString(enc_hex_1.default);
        return this.loginHashedPassword(pwdHash, username);
    };
    Backend.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.token = '';
                window.localStorage.removeItem('token');
                return [2 /*return*/];
            });
        });
    };
    Backend.prototype.get = function (path, addBaseUrl) {
        if (addBaseUrl === void 0) { addBaseUrl = true; }
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = addBaseUrl ? "".concat(this.baseUrl).concat(path) : path;
                        return [4 /*yield*/, axios_1.default.get(url, {
                                headers: {
                                    'Authorization': "Bearer ".concat(this.getToken())
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Backend.prototype.post = function (path, data, addBaseUrl) {
        if (addBaseUrl === void 0) { addBaseUrl = true; }
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = addBaseUrl ? "".concat(this.baseUrl).concat(path) : path;
                        return [4 /*yield*/, axios_1.default.post(url, data, {
                                headers: {
                                    'Authorization': "Bearer ".concat(this.getToken())
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Backend.prototype.put = function (path, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.put("".concat(this.baseUrl).concat(path), data, {
                            headers: {
                                'Authorization': "Bearer ".concat(this.getToken())
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Backend.prototype.patch = function (path, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.patch("".concat(this.baseUrl).concat(path), data, {
                            headers: {
                                'Authorization': "Bearer ".concat(this.getToken())
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Backend.prototype.remove = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.delete("".concat(this.baseUrl).concat(path), {
                            headers: {
                                'Authorization': "Bearer ".concat(this.getToken())
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Backend.prototype.materialTable = function (path, query) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl).concat(path), query, {
                            headers: {
                                'Authorization': "Bearer ".concat(this.getToken())
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data.data,
                                page: response.data.page,
                                totalCount: response.data.totalCount
                            }];
                }
            });
        });
    };
    return Backend;
}());
exports.Backend = Backend;
var Entity = /** @class */ (function () {
    function Entity(restEndpoint, inputOptions) {
        this.lastResult = null;
        this.options = lodash_1.default.defaults(inputOptions, {
            backend: new Backend(restEndpoint),
            errorManager: new client_1.default(),
            defaultSuccessFeedbackMessage: 'Saved'
        });
        this.restEndpoint = this.options.backend.baseUrl === restEndpoint ? '' : restEndpoint;
    }
    Entity.prototype.getValidationSchema = function () {
        return Yup.object();
    };
    Entity.prototype.getResult = function () {
        return this.lastResult;
    };
    Entity.prototype.sendFeedback = function () {
        if (this.lastResult) {
            if (this.options.sendFeeback)
                this.options.sendFeeback(this.lastResult);
            if (this.options.sendFeedbackMessage) {
                var message = this.lastResult.status !== 'success' ? this.lastResult.message : this.options.defaultSuccessFeedbackMessage;
                this.options.sendFeedbackMessage(message);
            }
        }
    };
    Entity.prototype.save = function (entity, previous) {
        return __awaiter(this, void 0, void 0, function () {
            var id, validationSchema, data, dataToSend, response, dataToSend, response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = entity['id'];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        validationSchema = this.getValidationSchema();
                        return [4 /*yield*/, validationSchema.validate(entity)];
                    case 2:
                        _a.sent();
                        if (this.options.isSaving)
                            this.options.isSaving(true);
                        data = void 0;
                        if (!id) return [3 /*break*/, 4];
                        dataToSend = Entity.getDataToSend(entity, previous, this.options.emptyEntity);
                        return [4 /*yield*/, this.options.backend.put(this.restEndpoint, dataToSend)];
                    case 3:
                        response = _a.sent();
                        data = response.data;
                        return [3 /*break*/, 6];
                    case 4:
                        dataToSend = Entity.getDataToSend(entity, undefined, this.options.emptyEntity);
                        return [4 /*yield*/, this.options.backend.post(this.restEndpoint, dataToSend)];
                    case 5:
                        response = _a.sent();
                        data = response.data;
                        _a.label = 6;
                    case 6:
                        this.lastResult = {
                            status: 'success',
                            data: data
                        };
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        this.options.errorManager.e = e_2;
                        this.lastResult = __assign(__assign({}, this.options.errorManager.get()), { error: e_2 });
                        return [3 /*break*/, 8];
                    case 8:
                        if (this.options.isSaving)
                            this.options.isSaving(false);
                        this.sendFeedback();
                        return [2 /*return*/, this.lastResult];
                }
            });
        });
    };
    Entity.getDataToSend = function (entity, previous, base) {
        var dataToSend = {};
        var cycler = base ? base : entity;
        for (var key in cycler) {
            if (key === 'id')
                continue;
            if (previous && lodash_1.default.isEqual(entity[key], previous[key]))
                continue;
            dataToSend[key] = entity[key];
        }
        return dataToSend;
    };
    return Entity;
}());
exports.Entity = Entity;
