
"use client";

import type { FormState } from '@/app/create/page';

const defaultStyle = { font: "inter", fontSize: 16, isBold: false, isItalic: false };
const titleStyle = { ...defaultStyle, fontSize: 24, isBold: true };
const defaultSettings = {
  isQuiz: false,
  collectEmail: "do-not-collect" as const,
  sendCopyOfResponse: "off" as const,
  allowResponseEditing: false,
  limitToOneResponse: false,
  showProgressBar: true,
  shuffleQuestionOrder: false,
  confirmationMessage: "Your response has been recorded.",
  showLinkToSubmitAnotherResponse: true,
  viewResultsSummary: false,
  disableAutoSave: false,
  makeQuestionsRequiredByDefault: false,
};

export const templates: {
  id: string;
  title: string;
  description: string;
  icon: string;
  formState: FormState;
}[] = [
  {
    id: 'customer-feedback',
    title: 'Customer Feedback',
    description: 'Collect feedback from your customers to improve your products and services.',
    icon: 'MessageSquare',
    formState: {
      id: 'template-customer-feedback',
      title: { text: 'Customer Feedback Form', style: titleStyle },
      description: { text: 'We value your opinion. Please take a moment to share your feedback.', style: defaultStyle },
      questions: [
        { id: 'q1', text: 'How satisfied are you with our product?', type: 'rating', style: defaultStyle, ratingConfig: { scale: 5, icon: 'star' } },
        { id: 'q2', text: 'What do you like most about our product?', type: 'paragraph', style: defaultStyle },
        { id: 'q3', text: 'What can we do to improve?', type: 'paragraph', style: defaultStyle },
        { id: 'q4', text: 'Would you recommend our product to others?', type: 'radio-group', style: defaultStyle, options: [{ id: 'o1', value: 'Yes' }, { id: 'o2', value: 'No' }] },
      ],
      headerImageUrl: 'https://placehold.co/1200x400.png',
      settings: defaultSettings,
    },
  },
  {
    id: 'event-registration',
    title: 'Event Registration',
    description: 'A simple and effective way to manage registrations for your upcoming event.',
    icon: 'FileText',
    formState: {
      id: 'template-event-registration',
      title: { text: 'Event Registration', style: titleStyle },
      description: { text: 'Register now to secure your spot for this exciting event!', style: defaultStyle },
      questions: [
        { id: 'q1', text: 'Full Name', type: 'short-answer', style: defaultStyle },
        { id: 'q2', text: 'Email Address', type: 'short-answer', style: defaultStyle },
        { id: 'q3', text: 'Dietary Restrictions', type: 'checkboxes', style: defaultStyle, options: [{ id: 'o1', value: 'Vegetarian' }, { id: 'o2', value: 'Vegan' }, { id: 'o3', value: 'Gluten-Free' }, { id: 'o4', value: 'None' }] },
        { id: 'q4', text: 'T-Shirt Size', type: 'dropdown', style: defaultStyle, options: [{ id: 'o1', value: 'Small' }, { id: 'o2', value: 'Medium' }, { id: 'o3', value: 'Large' }, { id: 'o4', value: 'X-Large' }] },
      ],
       headerImageUrl: 'https://placehold.co/1200x400.png',
       settings: defaultSettings,
    },
  },
  {
    id: 'job-application',
    title: 'Job Application',
    description: 'Streamline your hiring process with this comprehensive job application form.',
    icon: 'Briefcase',
    formState: {
      id: 'template-job-application',
      title: { text: 'Job Application', style: titleStyle },
      description: { text: 'Apply for your dream job. Fill out the details below.', style: defaultStyle },
      questions: [
        { id: 'q1', text: 'Full Name', type: 'short-answer', style: defaultStyle },
        { id: 'q2', text: 'Email', type: 'short-answer', style: defaultStyle },
        { id: 'q3', text: 'Phone Number', type: 'short-answer', style: defaultStyle },
        { id: 'q4', text: 'Position Applied For', type: 'short-answer', style: defaultStyle },
        { id: 'q5', text: 'Resume/CV Upload', type: 'file-upload', style: defaultStyle },
        { id: 'q6', text: 'Cover Letter', type: 'paragraph', style: defaultStyle },
      ],
       headerImageUrl: 'https://placehold.co/1200x400.png',
       settings: defaultSettings,
    },
  },
  {
    id: 'contact-form',
    title: 'Contact Form',
    description: 'A basic contact form for your website to let visitors get in touch with you easily.',
    icon: 'Phone',
    formState: {
      id: 'template-contact-form',
      title: { text: 'Contact Us', style: titleStyle },
      description: { text: 'Have questions? We\'d love to hear from you. Drop us a message!', style: defaultStyle },
      questions: [
        { id: 'q1', text: 'Name', type: 'short-answer', style: defaultStyle },
        { id: 'q2', text: 'Email', type: 'short-answer', style: defaultStyle },
        { id: 'q3', text: 'Subject', type: 'short-answer', style: defaultStyle },
        { id: 'q4', text: 'Message', type: 'paragraph', style: defaultStyle },
      ],
       headerImageUrl: 'https://placehold.co/1200x400.png',
       settings: defaultSettings,
    },
  },
  {
    id: 'party-invite',
    title: 'Party Invitation',
    description: 'RSVP to our party and let us know if you can make it.',
    icon: 'PartyPopper',
    formState: {
      id: 'template-party-invite',
      title: { text: 'You\'re Invited!', style: titleStyle },
      description: { text: 'Join us for a celebration! Please RSVP below.', style: defaultStyle },
      questions: [
        { id: 'q1', text: 'Full Name', type: 'short-answer', style: defaultStyle },
        { id: 'q2', text: 'Will you be attending?', type: 'radio-group', style: defaultStyle, options: [{ id: 'o1', value: 'Yes, I\'ll be there!' }, { id: 'o2', value: 'Sorry, I can\'t make it.' }] },
        { id: 'q3', text: 'What will you be bringing?', type: 'checkboxes', style: defaultStyle, options: [{ id: 'o1', value: 'Mains' }, { id: 'o2', value: 'Salad' }, { id: 'o3', value: 'Dessert' }, { id: 'o4', value: 'Drinks' }, { id: 'o5', value: 'Sides/Appetizers' }, { id: 'o6', value: 'Other...' }] },
        { id: 'q4', text: 'Do you have any allergies or dietary restrictions?', type: 'paragraph', style: defaultStyle },
        { id: 'q5', text: 'Contact Number', type: 'short-answer', style: defaultStyle },
        { id: 'q6', text: 'Email Address', type: 'short-answer', style: defaultStyle },
      ],
      headerImageUrl: 'https://placehold.co/1200x400.png',
      settings: defaultSettings,
    },
  },
];

export const getTemplate = (id: string) => {
  return templates.find(template => template.id === id);
}
