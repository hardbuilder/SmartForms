
'use server';

/**
 * @fileOverview AI-powered form generator and optimizer flow.
 *
 * This flow suggests improvements for form questions and answer options to
 * increase engagement and collect more useful feedback. It can also generate
 * a full form from a user prompt.
 *
 * @module ai/flows/form-optimizer
 *
 * @typedef {object} FormOptimizerInput - Input type for the form optimizer flow.
 * @property {string} formContent - The content of the form to be optimized, or a prompt to generate a new form.
 *
 * @typedef {object} FormOptimizerOutput - Output type for the form optimizer flow.
 * @property {string} optimizedFormContent - The AI-optimized form content as a JSON string.
 *
 * @function optimizeForm - A function that takes form content as input and returns AI-optimized form content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormOptimizerInputSchema = z.object({
  formContent: z.string().describe('A prompt describing the form to generate.'),
});
export type FormOptimizerInput = z.infer<typeof FormOptimizerInputSchema>;

const FormOptimizerOutputSchema = z.object({
  optimizedFormContent: z
    .string()
    .describe('The AI-generated form content, as a JSON string conforming to the FormState type. Ensure all question IDs and option IDs are unique UUIDs.'),
});
export type FormOptimizerOutput = z.infer<typeof FormOptimizerOutputSchema>;


export async function optimizeForm(input: FormOptimizerInput): Promise<FormOptimizerOutput> {
  return optimizeFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formOptimizerPrompt',
  input: {schema: FormOptimizerInputSchema},
  output: {schema: FormOptimizerOutputSchema},
  prompt: `You are an AI-powered form generation expert. Your task is to create a complete form based on the user's prompt. The output must be a valid JSON string that conforms to the following TypeScript type definition for a form's state.

IMPORTANT: 
- Generate unique UUIDs for every single 'id' field for the form itself, each question, and each option.
- The 'type' for each question must be one of the following exact string values: "short-answer", "paragraph", "radio-group", "checkboxes", "dropdown", "file-upload", "rating", "date", "time", "address".
- For 'rating' questions, you can optionally include a 'ratingConfig' with 'scale' (1-10) and 'icon' ('star', 'heart', or 'thumbs-up').
- Do not include any image URLs.
- Provide a relevant title and description for the form.
- Provide a default set of settings for the form.

type FormState = {
  id: string; // Must be a unique UUID
  title: { text: string; style: FormElementStyle };
  description: { text: string; style: FormElementStyle };
  questions: Question[];
  settings: FormSettings;
  headerImageUrl?: string; // Do not include this
};

type Question = {
  id: string; // Must be a unique UUID
  text: string;
  type: QuestionType;
  style: FormElementStyle;
  options?: Option[];
  imageUrl?: string; // Do not include this
  ratingConfig?: {
    scale: number; // e.g., 5
    icon: 'star' | 'heart' | 'thumbs-up';
  };
};

type Option = {
  id: string; // Must be a unique UUID
  value: string;
  imageUrl?: string; // Do not include this
};

type QuestionType =
  | "short-answer"
  | "paragraph"
  | "radio-group"
  | "checkboxes"
  | "dropdown"
  | "file-upload"
  | "rating"
  | "date"
  | "time"
  | "address";

type FormElementStyle = {
  font: "inter" | "arial" | "georgia" | "times-new-roman" | "roboto" | "open-sans" | "lato" | "montserrat";
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
};

type FormSettings = {
  isQuiz: boolean;
  collectEmail: "do-not-collect" | "verified-only" | "unverified-only";
  sendCopyOfResponse: "off" | "when-requested" | "always";
  allowResponseEditing: boolean;
  limitToOneResponse: boolean;
  showProgressBar: boolean;
  shuffleQuestionOrder: boolean;
  confirmationMessage: string;
  showLinkToSubmitAnotherResponse: boolean;
  viewResultsSummary: boolean;
  disableAutoSave: boolean;
  makeQuestionsRequiredByDefault: boolean;
};

// Default styles to use
const defaultStyle: FormElementStyle = { font: "inter", fontSize: 16, isBold: false, isItalic: false };
const titleStyle: FormElementStyle = { ...defaultStyle, fontSize: 24, isBold: true };

User Prompt:
{{{formContent}}}

Optimized Form Content (as a valid JSON string, no markdown):`,
});

const optimizeFormFlow = ai.defineFlow(
  {
    name: 'optimizeFormFlow',
    inputSchema: FormOptimizerInputSchema,
    outputSchema: FormOptimizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
