# Remix of DogCat

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/leonardo6063-9411s-projects/v0-remix-of-dog-cat)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/9YD32HpmzuX)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/leonardo6063-9411s-projects/v0-remix-of-dog-cat](https://vercel.com/leonardo6063-9411s-projects/v0-remix-of-dog-cat)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/9YD32HpmzuX](https://v0.app/chat/projects/9YD32HpmzuX)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local development

Install dependencies using [pnpm](https://pnpm.io):

```bash
pnpm install
```

Available scripts:

```bash
pnpm dev        # Start the development server
pnpm lint       # Run ESLint
pnpm typecheck  # Check TypeScript types
pnpm build      # Create a production build
```

The CI pipeline runs `pnpm lint`, `pnpm typecheck` and `pnpm build` to prevent deployments when linting or type errors are present.
