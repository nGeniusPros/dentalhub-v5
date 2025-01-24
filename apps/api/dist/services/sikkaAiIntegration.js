import { SikkaTokenService } from '../integrations/sikka/token-service';
import { getPaginatedData, getSingleRecord } from './sikkaApi';
export class SikkaAIIntegrationService {
    constructor(config) {
        this.config = config;
        this.realTimeData = {
            patientData: null,
            appointmentData: null,
            revenueData: null,
            practiceMetrics: null,
            labCases: null,
            supplies: null,
            marketing: null,
            procedures: null,
            staff: null,
            hygiene: null,
            demographics: null,
            compliance: null
        };
        this.tokenService = new SikkaTokenService(config);
    }
    async fetchRealTimeData() {
        const requestKey = await this.tokenService.getAccessToken();
        // Parallel data fetching for real-time updates
        const [patients, appointments, revenue, metrics, labCases, supplies, marketing, procedures, staff, hygiene, demographics, compliance] = await Promise.all([
            this.fetchPatientData(requestKey),
            this.fetchAppointmentData(requestKey),
            this.fetchRevenueData(requestKey),
            this.fetchPracticeMetrics(requestKey),
            this.fetchLabCases(requestKey),
            this.fetchSupplies(requestKey),
            this.fetchMarketingData(requestKey),
            this.fetchProcedures(requestKey),
            this.fetchStaffData(requestKey),
            this.fetchHygieneData(requestKey),
            this.fetchDemographics(requestKey),
            this.fetchComplianceData(requestKey)
        ]);
        this.realTimeData = {
            patientData: patients,
            appointmentData: appointments,
            revenueData: revenue,
            practiceMetrics: metrics,
            labCases,
            supplies,
            marketing,
            procedures,
            staff,
            hygiene,
            demographics,
            compliance
        };
        return this.realTimeData;
    }
    async getDataForPatientCareAgent() {
        const data = await this.fetchRealTimeData();
        return {
            patients: data.patientData,
            appointments: data.appointmentData,
            metrics: {
                satisfaction: this.calculatePatientSatisfaction(data),
                retention: this.calculateRetentionRate(data),
                engagement: this.calculatePatientEngagement(data)
            }
        };
    }
    async getDataForRevenueAgent() {
        const data = await this.fetchRealTimeData();
        return {
            collections: data.revenueData.collections,
            insurance: data.revenueData.insuranceStats,
            aging: data.revenueData.accountsAging,
            metrics: {
                profitability: this.calculateProfitability(data),
                efficiency: this.calculateCollectionEfficiency(data),
                growth: this.calculateRevenueGrowth(data)
            }
        };
    }
    async getDataForPracticeAgent() {
        const data = await this.fetchRealTimeData();
        return {
            operations: data.practiceMetrics.operations,
            staff: data.practiceMetrics.staffing,
            scheduling: data.practiceMetrics.scheduling,
            metrics: {
                utilization: this.calculateResourceUtilization(data),
                efficiency: this.calculateOperationalEfficiency(data),
                performance: this.calculateStaffPerformance(data)
            }
        };
    }
    async getDataForAppointmentAgent() {
        const data = await this.fetchRealTimeData();
        return {
            appointments: data.appointmentData,
            patients: data.patientData,
            staff: data.staff,
            metrics: {
                utilization: this.calculateAppointmentUtilization(data),
                cancellationRate: this.calculateCancellationRate(data),
                scheduling: this.calculateSchedulingEfficiency(data)
            }
        };
    }
    async getDataForLabCaseAgent() {
        const data = await this.fetchRealTimeData();
        return {
            cases: data.labCases,
            procedures: data.procedures,
            metrics: {
                turnaroundTime: this.calculateLabTurnaroundTime(data),
                quality: this.calculateLabQuality(data),
                efficiency: this.calculateLabEfficiency(data)
            }
        };
    }
    async getDataForSuppliesAgent() {
        const data = await this.fetchRealTimeData();
        return {
            inventory: data.supplies,
            usage: this.calculateSupplyUsage(data),
            metrics: {
                stockLevels: this.calculateStockLevels(data),
                orderEfficiency: this.calculateOrderEfficiency(data),
                costs: this.calculateSupplyCosts(data)
            }
        };
    }
    async getDataForMarketingAgent() {
        const data = await this.fetchRealTimeData();
        return {
            campaigns: data.marketing,
            demographics: data.demographics,
            metrics: {
                roi: this.calculateMarketingROI(data),
                patientAcquisition: this.calculatePatientAcquisition(data),
                channelEffectiveness: this.calculateChannelEffectiveness(data)
            }
        };
    }
    async getDataForProcedureAgent() {
        const data = await this.fetchRealTimeData();
        return {
            procedures: data.procedures,
            revenue: data.revenueData,
            metrics: {
                profitability: this.calculateProcedureProfitability(data),
                frequency: this.calculateProcedureFrequency(data),
                success: this.calculateProcedureSuccess(data)
            }
        };
    }
    async getDataForStaffAgent() {
        const data = await this.fetchRealTimeData();
        return {
            staff: data.staff,
            scheduling: data.appointmentData,
            metrics: {
                productivity: this.calculateStaffProductivity(data),
                utilization: this.calculateStaffUtilization(data),
                performance: this.calculateStaffPerformance(data)
            }
        };
    }
    async getDataForHygieneAgent() {
        const data = await this.fetchRealTimeData();
        return {
            hygiene: data.hygiene,
            appointments: data.appointmentData,
            metrics: {
                production: this.calculateHygieneProduction(data),
                reappointment: this.calculateReappointmentRate(data),
                compliance: this.calculateHygieneCompliance(data)
            }
        };
    }
    async getDataForDemographicsAgent() {
        const data = await this.fetchRealTimeData();
        return {
            demographics: data.demographics,
            patients: data.patientData,
            metrics: {
                distribution: this.calculateDemographicDistribution(data),
                trends: this.calculateDemographicTrends(data),
                targeting: this.calculateTargetDemographics(data)
            }
        };
    }
    async getDataForComplianceAgent() {
        const data = await this.fetchRealTimeData();
        return {
            compliance: data.compliance,
            staff: data.staff,
            metrics: {
                adherence: this.calculateComplianceAdherence(data),
                training: this.calculateTrainingStatus(data),
                risks: this.calculateComplianceRisks(data)
            }
        };
    }
    async fetchPatientData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'patients', 'id,name,email,phone,last_visit,next_appointment,treatment_plan');
    }
    async fetchAppointmentData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'appointments', 'id,patient_id,date,status,provider_id,procedure_codes');
    }
    async fetchRevenueData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'revenue', 'collections,insurance_claims,aging,profitability');
    }
    async fetchPracticeMetrics(requestKey) {
        return getSingleRecord(requestKey, this.config.practiceId, 'practice_metrics', 'operations,staffing,scheduling,performance');
    }
    async fetchLabCases(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'lab_cases', 'id,patient_id,type,status,sent_date,received_date,quality_score');
    }
    async fetchSupplies(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'supplies', 'id,name,category,quantity,reorder_point,last_order_date,unit_cost');
    }
    async fetchMarketingData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'marketing', 'campaign_id,type,cost,roi,leads,conversions');
    }
    async fetchProcedures(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'procedures', 'code,description,fee,cost,frequency,success_rate');
    }
    async fetchStaffData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'staff', 'id,role,productivity,attendance,performance_score');
    }
    async fetchHygieneData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'hygiene', 'date,provider_id,production,reappointment_rate,patient_compliance');
    }
    async fetchDemographics(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'demographics', 'age_group,gender,location,insurance,visit_frequency');
    }
    async fetchComplianceData(requestKey) {
        return getPaginatedData(requestKey, this.config.practiceId, 'compliance', 'category,last_audit,score,issues,training_status');
    }
    calculatePatientSatisfaction(data) {
        const { appointmentData, patientData } = data;
        const completedAppointments = appointmentData.filter(apt => apt.status === 'completed');
        const totalAppointments = appointmentData.length;
        const returnPatients = patientData.filter(p => p.last_visit);
        return (completedAppointments.length / totalAppointments) *
            (returnPatients.length / patientData.length) * 100;
    }
    calculateRetentionRate(data) {
        const { patientData } = data;
        const now = new Date();
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        const activePatients = patientData.filter(p => new Date(p.last_visit) >= sixMonthsAgo);
        return (activePatients.length / patientData.length) * 100;
    }
    calculatePatientEngagement(data) {
        const { appointmentData, patientData } = data;
        const confirmedAppointments = appointmentData.filter(apt => apt.status === 'confirmed' || apt.status === 'completed');
        return (confirmedAppointments.length / appointmentData.length) * 100;
    }
    calculateProfitability(data) {
        const { revenueData } = data;
        const { collections, operatingCosts } = revenueData;
        return ((collections - operatingCosts) / collections) * 100;
    }
    calculateCollectionEfficiency(data) {
        const { revenueData } = data;
        const { collections, billedAmount } = revenueData;
        return (collections / billedAmount) * 100;
    }
    calculateRevenueGrowth(data) {
        const { revenueData } = data;
        const { currentRevenue, previousRevenue } = revenueData;
        return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    }
    calculateResourceUtilization(data) {
        const { practiceMetrics } = data;
        const { totalHours, bookedHours } = practiceMetrics.operations;
        return (bookedHours / totalHours) * 100;
    }
    calculateOperationalEfficiency(data) {
        const { practiceMetrics } = data;
        const { plannedProcedures, completedProcedures } = practiceMetrics.operations;
        return (completedProcedures / plannedProcedures) * 100;
    }
    calculateStaffPerformance(data) {
        const { practiceMetrics } = data;
        const { productivity, quality, attendance } = practiceMetrics.staffing;
        return (productivity + quality + attendance) / 3;
    }
    calculateAppointmentUtilization(data) {
        const totalSlots = data.appointmentData.length;
        const bookedSlots = data.appointmentData.filter(apt => apt.status === 'booked').length;
        return (bookedSlots / totalSlots) * 100;
    }
    calculateCancellationRate(data) {
        const totalAppointments = data.appointmentData.length;
        const cancelledAppointments = data.appointmentData.filter(apt => apt.status === 'cancelled').length;
        return (cancelledAppointments / totalAppointments) * 100;
    }
    calculateSchedulingEfficiency(data) {
        const totalSlots = data.appointmentData.length;
        const optimalSlots = data.practiceMetrics.scheduling.optimal_slots;
        return (totalSlots / optimalSlots) * 100;
    }
    calculateLabTurnaroundTime(data) {
        const cases = data.labCases;
        const turnaroundTimes = cases.map(c => new Date(c.received_date).getTime() - new Date(c.sent_date).getTime());
        return turnaroundTimes.reduce((a, b) => a + b, 0) / cases.length / (1000 * 60 * 60 * 24); // in days
    }
    calculateLabQuality(data) {
        return data.labCases.reduce((sum, c) => sum + c.quality_score, 0) / data.labCases.length;
    }
    calculateLabEfficiency(data) {
        const onTimeCases = data.labCases.filter(c => new Date(c.received_date) <= new Date(c.expected_date)).length;
        return (onTimeCases / data.labCases.length) * 100;
    }
    calculateSupplyUsage(data) {
        return data.supplies.reduce((usage, item) => ({
            ...usage,
            [item.category]: (usage[item.category] || 0) + item.quantity
        }), {});
    }
    calculateStockLevels(data) {
        return data.supplies.reduce((levels, item) => ({
            ...levels,
            [item.id]: item.quantity <= item.reorder_point ? 'low' :
                item.quantity <= item.reorder_point * 2 ? 'optimal' : 'high'
        }), {});
    }
    calculateOrderEfficiency(data) {
        const itemsNeedingReorder = data.supplies.filter(item => item.quantity <= item.reorder_point).length;
        return ((data.supplies.length - itemsNeedingReorder) / data.supplies.length) * 100;
    }
    calculateSupplyCosts(data) {
        return data.supplies.reduce((total, item) => total + (item.quantity * item.unit_cost), 0);
    }
    calculateMarketingROI(data) {
        const totalCost = data.marketing.reduce((sum, campaign) => sum + campaign.cost, 0);
        const totalRevenue = data.marketing.reduce((sum, campaign) => sum + campaign.revenue, 0);
        return ((totalRevenue - totalCost) / totalCost) * 100;
    }
    calculatePatientAcquisition(data) {
        return data.marketing.reduce((sum, campaign) => sum + campaign.conversions, 0);
    }
    calculateChannelEffectiveness(data) {
        return data.marketing.reduce((effectiveness, campaign) => ({
            ...effectiveness,
            [campaign.type]: (campaign.conversions / campaign.leads) * 100
        }), {});
    }
    calculateProcedureProfitability(data) {
        return data.procedures.reduce((profitability, proc) => ({
            ...profitability,
            [proc.code]: ((proc.fee - proc.cost) / proc.fee) * 100
        }), {});
    }
    calculateProcedureFrequency(data) {
        return data.procedures.reduce((frequency, proc) => ({
            ...frequency,
            [proc.code]: proc.frequency
        }), {});
    }
    calculateProcedureSuccess(data) {
        return data.procedures.reduce((success, proc) => ({
            ...success,
            [proc.code]: proc.success_rate
        }), {});
    }
    calculateHygieneProduction(data) {
        return data.hygiene.reduce((sum, day) => sum + day.production, 0) / data.hygiene.length;
    }
    calculateReappointmentRate(data) {
        return data.hygiene.reduce((sum, day) => sum + day.reappointment_rate, 0) / data.hygiene.length;
    }
    calculateHygieneCompliance(data) {
        return data.hygiene.reduce((sum, day) => sum + day.patient_compliance, 0) / data.hygiene.length;
    }
    calculateDemographicDistribution(data) {
        const result = {
            age_groups: {},
            gender: {},
            location: {},
            insurance: {}
        };
        data.demographics.forEach(d => {
            result.age_groups[d.age_group] = (result.age_groups[d.age_group] || 0) + 1;
            result.gender[d.gender] = (result.gender[d.gender] || 0) + 1;
            result.location[d.location] = (result.location[d.location] || 0) + 1;
            result.insurance[d.insurance] = (result.insurance[d.insurance] || 0) + 1;
        });
        return result;
    }
    calculateDemographicTrends(data) {
        // Implement trend calculation based on historical demographic data
        return {};
    }
    calculateTargetDemographics(data) {
        // Implement target demographic calculation based on revenue and visit frequency
        return {};
    }
    calculateComplianceAdherence(data) {
        return data.compliance.reduce((sum, item) => sum + item.score, 0) / data.compliance.length;
    }
    calculateTrainingStatus(data) {
        return data.compliance.reduce((status, item) => ({
            ...status,
            [item.category]: item.training_status
        }), {});
    }
    calculateComplianceRisks(data) {
        return data.compliance.reduce((risks, item) => ({
            ...risks,
            [item.category]: item.score >= 90 ? 'low' : item.score >= 75 ? 'medium' : 'high'
        }), {});
    }
}
