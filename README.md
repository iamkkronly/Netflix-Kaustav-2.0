This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Push Notifications Setup

This project uses web push notifications to send updates to users. To get this feature working locally, you'll need to generate VAPID keys and set them up as environment variables.

1.  **Install web-push globally:**
    ```bash
    npm install -g web-push
    ```

2.  **Generate VAPID keys:**
    Run the following command to generate your VAPID keys:
    ```bash
    web-push generate-vapid-keys
    ```
    This will output a public and a private key.

3.  **Set up your environment variables:**
    Create a new file named `.env.local` in the root of the project and add the following content, replacing the placeholder values with your generated keys and your email address:
    ```
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
    VAPID_PRIVATE_KEY=your_private_key_here
    VAPID_MAILTO=mailto:your_email@example.com
    ```

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
