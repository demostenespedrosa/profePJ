// This file is implemented with 'use server' since it will be imported by Next.js React code.
'use server';

/**
 * @fileOverview Generates a personalized, friendly, and encouraging pop-up message after completing a lesson.
 *
 * - generateDopamineFeedback - A function that generates the dopamine feedback message.
 * - GenerateDopamineFeedbackInput - The input type for the generateDopamineFeedback function.
 * - GenerateDopamineFeedbackOutput - The return type for the generateDopamineFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDopamineFeedbackInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  valorTotal: z.number().describe('The total value earned from the lesson.'),
  valorBolso: z.number().describe('The remaining value after allocation to pots.'),
  split: z
    .array(
      z.object({
        nome: z.string().describe('The name of the pot.'),
        valor: z.number().describe('The amount allocated to the pot.'),
      })
    )
    .describe('A list of pots and their allocated values.'),
});
export type GenerateDopamineFeedbackInput = z.infer<typeof GenerateDopamineFeedbackInputSchema>;

const GenerateDopamineFeedbackOutputSchema = z.object({
  message: z.string().describe('The generated pop-up message.'),
});
export type GenerateDopamineFeedbackOutput = z.infer<typeof GenerateDopamineFeedbackOutputSchema>;

export async function generateDopamineFeedback(input: GenerateDopamineFeedbackInput): Promise<GenerateDopamineFeedbackOutput> {
  return generateDopamineFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDopamineFeedbackPrompt',
  input: {schema: GenerateDopamineFeedbackInputSchema},
  output: {schema: GenerateDopamineFeedbackOutputSchema},
  prompt: `You are Profe PJ, a super fun and encouraging assistant. The user {{userName}} just earned R$ {{valorTotal}}. Generate a pop-up message (with emojis 🎉) to congratulate them and show how the money was divided:

{{#each split}}
* + R$ {{valor}} -> {{nome}}
{{/each}}

and the final value R$ {{valorBolso}} that's left for them to use as they wish. Be super encouraging and friendly, and use a conversational tone. Always remember to use emojis! Make it short and sweet! Remember to congratulate the user and make them feel good about their accomplishment.`,
});

const generateDopamineFeedbackFlow = ai.defineFlow(
  {
    name: 'generateDopamineFeedbackFlow',
    inputSchema: GenerateDopamineFeedbackInputSchema,
    outputSchema: GenerateDopamineFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
