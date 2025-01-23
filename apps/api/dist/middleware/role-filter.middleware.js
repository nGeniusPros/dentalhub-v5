import { DataFilterService } from '../services/data-filter.service';
const KPI_ACCESS_MATRIX = new Map([
    ['front-office', ['hourlyOperatoryRate', 'dailyHygieneTarget']],
    ['management', ['*']],
    ['clinical', ['treatmentAcceptance', 'patientSatisfaction']]
]);
export const roleBasedKPIFilter = (roles) => {
    return (req, res, next) => {
        const filter = new DataFilterService(roles, KPI_ACCESS_MATRIX);
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            const filtered = filter.apply(data);
            return originalJson(filtered);
        };
        next();
    };
};
