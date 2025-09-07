'use server';

import { generateRiskZoneAlert } from '@/ai/flows/risk-zone-alerts-flow';
import type { RiskZoneAlertInput } from '@/ai/flows/risk-zone-alerts-flow';

export async function getRiskAlert(input: RiskZoneAlertInput) {
  try {
    const result = await generateRiskZoneAlert(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating risk alert:', error);
    return { success: false, error: 'Failed to generate alert from AI.' };
  }
}
