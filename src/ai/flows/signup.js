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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.signup = void 0;
var core_1 = require("@genkit-ai/core");
var zod_1 = require("zod");
var appwrite_1 = require("appwrite");
var appwrite_2 = require("../../lib/appwrite");
var signupInputSchema = zod_1.z.object({
    identifier: zod_1.z.string(),
    password: zod_1.z.string(),
    promoCode: zod_1.z.string(),
    pricing: zod_1.z.object({
        dailyFitness: zod_1.z.coerce.number(),
        weeklyFitness: zod_1.z.coerce.number(),
        monthlyFitness: zod_1.z.coerce.number(),
        dailyIron: zod_1.z.coerce.number(),
        weeklyIron: zod_1.z.coerce.number(),
        monthlyIron: zod_1.z.coerce.number(),
    }),
});
exports.signup = (0, core_1.action)({
    name: "signup",
    inputSchema: signupInputSchema,
    outputSchema: zod_1.z.object({ success: zod_1.z.boolean(), message: zod_1.z.string() }),
}, function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var identifier, password, promoCode, pricing, newUser, userId, userData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                identifier = input.identifier, password = input.password, promoCode = input.promoCode, pricing = input.pricing;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, appwrite_2.account.create(appwrite_1.ID.unique(), identifier, password)];
            case 2:
                newUser = _a.sent();
                userId = newUser.$id;
                userData = {
                    email: identifier,
                    uid: userId,
                    pricing: JSON.stringify(pricing),
                    createdAt: new Date().toISOString(),
                };
                return [4 /*yield*/, appwrite_2.databases.createDocument('68ac3e83001e70c6e142', '68ac40e500132eb908b4', userId, userData)];
            case 3:
                _a.sent();
                return [2 /*return*/, { success: true, message: "User created successfully" }];
            case 4:
                error_1 = _a.sent();
                return [2 /*return*/, { success: false, message: error_1.message }];
            case 5: return [2 /*return*/];
        }
    });
}); });
