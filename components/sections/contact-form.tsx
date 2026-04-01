'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { submitContactForm, type ContactFormState } from '@/app/contact/actions';

const initialState: ContactFormState = {
  success: false,
  message: ''
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="focus-ring rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
};

export const ContactForm = () => {
  const [state, action] = useFormState(submitContactForm, initialState);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-card/80 p-6">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm">Name</label>
        <input id="name" name="name" required className="focus-ring w-full rounded-md border border-border bg-bg px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm">Email</label>
        <input id="email" name="email" type="email" required className="focus-ring w-full rounded-md border border-border bg-bg px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label htmlFor="message" className="text-sm">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="focus-ring w-full rounded-md border border-border bg-bg px-3 py-2"
        />
      </div>
      <SubmitButton />
      {state.message ? (
        <p className={`text-sm ${state.success ? 'text-success' : 'text-red-500'}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
};
