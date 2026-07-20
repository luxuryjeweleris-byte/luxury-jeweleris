import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = process.env.EMAIL_FROM ?? 'auth@luxuryjeweleris.com';
  const fromName = process.env.EMAIL_FROM_NAME ?? 'Luxury Jeweleris';

  const { data, error } = await resend.emails.send({
    from: `${fromName} <${from}>`,
    to,
    subject,
    html,
  });

  if (error) throw new Error(error.message);

  return data;
}
