'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a friendly and non-anxious alert
 * reminding the user about the upcoming DAS tax due date, using a relatable metaphor like the 'DAS monster'.
 *
 * - generateDasAlert - A function that generates the DAS alert message.
 * - GenerateDasAlertInput - The input type for the generateDasAlert function.
 * - GenerateDasAlertOutput - The return type for the generateDasAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDasAlertInputSchema = z.object({
  daysUntilDue: z.number().describe('The number of days until the DAS tax is due.'),
});
export type GenerateDasAlertInput = z.infer<typeof GenerateDasAlertInputSchema>;

const GenerateDasAlertOutputSchema = z.object({
  alertMessage: z.string().describe('A friendly and non-anxious alert message about the upcoming DAS tax due date.'),
});
export type GenerateDasAlertOutput = z.infer<typeof GenerateDasAlertOutputSchema>;

export async function generateDasAlert(input: GenerateDasAlertInput): Promise<GenerateDasAlertOutput> {
  return generateDasAlertFlow(input);
}

const generateDasAlertPrompt = ai.definePrompt({
  name: 'generateDasAlertPrompt',
  input: {schema: GenerateDasAlertInputSchema},
  output: {schema: GenerateDasAlertOutputSchema},
  prompt: `You are Profe PJ, a super fun and organized assistant. Generate a friendly and non-anxious alert message about the upcoming DAS tax due date ({{daysUntilDue}} days). Use the metaphor of the "DAS monster" to make it relatable and less intimidating. Keep the message short and encouraging, using emojis. Focus on being helpful and supportive, not causing anxiety.`,
});

const generateDasAlertFlow = ai.defineFlow(
  {
    name: 'generateDasAlertFlow',
    inputSchema: GenerateDasAlertInputSchema,
    outputSchema: GenerateDasAlertOutputSchema,
  },
  async input => {
    const {output} = await generateDasAlertPrompt(input);
    return output!;
  }
);
