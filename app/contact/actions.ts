'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Please enter a valid name, email, and message.'
    };
  }

  console.log('Contact form submission:', parsed.data);

  return {
    success: true,
    message: 'Message received. I will get back to you soon.'
  };
}
