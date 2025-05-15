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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.table_name_users = exports.table_name_demand_posts = exports.table_name_supply_posts = void 0;
var fs_1 = require("fs");
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
dotenv_1.default.config();
// resolves the path the the certificate (ca.pem)
var caPath = path_1.default.resolve(__dirname, "../../src/database/config/ca.pem");
exports.table_name_supply_posts = "active_supply_posts";
exports.table_name_demand_posts = "active_demand_posts";
exports.table_name_users = "active_users";
// Connection Pool Configuration
exports.pool = new pg_1.Pool({
    // For security, dont hard code the connection data
    // To change the connection data, change the values in the .env file
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: true,
        ca: fs_1.default.readFileSync(caPath).toString(),
    },
});
// TODO: Move this out into a separate file
// Test queries to check that the database has been connected to
var check_connection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var client, versionResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, 4, 6]);
                return [4 /*yield*/, exports.pool.connect()];
            case 1:
                client = _a.sent();
                return [4 /*yield*/, client.query("SELECT VERSION()")];
            case 2:
                versionResult = _a.sent();
                console.log("PostgreSQL version:", versionResult.rows[0].version);
                // Releases the client back to the pool
                client.release();
                return [3 /*break*/, 6];
            case 3:
                err_1 = _a.sent();
                console.error("Error during database connection:", err_1);
                return [3 /*break*/, 6];
            case 4: 
            // Optional: Close the pool when your application ends
            return [4 /*yield*/, exports.pool.end()];
            case 5:
                // Optional: Close the pool when your application ends
                _a.sent();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Run the queries
//check_connection();
