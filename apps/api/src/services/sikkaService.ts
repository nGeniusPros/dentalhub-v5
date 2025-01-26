import { z } from "zod";

// Sikka API request/response schemas
export const SikkaVerifyRequestSchema = z.object({
  subscriber_id: z.string(),
  insurance_company: z.string(),
  provider_npi: z.string(),
  service_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  patient: z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    member_id: z.string(),
  }),
});

export type SikkaVerifyRequest = z.infer<typeof SikkaVerifyRequestSchema>;

export class SikkaClient {
  private static BASE_URL = "https://api.sikkasoft.com/v1";

  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error("Sikka API key is required");
    }
  }

  /**
   * Verify insurance coverage for a patient
   * @param payload Insurance verification request payload
   * @returns Insurance verification response
   * @throws Error if the API request fails
   */
  async verifyInsurance(payload: SikkaVerifyRequest) {
    // Validate the request payload
    const validatedPayload = SikkaVerifyRequestSchema.parse(payload);

    const response = await fetch(`${SikkaClient.BASE_URL}/insurance/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(validatedPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Sikka API Error: ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ""
        }`,
      );
    }

    return response.json();
  }

  /**
   * Get insurance provider information
   * @param providerId The insurance provider ID
   * @returns Provider information
   */
  async getInsuranceProvider(providerId: string) {
    const response = await fetch(
      `${SikkaClient.BASE_URL}/insurance/providers/${providerId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Sikka API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Submit an insurance claim
   * @param claim The claim data
   * @returns Claim submission response
   */
  async submitClaim(claim: unknown) {
    // TODO: Add claim schema validation
    const response = await fetch(`${SikkaClient.BASE_URL}/insurance/claims`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(claim),
    });

    if (!response.ok) {
      throw new Error(`Sikka API Error: ${response.statusText}`);
    }

    return response.json();
  }
}
