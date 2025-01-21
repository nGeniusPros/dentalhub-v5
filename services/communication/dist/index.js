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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = require("dotenv");
var cors_1 = __importDefault(require("cors"));
var campaigns_1 = __importDefault(require("./routes/campaigns"));
var RetellService_1 = require("./services/retell/RetellService");
var callService_1 = require("./services/callService");
var webhookService_1 = require("./services/webhookService");
// Load environment variables
(0, dotenv_1.config)();
var app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Retell service
var retellConfig = {
    baseUrl: process.env.RETELL_BASE_URL || '',
    wsUrl: process.env.RETELL_WEBSOCKET_URL || '',
    apiKey: process.env.RETELL_API_KEY || '',
    agentId: process.env.RETELL_AGENT_1_ID || '',
    llmId: process.env.RETELL_AGENT_1_LLM || '',
    phoneNumber: process.env.RETELL_AGENT_1_PHONE || ''
};
var retellService = (0, RetellService_1.createRetellService)(retellConfig);
var callService = new callService_1.CallService(retellConfig);
var webhookService = new webhookService_1.WebhookService();
// Campaign routes
app.use('/api/campaigns', campaigns_1.default);
// Voice call routes
app.post('/api/calls', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phoneNumber, config_1, call, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, phoneNumber = _a.phoneNumber, config_1 = _a.config;
                return [4 /*yield*/, callService.initiateCall(phoneNumber, config_1)];
            case 1:
                call = _b.sent();
                res.json(call);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error initiating call:', error_1);
                res.status(500).json({ error: 'Failed to initiate call' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/calls/:callId/recording', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var callId, recording, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                callId = req.params.callId;
                return [4 /*yield*/, callService.getCallRecording(callId)];
            case 1:
                recording = _a.sent();
                res.type('audio/mpeg').send(recording);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error getting call recording:', error_2);
                res.status(500).json({ error: 'Failed to get call recording' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/calls/:callId/config', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var callId, config_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                callId = req.params.callId;
                config_2 = req.body;
                return [4 /*yield*/, callService.updateCallConfig(callId, config_2)];
            case 1:
                _a.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error updating call config:', error_3);
                res.status(500).json({ error: 'Failed to update call config' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Webhook endpoints
app.post('/webhooks/retell', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event_1, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                event_1 = req.body;
                console.log('Received Retell webhook event:', event_1);
                return [4 /*yield*/, webhookService.handleWebhook(event_1)];
            case 1:
                _a.sent();
                res.sendStatus(200);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error processing webhook:', error_4);
                res.status(500).json({ error: 'Failed to process webhook' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Error handling middleware
app.use(function (err, req, res, next) {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
var PORT = process.env.COMMUNICATION_SERVICE_PORT || 3002;
app.listen(PORT, function () {
    console.log("Communication service running on port ".concat(PORT));
});
