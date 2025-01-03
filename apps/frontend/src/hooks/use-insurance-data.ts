import { useState, useEffect } from 'react';
import { fetchClaims } from '../lib/api/dentalxchange';

export const useInsuranceData = () => {
  const [claims, setClaims] = useState([]);
  const [metrics, setMetrics] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    deniedClaims: 0,
    averageProcessingDays: 0,
    totalAR: 0,
    claimAcceptanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInsuranceData = async () => {
      try {
        const claimsData = await fetchClaims({});
        setClaims(claimsData);
        // Calculate metrics from claims data
        // This would be replaced with actual API calls in production
        setMetrics({
          totalClaims: 450,
          pendingClaims: 85,
          deniedClaims: 15,
          averageProcessingDays: 12,
          totalAR: 125000,
          claimAcceptanceRate: 92
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load insurance data');
      } finally {
        setLoading(false);
      }
    };

    loadInsuranceData();
  }, []);

  return { claims, metrics, loading, error };
};