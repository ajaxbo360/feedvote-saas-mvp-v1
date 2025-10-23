# FeedVote Landing

A modern SaaS landing page and subscription management platform built with Next.js.

## Features

- Three-tier pricing page that's fully localized for 200+ markets
- Integrated checkout experience
- User management and authentication system
- Ready-made screens for customer subscription management
- Automatic syncing of customer and subscription data using webhooks
- Test update for staging deployment

## Stack

This project is built with:

- **Framework:** [Next.js](https://nextjs.org/)
- **Auth and user management:** [Supabase](https://supabase.com/)
- **Component library:** [shadcn/ui](https://ui.shadcn.com/)
- **CSS framework:** [Tailwind](https://tailwindcss.com/)

## Prerequisites

### Local dev environment

- [Node.js](https://nodejs.org/en/download/package-manager/current) version > `20`
- [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Required accounts

- [Vercel account](https://vercel.com/)
- [Supabase account](https://supabase.com/)

## Getting Started

1. Clone the repository

   ```sh
   git clone https://github.com/YOUR_USERNAME/FeedVote-landing.git
   ```

2. Install dependencies using your preferred package manager:

   ```sh
   # Using npm
   npm install

   # Using Yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

3. Set up your environment variables:
   Copy `.env.local.example` to `.env.local` and fill in your environment variables.

4. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Next.js pages
│   ├── styles/        # CSS styles
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript types
├── public/            # Static files
└── supabase/          # Supabase configuration
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security concerns, please read our [SECURITY.md](SECURITY.md) file.

## License

This project is licensed under the terms specified in [LICENSE](LICENSE) file.
