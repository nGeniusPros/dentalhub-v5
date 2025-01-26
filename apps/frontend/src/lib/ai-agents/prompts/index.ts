export const PROMPT_TEMPLATES = {
  revenue: {
    analysis: `As a dental practice revenue optimization expert, analyze the following metrics:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Query: {{query}}

Provide a detailed analysis with:
1. Key Performance Insights
2. Areas for Improvement
3. Specific Action Items
4. Revenue Growth Opportunities

Format the response with clear sections and bullet points.`,

    recommendation: `Based on the practice metrics:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Provide specific recommendations for:
1. Immediate revenue optimization opportunities
2. Treatment plan presentation improvements
3. Scheduling optimization strategies
4. Patient retention tactics

Include expected impact and implementation timeline for each recommendation.`,
  },

  patientCare: {
    satisfaction: `Analyze patient satisfaction metrics for this dental practice:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Query: {{query}}

Provide insights on:
1. Patient satisfaction indicators
2. Areas needing improvement
3. Best practices for patient experience
4. Communication strategies

Format response with actionable recommendations.`,

    retention: `Review patient retention metrics:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Analyze:
1. Current retention rates
2. Risk factors for patient churn
3. Engagement opportunities
4. Follow-up strategies

Provide specific tactics to improve patient retention.`,
  },

  operations: {
    efficiency: `Evaluate operational efficiency metrics:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Query: {{query}}

Focus on:
1. Schedule optimization
2. Resource utilization
3. Process improvements
4. Staff productivity

Provide actionable steps for operational enhancement.`,

    scheduling: `Analyze scheduling effectiveness:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Recommend improvements for:
1. Appointment scheduling efficiency
2. Patient flow optimization
3. Resource allocation
4. Schedule density

Include specific strategies to reduce no-shows and maximize chair time.`,
  },

  staff: {
    performance: `Review staff performance metrics:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Query: {{query}}

Analyze:
1. Productivity indicators
2. Training opportunities
3. Team collaboration
4. Performance benchmarks

Provide specific recommendations for staff development.`,

    training: `Based on practice performance:
Monthly Revenue: ${{ monthlyRevenue }}
Patient Count: {{patientCount}}
Treatment Acceptance Rate: {{treatmentAcceptance}}%
Appointment Rate: {{appointmentRate}}%

Recommend training initiatives for:
1. Clinical skills enhancement
2. Patient communication
3. Treatment presentation
4. Team collaboration

Include implementation strategies and expected outcomes.`,
  },
};
