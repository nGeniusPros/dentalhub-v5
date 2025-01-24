import { SikkaConfig } from '../integrations/sikka/types';
interface RealTimeAIIntegration {
    patientData: any;
    appointmentData: any;
    revenueData: any;
    practiceMetrics: any;
    labCases: any;
    supplies: any;
    marketing: any;
    procedures: any;
    staff: any;
    hygiene: any;
    demographics: any;
    compliance: any;
}
export declare class SikkaAIIntegrationService {
    private config;
    private tokenService;
    private realTimeData;
    constructor(config: SikkaConfig);
    fetchRealTimeData(): Promise<RealTimeAIIntegration>;
    getDataForPatientCareAgent(): Promise<{
        patients: any;
        appointments: any;
        metrics: {
            satisfaction: number;
            retention: number;
            engagement: number;
        };
    }>;
    getDataForRevenueAgent(): Promise<{
        collections: any;
        insurance: any;
        aging: any;
        metrics: {
            profitability: number;
            efficiency: number;
            growth: number;
        };
    }>;
    getDataForPracticeAgent(): Promise<{
        operations: any;
        staff: any;
        scheduling: any;
        metrics: {
            utilization: number;
            efficiency: number;
            performance: number;
        };
    }>;
    getDataForAppointmentAgent(): Promise<{
        appointments: any;
        patients: any;
        staff: any;
        metrics: {
            utilization: number;
            cancellationRate: number;
            scheduling: number;
        };
    }>;
    getDataForLabCaseAgent(): Promise<{
        cases: any;
        procedures: any;
        metrics: {
            turnaroundTime: number;
            quality: number;
            efficiency: number;
        };
    }>;
    getDataForSuppliesAgent(): Promise<{
        inventory: any;
        usage: Record<string, number>;
        metrics: {
            stockLevels: Record<string, "high" | "low" | "optimal">;
            orderEfficiency: number;
            costs: number;
        };
    }>;
    getDataForMarketingAgent(): Promise<{
        campaigns: any;
        demographics: any;
        metrics: {
            roi: number;
            patientAcquisition: number;
            channelEffectiveness: Record<string, number>;
        };
    }>;
    getDataForProcedureAgent(): Promise<{
        procedures: any;
        revenue: any;
        metrics: {
            profitability: Record<string, number>;
            frequency: Record<string, number>;
            success: Record<string, number>;
        };
    }>;
    getDataForStaffAgent(): Promise<{
        staff: any;
        scheduling: any;
        metrics: {
            productivity: any;
            utilization: any;
            performance: number;
        };
    }>;
    getDataForHygieneAgent(): Promise<{
        hygiene: any;
        appointments: any;
        metrics: {
            production: number;
            reappointment: number;
            compliance: number;
        };
    }>;
    getDataForDemographicsAgent(): Promise<{
        demographics: any;
        patients: any;
        metrics: {
            distribution: Record<string, Record<string, number>>;
            trends: Record<string, number>;
            targeting: Record<string, number>;
        };
    }>;
    getDataForComplianceAgent(): Promise<{
        compliance: any;
        staff: any;
        metrics: {
            adherence: number;
            training: Record<string, number>;
            risks: Record<string, "high" | "low" | "medium">;
        };
    }>;
    private fetchPatientData;
    private fetchAppointmentData;
    private fetchRevenueData;
    private fetchPracticeMetrics;
    private fetchLabCases;
    private fetchSupplies;
    private fetchMarketingData;
    private fetchProcedures;
    private fetchStaffData;
    private fetchHygieneData;
    private fetchDemographics;
    private fetchComplianceData;
    private calculatePatientSatisfaction;
    private calculateRetentionRate;
    private calculatePatientEngagement;
    private calculateProfitability;
    private calculateCollectionEfficiency;
    private calculateRevenueGrowth;
    private calculateResourceUtilization;
    private calculateOperationalEfficiency;
    private calculateStaffPerformance;
    private calculateAppointmentUtilization;
    private calculateCancellationRate;
    private calculateSchedulingEfficiency;
    private calculateLabTurnaroundTime;
    private calculateLabQuality;
    private calculateLabEfficiency;
    private calculateSupplyUsage;
    private calculateStockLevels;
    private calculateOrderEfficiency;
    private calculateSupplyCosts;
    private calculateMarketingROI;
    private calculatePatientAcquisition;
    private calculateChannelEffectiveness;
    private calculateProcedureProfitability;
    private calculateProcedureFrequency;
    private calculateProcedureSuccess;
    private calculateHygieneProduction;
    private calculateReappointmentRate;
    private calculateHygieneCompliance;
    private calculateDemographicDistribution;
    private calculateDemographicTrends;
    private calculateTargetDemographics;
    private calculateComplianceAdherence;
    private calculateTrainingStatus;
    private calculateComplianceRisks;
}
export {};
