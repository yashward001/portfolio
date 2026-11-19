'use client';

import { Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const fieldClass =
  'focus-ring w-full rounded-2xl border border-border bg-bg px-4 py-3 text-[15px] text-fg placeholder:text-subtle transition focus:border-fg/30 focus:bg-card';

/**
 * No backend: submitting opens the visitor's email client with the message pre-filled,
 * so nothing is silently dropped. Swap for a server action + email provider later if needed.
 */
export const ContactForm = ({ email }: { email: string }) => {
  const [opened, setOpened] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = `Hello from ${name || 'your portfolio'}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setOpened(true);
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-7">
      <h2 className="text-lg font-semibold">Send a message</h2>

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Jane Doe"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="What would you like to talk about?"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" className="btn-primary focus-ring">
          <Send className="h-4 w-4" aria-hidden /> Open in email
        </button>
        <p className="text-xs text-subtle" role="status">
          {opened ? (
            <>
              Your email app should open. If not, write to{' '}
              <a href={`mailto:${email}`} className="link-underline text-fg">
                {email}
              </a>
              .
            </>
          ) : (
            'Opens your email app with this message filled in.'
          )}
        </p>
      </div>
    </form>
  );
};
