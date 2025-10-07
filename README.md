# CloudRay - Unlimited Telegram Cloud Storage

Welcome to CloudRay, a web application that provides a free, fast, and secure interface for unlimited cloud storage by leveraging your Telegram "Saved Messages" chat.

This project is built with [Next.js](https://nextjs.org), [MongoDB](https://www.mongodb.com), and the [Telegram API](https://core.telegram.org/api).

## Project Vision

The mission of CloudRay is to offer a seamless cloud storage experience without the storage limitations and costs associated with traditional providers. All file data is stored directly and securely in your personal Telegram account, while metadata is indexed in MongoDB for fast access and organization.

## Environment Setup

To run this project locally, you need to set up the following environment variables. Create a `.env.local` file in the root of the project and add the following, replacing the placeholder values with your actual credentials.

```
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=cloudray_metadata

# Telegram API Keys
# Obtain these from my.telegram.org
TELEGRAM_API_ID=your_telegram_api_id
TELEGRAM_API_HASH=your_telegram_api_hash

# Telegram Session String (optional, for development)
# This will be generated and stored after the first login
TELEGRAM_SESSION=
```

Refer to the `.env.example` file for a template.

## Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.