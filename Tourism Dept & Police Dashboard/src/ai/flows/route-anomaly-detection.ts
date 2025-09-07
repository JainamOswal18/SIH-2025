'use server';

/**
 * @fileOverview Analyzes tourist routes and generates alerts for deviations from planned itineraries.
 *
 * - analyzeRouteDeviation - Analyzes a tourist route for deviations and generates alerts.
 * - RouteDeviationInput - The input type for the analyzeRouteDeviation function.
 * - RouteDeviationOutput - The return type for the analyzeRouteDeviation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteDeviationInputSchema = z.object({
  plannedRoute: z
    .string()
    .describe('The tourist\'s planned itinerary, including specific locations and expected timestamps.'),
  actualRoute: z
    .string()
    .describe('The tourist\'s actual route, including specific locations and timestamps.'),
  touristId: z.string().describe('The unique identifier of the tourist.'),
});
export type RouteDeviationInput = z.infer<typeof RouteDeviationInputSchema>;

const RouteDeviationOutputSchema = z.object({
  isDeviation: z
    .boolean()
    .describe('Whether or not the tourist has deviated from their planned route.'),
  deviationDetails: z
    .string()
    .describe('Details about the deviation, including the location and time of the deviation.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the potential risks associated with the deviation.'),
});
export type RouteDeviationOutput = z.infer<typeof RouteDeviationOutputSchema>;

export async function analyzeRouteDeviation(
  input: RouteDeviationInput
): Promise<RouteDeviationOutput> {
  return analyzeRouteDeviationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeDeviationPrompt',
  input: {schema: RouteDeviationInputSchema},
  output: {schema: RouteDeviationOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing tourist routes and identifying deviations from planned itineraries.

You will receive the tourist's planned route and actual route, and you will determine whether the tourist has deviated from their planned route.

If the tourist has deviated from their planned route, you will provide details about the deviation, including the location and time of the deviation, and an assessment of the potential risks associated with the deviation.

Planned Route: {{{plannedRoute}}}
Actual Route: {{{actualRoute}}}
Tourist ID: {{{touristId}}}`,
});

const analyzeRouteDeviationFlow = ai.defineFlow(
  {
    name: 'analyzeRouteDeviationFlow',
    inputSchema: RouteDeviationInputSchema,
    outputSchema: RouteDeviationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
