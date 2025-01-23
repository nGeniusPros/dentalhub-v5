interface DashboardStats {
  appointments: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  patients: {
    total: number;
    active: number;
    new: number;
  };
  revenue: {
    total: number;
    pending: number;
    collected: number;
  };
  performance: {
    appointmentCompletionRate: number;
    patientSatisfactionRate: number;
    collectionRate: number;
  };
}

class DashboardService {
  private static instance: DashboardService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
  }

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async getStats(forceRefresh: boolean = false): Promise<DashboardStats> {
    const cacheKey = this.getCacheKey('dashboard-stats');
    
    if (!forceRefresh) {
      const cached = this.getFromCache<DashboardStats>(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch dashboard stats');
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(
    startDate: string,
    endDate: string
  ): Promise<{
    appointments: Array<{
      date: string;
      total: number;
      completed: number;
    }>;
    revenue: Array<{
      date: string;
      amount: number;
    }>;
  } | null> {
    const cacheKey = this.getCacheKey('performance-metrics', { startDate, endDate });
    const cached = this.getFromCache<{
      appointments: Array<{
        date: string;
        total: number;
        completed: number;
      }>;
      revenue: Array<{
        date: string;
        amount: number;
      }>;
    }>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch('/api/dashboard/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch performance metrics');
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  async getStaffMetrics(): Promise<Array<{
    staffId: string;
    name: string;
    role: string;
    metrics: {
      appointmentsCompleted: number;
      patientSatisfaction: number;
      revenue: number;
    };
  }> | null> {
    const cacheKey = this.getCacheKey('staff-metrics');
    const cached = this.getFromCache<Array<{
      staffId: string;
      name: string;
      role: string;
      metrics: {
        appointmentsCompleted: number;
        patientSatisfaction: number;
        revenue: number;
      };
    }>>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch('/api/dashboard/staff-metrics');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch staff metrics');
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      console.error('Error fetching staff metrics:', error);
      throw error;
    }
  }
}

export const dashboardService = DashboardService.getInstance();