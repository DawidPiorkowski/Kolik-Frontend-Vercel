# Kolik Frontend

**Version**: 0.0.1

A React + TypeScript frontend for the Kolik shopping and price comparison platform.

## Prerequisites

- Node.js >= 16.x
- npm >= 8.x (or yarn >= 1.x)
- A running backend API at `http://localhost:8000/api` with CORS enabled

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kolik-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

- **API Base URL**: By default, the app points to `http://localhost:8000/api`. To change this:
  1. Open `src/services/api.ts`.
  2. Update the `API_BASE` constant to your desired endpoint.

## Available Scripts

- `npm run dev` / `yarn dev`
  - Starts the Vite development server at [http://localhost:5173](http://localhost:5173).

## Project Structure

```
kolik-frontend/
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── package.json                # Project metadata & scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS plugins
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Top-level React component & routes
│   ├── styles/                 # Global CSS (Tailwind)
│   ├── assets/                 # Static assets (images, icons)
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React context (AuthProvider)
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route-based page components
│   └── services/               # API client functions
└── node_modules/               # Installed dependencies
```

## Technologies

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/) 18
- [TypeScript](https://www.typescriptlang.org/) 4+
- [Tailwind CSS](https://tailwindcss.com/) 3
- [React Router](https://reactrouter.com/) v6
