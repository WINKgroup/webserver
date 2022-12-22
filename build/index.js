"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var lodash_1 = __importDefault(require("lodash"));
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var path_1 = __importDefault(require("path"));
var socket_io_1 = require("socket.io");
var Webserver = /** @class */ (function () {
    function Webserver(inputConfig) {
        var _this = this;
        var config = lodash_1.default.defaults(inputConfig, {
            name: "Anonymous Webserver",
            port: 8080,
            ip: '127.0.0.1',
            hasSocket: false,
            useEndpoints: [],
            rejectUnauthorized: true,
            hashedAdminPassword: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
            jwtSecret: 'jwtSecret'
        });
        this.name = config.name;
        this.ip = config.ip;
        this.port = config.port;
        this.hashedAdminPassword = config.hashedAdminPassword;
        this.jwtSecret = config.jwtSecret;
        if (!config.rejectUnauthorized)
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Version, Access-Control-Allow-Origin, Authorization, Origin, X-Requested-With, Content-Type, Accept, ETag, Cache-Control, If-None-Match");
            res.header("Access-Control-Expose-Headers", "Etag, Authorization, Origin, X-Requested-With, Content-Type, Accept, If-None-Match, Access-Control-Allow-Origin");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH");
            next();
        });
        this.app.get('/server', function (req, res) {
            res.send("".concat(_this.name, " server up and running!"));
        });
        this.setupLoginEndpoint();
        config.useEndpoints.map(function (endpoint) {
            _this.app.use(endpoint.path, endpoint.router);
        });
        this.server = http_1.default.createServer(this.app);
        if (config.hasSocket) {
            this.ioApp = new socket_io_1.Server(this.server, {
                cors: {
                    origin: true
                }
            });
        }
    }
    Webserver.prototype.setupLoginEndpoint = function () {
        var _this = this;
        this.app.post('/login', function (req, res) {
            var pwdHash = req.body.pwdHash;
            if (pwdHash === _this.hashedAdminPassword)
                res.send(jsonwebtoken_1.default.sign({ user: req.body.username }, _this.jwtSecret));
            else
                res.status(403).send('wrong password');
        });
    };
    Webserver.prototype.getBaseUrl = function () {
        return "http://".concat(this.ip, ":").concat(this.port);
    };
    Webserver.prototype.mountUi = function () {
        this.app.use(express_1.default.static("ui"));
        this.app.get("/*", function (req, res) {
            res.sendFile(path_1.default.normalize(path_1.default.join(__dirname, "..", "ui", "index.html")));
        });
    };
    Webserver.prototype.listen = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.server.listen(_this.port, _this.ip, function () {
                console.info((new Date()) + " ".concat(_this.name, " server is listening at ").concat(_this.ip, ":").concat(_this.port));
                resolve();
            });
        });
    };
    Webserver.prototype.close = function () {
        var _this = this;
        console.info("Shutting down ".concat(this.name, " server..."));
        return new Promise(function (resolve, reject) {
            _this.server.close(function (err) {
                if (!err)
                    resolve();
                else
                    reject(err);
            });
        });
    };
    return Webserver;
}());
exports.default = Webserver;
