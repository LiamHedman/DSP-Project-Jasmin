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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_pooling_1 = require("./connection_pooling");
var modify_data = function (table, data, condition) { return __awaiter(void 0, void 0, void 0, function () {
    var keys_1, values, setClause, conditionKeys, conditionValues, conditionClause, query, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                keys_1 = Object.keys(data);
                values = Object.values(data);
                setClause = keys_1.map(function (key, index) { return "".concat(key, " = $").concat(index + 1); }).join(", ");
                conditionKeys = Object.keys(condition);
                conditionValues = Object.values(condition);
                conditionClause = conditionKeys
                    .map(function (key, index) { return "".concat(key, " = $").concat(keys_1.length + index + 1); })
                    .join(" AND ");
                query = "UPDATE ".concat(table, " SET ").concat(setClause, " WHERE ").concat(conditionClause, " RETURNING *");
                return [4 /*yield*/, connection_pooling_1.pool.query(query, __spreadArray(__spreadArray([], values, true), conditionValues, true))];
            case 1:
                result = _a.sent();
                console.log("[SUCCESS]: Data updated in table \"".concat(table, "\", updated data: ").concat(JSON.stringify(result.rows[0])));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                switch (err_1.code) {
                    case "42703": // undefined_column
                        console.error("[ERROR]: Column does not exist in table \"".concat(table, "\". Check the column names: ").concat(Object.keys(data).join(", ")));
                        break;
                    case "42P01": // undefined_table
                        console.error("[ERROR]: Table \"".concat(table, "\" not found"));
                        break;
                    default:
                        console.error("[ERROR]: Failed to update data in table \"".concat(table, "\""), err_1);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.default = modify_data;
