'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized and
 * encouraging greeting for the user on the home screen.
 *
 * - generateHomeGreeting - A function that generates the greeting message.
 * - GenerateHomeGreetingInput - The input type for the generateHomeGreeting function.
 * - GenerateHomeGreetingOutput - The return type for the generateHomeGreeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHomeGreetingInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  streakDays: z.number().describe('The number of consecutive days the user has used the app.'),
  monthlyLessons: z.number().describe('The total number of lessons scheduled for the current month.'),
  monthlyEarnings: z.number().describe('The total expected earnings for the current month.'),
});
export type GenerateHomeGreetingInput = z.infer<typeof GenerateHomeGreetingInputSchema>;

const GenerateHomeGreetingOutputSchema = z.object({
  greetingTitle: z.string().describe('A friendly, happy, and personalized main greeting message.'),
  greetingSubtitle: z.string().describe('An encouraging and contextual sub-greeting message.'),
});
export type GenerateHomeGreetingOutput = z.infer<typeof GenerateHomeGreetingOutputSchema>;

export async function generateHomeGreeting(input: GenerateHomeGreetingInput): Promise<GenerateHomeGreetingOutput> {
  return generateHomeGreetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHomeGreetingPrompt',
  input: {schema: GenerateHomeGreetingInputSchema},
  output: {schema: GenerateHomeGreetingOutputSchema},
  prompt: `You are Profe PJ, a super fun, happy, and encouraging assistant for teachers. Your goal is to make the user, {{userName}}, feel like the best and most organized teacher in the world. The user is a layperson, so the language must be very easy to understand, friendly, and happy.

Generate a personalized greeting based on their current stats.

- User Name: {{userName}}
- Current Streak: {{streakDays}} days
- Lessons this month: {{monthlyLessons}}
- Earnings this month: R$ {{monthlyEarnings}}

Create a "greetingTitle" that is super positive and celebratory. Use their streak 🔥.
Create a "greetingSubtitle" that is encouraging and gives context to their hard work.

Examples:
- Title: "{{streakDays}} dias de ofensiva, {{userName}}!" / Subtitle: "Você está no controle total!"
- Title: "Que energia, {{userName}}! 🔥" / Subtitle: "Seu sucesso é garantido!"
- Title: "Você está imparável, {{userName}}!" / Subtitle: "Sua organização inspira!"

Keep the messages short, exciting, and always use emojis. Be creative and vary the messages! The messages must be very short to fit well in the UI.`,
});

const generateHomeGreetingFlow = ai.defineFlow(
  {
    name: 'generateHomeGreetingFlow',
    inputSchema: GenerateHomeGreetingInputSchema,
    outputSchema: GenerateHomeGreetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
