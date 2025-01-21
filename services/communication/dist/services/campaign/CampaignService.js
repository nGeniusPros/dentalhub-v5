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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCampaignService = exports.CampaignService = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
var CampaignService = /** @class */ (function () {
    function CampaignService() {
        this.tableName = 'campaigns';
    }
    CampaignService.prototype.createCampaign = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign, _a, result, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        campaign = __assign(__assign({ id: crypto.randomUUID() }, data), { status: 'draft', metrics: {
                                total: 0,
                                sent: 0,
                                delivered: 0,
                                engaged: 0,
                                failed: 0
                            }, createdAt: new Date(), updatedAt: new Date() });
                        return [4 /*yield*/, supabase
                                .from(this.tableName)
                                .insert(campaign)
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), result = _a.data, error = _a.error;
                        if (error) {
                            throw new Error("Failed to create campaign: ".concat(error.message));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CampaignService.prototype.updateCampaign = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, _a, result, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        updates = __assign(__assign({}, data), { updatedAt: new Date() });
                        return [4 /*yield*/, supabase
                                .from(this.tableName)
                                .update(updates)
                                .eq('id', id)
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), result = _a.data, error = _a.error;
                        if (error) {
                            throw new Error("Failed to update campaign: ".concat(error.message));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CampaignService.prototype.getCampaign = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from(this.tableName)
                            .select()
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw new Error("Failed to get campaign: ".concat(error.message));
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CampaignService.prototype.listCampaigns = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = supabase.from(this.tableName).select();
                        if (filters) {
                            if (filters.type) {
                                query = query.eq('type', filters.type);
                            }
                            if (filters.status) {
                                query = query.eq('status', filters.status);
                            }
                            if (filters.startDate) {
                                query = query.gte('createdAt', filters.startDate.toISOString());
                            }
                            if (filters.endDate) {
                                query = query.lte('createdAt', filters.endDate.toISOString());
                            }
                            if (filters.search) {
                                query = query.ilike('name', "%".concat(filters.search, "%"));
                            }
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw new Error("Failed to list campaigns: ".concat(error.message));
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CampaignService.prototype.deleteCampaign = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase
                            .from(this.tableName)
                            .delete()
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            throw new Error("Failed to delete campaign: ".concat(error.message));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CampaignService.prototype.updateCampaignStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.updateCampaign(id, { status: status })];
            });
        });
    };
    CampaignService.prototype.updateCampaignMetrics = function (id, metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var campaign, updatedMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCampaign(id)];
                    case 1:
                        campaign = _a.sent();
                        if (!campaign) {
                            throw new Error('Campaign not found');
                        }
                        updatedMetrics = __assign(__assign({}, campaign.metrics), metrics);
                        return [2 /*return*/, this.updateCampaign(id, {
                                metrics: updatedMetrics,
                                status: this.calculateCampaignStatus(updatedMetrics)
                            })];
                }
            });
        });
    };
    CampaignService.prototype.calculateCampaignStatus = function (metrics) {
        var total = metrics.total;
        var completed = metrics.delivered + metrics.failed;
        if (completed === 0)
            return 'draft';
        if (completed < total)
            return 'active';
        return 'completed';
    };
    return CampaignService;
}());
exports.CampaignService = CampaignService;
var createCampaignService = function () {
    return new CampaignService();
};
exports.createCampaignService = createCampaignService;
