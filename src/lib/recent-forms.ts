
"use client";

import type { FormState } from "@/app/create/page";

export type RecentForm = FormState;

const RECENT_FORMS_KEY = "recentForms";

export const getRecentForms = (): RecentForm[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const formsJson = localStorage.getItem(RECENT_FORMS_KEY);
    return formsJson ? JSON.parse(formsJson) : [];
  } catch (error) {
    console.error("Failed to parse recent forms from localStorage", error);
    return [];
  }
};

export const saveRecentForm = (formToSave: RecentForm): void => {
  if (typeof window === "undefined") {
    return;
  }
  const recentForms = getRecentForms();
  const existingFormIndex = recentForms.findIndex((form) => form.id === formToSave.id);

  if (existingFormIndex > -1) {
    // Update existing form
    recentForms[existingFormIndex] = formToSave;
  } else {
    // Add new form to the beginning
    recentForms.unshift(formToSave);
  }

  // Limit to 10 recent forms
  const limitedForms = recentForms.slice(0, 10);

  try {
    localStorage.setItem(RECENT_FORMS_KEY, JSON.stringify(limitedForms));
  } catch (error) {
    console.error("Failed to save recent form to localStorage", error);
  }
};

export const deleteRecentForm = (formId: string): void => {
    if (typeof window === "undefined") {
        return;
    }
    const recentForms = getRecentForms();
    const updatedForms = recentForms.filter(form => form.id !== formId);

    try {
        localStorage.setItem(RECENT_FORMS_KEY, JSON.stringify(updatedForms));
    } catch (error) {
        console.error("Failed to delete recent form from localStorage", error);
    }
};
