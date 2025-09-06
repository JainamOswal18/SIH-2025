'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating risk zone alerts with recommended actions.
 *
 * It includes:
 * - `generateRiskZoneAlert`: Function to generate a risk zone alert with tailored actions.
 * - `RiskZoneAlertInput`: Input type for the `generateRiskZoneAlert` function.
 * - `RiskZoneAlertOutput`: Output type for the `generateRiskZoneAlert` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskZoneAlertInputSchema = z.object({
  zoneType: z
    .string()
    .describe(
      'The type of risk zone the tourist is entering (e.g., restricted tribal area, forest boundary, highway danger spot).'  
    ),
  location: z
    .string()
    .describe(
      'The current location of the tourist, described in natural language.'
    ),
  riskLevel: z
    .string()
    .describe(
      'The level of risk associated with the zone (high, moderate, low).'  
    ),
  region: z
    .string()
    .describe(
      'The specific region or area the tourist is in (e.g., Kaziranga National Park, Guwahati city).'  
    ),
});
export type RiskZoneAlertInput = z.infer<typeof RiskZoneAlertInputSchema>;

const RiskZoneAlertOutputSchema = z.object({
  alertMessage: z
    .string()
    .describe('A detailed alert message describing the risk.'),
  recommendedActions: z.array(
    z.string().describe('A list of recommended actions for the tourist.')
  ),
});
export type RiskZoneAlertOutput = z.infer<typeof RiskZoneAlertOutputSchema>;

export async function generateRiskZoneAlert(
  input: RiskZoneAlertInput
): Promise<RiskZoneAlertOutput> {
  return riskZoneAlertFlow(input);
}

const riskZoneAlertPrompt = ai.definePrompt({
  name: 'riskZoneAlertPrompt',
  input: {
    schema: RiskZoneAlertInputSchema,
  },
  output: {
    schema: RiskZoneAlertOutputSchema,
  },
  prompt: `You are an AI assistant that provides safety advice to tourists.

A tourist is entering a risk zone. Based on the zone type, location, risk level, and region,
generate an alert message and a list of recommended actions.

Zone Type: {{{zoneType}}}
Location: {{{location}}}
Risk Level: {{{riskLevel}}}
Region: {{{region}}}

Alert Message: A detailed message describing the specific risks associated with the zone.
Recommended Actions: A list of specific, actionable steps the tourist should take to ensure their safety.
`,
});

const riskZoneAlertFlow = ai.defineFlow(
  {
    name: 'riskZoneAlertFlow',
    inputSchema: RiskZoneAlertInputSchema,
    outputSchema: RiskZoneAlertOutputSchema,
  },
  async input => {
    const {output} = await riskZoneAlertPrompt(input);
    return output!;
  }
);
