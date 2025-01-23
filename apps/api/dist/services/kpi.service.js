var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { trackPerformance } from '../decorators/performance.decorator';
import { AgentError } from '../errors';
import { KPISchema } from '../schemas/kpi.schema';
let KPICalculationEngine = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _calculateOperationalKPIs_decorators;
    return _a = class KPICalculationEngine {
            constructor(metricsRepo, encryptor, auditor) {
                this.metricsRepo = (__runInitializers(this, _instanceExtraInitializers), metricsRepo);
                this.encryptor = encryptor;
                this.auditor = auditor;
            }
            async calculateOperationalKPIs(metrics) {
                try {
                    const rawData = await this.metricsRepo.getCurrentMetrics();
                    const securedData = await this.encryptor.encryptEntity(rawData, 'kpi-calc');
                    const result = {
                        hourlyOperatoryRate: this.calculateHourlyRate(securedData),
                        dailyHygieneTarget: this.calculateHygieneTarget(securedData),
                        treatmentAcceptance: metrics.treatmentAcceptanceRate
                    };
                    const validated = KPISchema.parse(result);
                    this.auditor.logKpiAccess('operational');
                    return validated;
                }
                catch (error) {
                    throw new AgentError('KPI_CALCULATION_FAILED', 'Failed to calculate operational KPIs', { originalError: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
            calculateHourlyRate(data) {
                // Implementation details
                return 325; // Example value
            }
            calculateHygieneTarget(data) {
                // Implementation details 
                return 2500; // Example value
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _calculateOperationalKPIs_decorators = [trackPerformance];
            __esDecorate(_a, null, _calculateOperationalKPIs_decorators, { kind: "method", name: "calculateOperationalKPIs", static: false, private: false, access: { has: obj => "calculateOperationalKPIs" in obj, get: obj => obj.calculateOperationalKPIs }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { KPICalculationEngine };
