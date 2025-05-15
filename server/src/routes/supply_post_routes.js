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
exports.supply_post_routes = void 0;
var classes_1 = require("../../../common/src/classes");
var connection_pooling_1 = require("../database/connection_pooling");
var data_deletion_1 = require("../database/data_deletion");
var data_insertion_1 = require("../database/data_insertion");
var data_modification_1 = require("../database/data_modification");
var data_retrieval_1 = require("../database/data_retrieval");
var express_1 = require("express");
var router = express_1.default.Router();
exports.supply_post_routes = router;
// Listens for a new post from a client. 
router.post("/new_supply_post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, owner_id, title, description, price, category, location, post_picture_url, created_at, post_data, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, owner_id = _a.owner_id, title = _a.title, description = _a.description, price = _a.price, category = _a.category, location = _a.location, post_picture_url = _a.post_picture_url, created_at = _a.created_at;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                post_data = new classes_1.Supply_post(id, owner_id, title, description, price, category, location, post_picture_url, created_at);
                console.log("ID of new supply post: ".concat(id));
                console.log("Title of new supply post: ".concat(title));
                return [4 /*yield*/, (0, data_insertion_1.default)(connection_pooling_1.table_name_supply_posts, post_data)];
            case 2:
                _b.sent();
                res.status(200).json();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error("Failed to create new supply post:", error_1.message);
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/edit_supply_post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, owner_id, title, description, price, category, location, post_picture_url, created_at, criteria, post_data, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, owner_id = _a.owner_id, title = _a.title, description = _a.description, price = _a.price, category = _a.category, location = _a.location, post_picture_url = _a.post_picture_url, created_at = _a.created_at;
                criteria = { id: id };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                post_data = new classes_1.Supply_post(id, owner_id, title, description, price, category, location, post_picture_url, created_at);
                console.log("ID of the edited suuply post: ".concat(id));
                console.log("Title of edited supply post: ".concat(title));
                return [4 /*yield*/, (0, data_modification_1.default)(connection_pooling_1.table_name_supply_posts, post_data, criteria)];
            case 2:
                _b.sent();
                res.status(200).json();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error("Failed to edit supply post:", error_2.message);
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/delete_supply_post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_deletion_1.default)(connection_pooling_1.table_name_supply_posts, { id: id })];
            case 2:
                _a.sent();
                res.status(200).json();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Failed to delete supply post", error_3.message);
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Is a GET request handler, i.e. used by the client to retrieve data from the server
// Handles all await axios.get(`${SERVER_URL}/retrieve_posts`);
router.get("/fetch_all_supply_posts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all_supply_posts, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_supply_posts, {})];
            case 1:
                all_supply_posts = _a.sent();
                res.status(200).json(all_supply_posts);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error fetching supply posts", error_4.message);
                res.status(500).json();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/fetch_my_supply_posts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, condition, supply_posts, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.headers.auth;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                condition = { owner_id: user_id };
                return [4 /*yield*/, (0, data_retrieval_1.default)(connection_pooling_1.table_name_supply_posts, condition)];
            case 2:
                supply_posts = _a.sent();
                res.status(200).json(supply_posts);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).json();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
