'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { submitContactForm, type ContactFormState } from '@/app/contact/actions';

const initialState: ContactFormState = { success: false, message: '' };

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring mt-2 border border-[#00ff41] bg-transparent px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.35)] disabled:opacity-40"
    >
      {pending ? '> TRANSMITTING...' : '> SEND MESSAGE [▶]'}
    </button>
  );
};

const TermField = ({
  id, label, type = 'text', required = true, rows
}: {
  id: string; label: string; type?: string; required?: boolean; rows?: number;
}) => (
  <div className="space-y-1">
    <p className="font-mono text-[10px] uppercase tracking-widest text-[#006622]">
      <span className="text-[#004d1a]">&gt; </span>Enter {label}:
    </p>
    {rows ? (
      <textarea
        id={id}
        name={id}
        required={required}
        rows={rows}
        className="focus-ring w-full border-b border-[#003d0f] bg-transparent px-2 py-1.5 font-mono text-sm text-[#33ff66] placeholder:text-[#003d0f] focus:border-[#00ff41] focus:outline-none"
        placeholder="█"
      />
    ) : (
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="focus-ring w-full border-b border-[#003d0f] bg-transparent px-2 py-1.5 font-mono text-sm text-[#33ff66] placeholder:text-[#003d0f] focus:border-[#00ff41] focus:outline-none"
        placeholder="█"
      />
    )}
  </div>
);

export const ContactForm = () => {
  const [state, action] = useFormState(submitContactForm, initialState);

  return (
    <form action={action} className="space-y-5 border border-[#003d0f] bg-[#0a0f0a] p-6">
      <p className="font-mono text-xs text-[#006622]">
        <span className="text-[#00ff41]">root@yst</span>
        <span className="text-[#006622]">:~$</span> ./contact.sh
      </p>
      <p className="font-mono text-[10px] text-[#004d1a]">Initializing secure channel...</p>

      <TermField id="name"    label="your name"    />
      <TermField id="email"   label="your email"   type="email" />
      <TermField id="message" label="your message" rows={5} />

      <SubmitButton />

      {state.message && (
        <p
          className={`font-mono text-xs ${state.success ? 'text-[#00ff41]' : 'text-red-500'}`}
          role="status"
        >
          &gt; {state.message}
        </p>
      )}
    </form>
  );
};
