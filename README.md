This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Contact form

The contact form ([src/components/ContactForm.tsx](src/components/ContactForm.tsx)) submits to
[src/app/api/contact/route.ts](src/app/api/contact/route.ts), which sends the message to
`hello@jcami.dev` via [Resend](https://resend.com).

Email sending is configured in the Resend dashboard, not in this repo:

1. Verify the `jcami.dev` domain under [resend.com/domains](https://resend.com/domains) (adds SPF/DKIM DNS records).
2. Create an API key under [resend.com/api-keys](https://resend.com/api-keys).
3. Set it locally in `.env.local` (gitignored) and in your host's env vars for production — see `.env.example`:

   ```bash
   RESEND_API_KEY=re_...
   ```

Without a verified domain, Resend will only deliver from its shared `onboarding@resend.dev` address to the account's own email — useful for testing before DNS propagates.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
