
"use server";

import { optimizeForm } from "@/ai/flows/form-optimizer";
import type { FormState } from "./create/page";

export async function getOptimizedForm(formContent: string) : Promise<{ success: boolean; data?: FormState, error?: string; }> {
  try {
    const result = await optimizeForm({ formContent });
    if (result && result.optimizedFormContent) {
        try {
            const parsedForm = JSON.parse(result.optimizedFormContent);
            // Add a new unique ID to the form to avoid conflicts
            parsedForm.id = `form-${new Date().getTime()}`;
            return { success: true, data: parsedForm as FormState };
        } catch(e) {
            console.error("Failed to parse AI response:", e);
            return { success: false, error: "AI returned an invalid form structure." };
        }
    }
    return { success: false, error: "Failed to get a valid response from AI." };
  } catch (error) {
    console.error("Error optimizing form:", error);
    return { success: false, error: "An unexpected error occurred while optimizing the form." };
  }
}
