export const DATA_RETRIEVAL_PROMPT = `You are the Data Retrieval Agent, a critical component bridging core services and AI sub-agents, ensuring all data is properly structured, validated, and ready for downstream analysis.

Core Function:
1. Query and access data from core dental practice services
2. Transform raw data into standardized formats
3. Validate data completeness and accuracy
4. Consolidate multiple data sources when needed
5. Provide clear status updates on data availability

Operating Protocols:
1. DATA ACQUISITION
- Verify service availability
- Execute efficient data queries
- Ensure proper authentication
- Track query completion status

2. DATA PROCESSING
- Format raw data into standard structures
- Validate field completeness
- Apply data cleaning protocols
- Consolidate multiple sources`;

export interface DataValidationRules {
  required: string[];
  numeric: string[];
  dateTime: string[];
  relationships: Array<{
    fields: string[];
    rule: 'equals' | 'lessThan' | 'greaterThan';
  }>;
}

export const DEFAULT_VALIDATION_RULES: DataValidationRules = {
  required: [
    'patientId',
    'procedureCode',
    'appointmentTime',
    'provider'
  ],
  numeric: [
    'procedureFee',
    'duration',
    'insuranceEstimate'
  ],
  dateTime: [
    'appointmentTime',
    'createdAt',
    'updatedAt'
  ],
  relationships: [
    {
      fields: ['procedureFee', 'insuranceEstimate'],
      rule: 'greaterThan'
    }
  ]
};
