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
exports.user_routes = void 0;
var express_1 = require("express");
var data_retrieval_1 = require("../database/data_retrieval");
var connection_pooling_1 = require("../database/connection_pooling");
var data_insertion_1 = require("../database/data_insertion");
var data_deletion_1 = require("../database/data_deletion");
var data_modification_1 = require("../database/data_modification");
var router = express_1.default.Router();
exports.user_routes = router;
function username_in_use(username) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conditions = {
                        name: username
                    };
                    return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_users, conditions)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.length];
            }
        });
    });
}
function mail_in_use(mail) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conditions = {
                        mail: mail
                    };
                    return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_users, conditions)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.length];
            }
        });
    });
}
function check_password(password, username) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conditions = {
                        name: username,
                        password: password
                    };
                    return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_users, conditions)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.length];
            }
        });
    });
}
function retrieve_id(username) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conditions = {
                        name: username
                    };
                    return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_users, conditions)];
                case 1:
                    result = _a.sent();
                    console.log("retrieved id: ".concat(result[0].id));
                    return [2 /*return*/, result[0].id];
            }
        });
    });
}
// Handles register user request from the client
// Listens to all axios.post(`${SERVER_URL}/register_user` from the client
router.post("/register_user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, username_in_use(user.name)];
            case 2:
                if (_a.sent()) {
                    return [2 /*return*/, res.status(418).json()];
                }
                return [4 /*yield*/, mail_in_use(user.mail)];
            case 3:
                if (_a.sent()) {
                    return [2 /*return*/, res.status(419).json()];
                }
                console.log("User \"".concat(user.name, "\" registered"));
                return [4 /*yield*/, (0, data_insertion_1.default)(connection_pooling_1.table_name_users, user)];
            case 4:
                _a.sent();
                res.status(200).json();
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                res.status(500).json();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post("/delete_user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, condition, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.headers.auth;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("User \"".concat(user_id, "\" set up for deletion"));
                condition = { id: user_id };
                return [4 /*yield*/, (0, data_deletion_1.default)(connection_pooling_1.table_name_users, condition)];
            case 2:
                _a.sent();
                res.status(200).json();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/modify_user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, new_user_data, condition, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.headers.auth;
                new_user_data = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("User \"".concat(user_id, "\" set up for modification"));
                condition = { id: user_id };
                return [4 /*yield*/, (0, data_modification_1.default)(connection_pooling_1.table_name_users, new_user_data, condition)];
            case 2:
                _a.sent();
                res.status(200).json();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/fetch_user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, condition, users, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.headers.auth;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("User \"".concat(user_id, "\" fetch from client"));
                condition = { id: user_id };
                return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_users, condition)];
            case 2:
                users = _a.sent();
                if (users.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.status(200).json(users[0]);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Handles login requests from the client
// Listens to all axios.post(`${SERVER_URL}/login` from the client
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, user_id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, username_in_use(user.name)];
            case 2:
                if (!(_a.sent())) {
                    throw new Error("User with this username doesnt exist");
                }
                return [4 /*yield*/, check_password(user.password, user.name)];
            case 3:
                if (!(_a.sent())) {
                    throw new Error("The password is incorrect for this username");
                }
                return [4 /*yield*/, retrieve_id(user.name)];
            case 4:
                user_id = _a.sent();
                console.log("User \"".concat(user.name, "\" successfully logged in"));
                console.log("User has ID: \"".concat(user_id, "\""));
                res.status(200).json(user_id);
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                res.status(500).json();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
