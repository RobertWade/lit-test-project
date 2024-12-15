# Lit Test Project

A modern web application built with [Lit](https://lit.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/), featuring a Go backend for authentication and user management.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Backend](#backend)
- [License](#license)

## Overview

This project demonstrates the use of web components with Lit, bundled using Vite and styled with Tailwind CSS. It includes a Go backend that handles user authentication and session management.

## Project Structure

```
├── frontend/         # Frontend application
│   ├── src/         # Source code
│   │   ├── components/  # Web components
│   │   ├── views/      # Page components
│   │   ├── router/     # SPA routing
│   │   ├── store/      # State management
│   │   └── shared/     # Utilities
│   ├── public/     # Static files
│   └── dist/       # Build output
└── backend/        # Go server
  └── main.go     # Server implementation with auth logic
```

## Installation

Install frontend dependencies:

```bash
cd frontend
pnpm install
```

For the Go backend:

```bash
cd backend
go mod download
```

## Development

Start the frontend dev server:

```bash
cd frontend
pnpm dev
```

Run the Go backend:

```bash
cd backend
go run main.go
```

Access the app at `http://localhost:5173`
Backend API available at `http://localhost:8080`

## Backend

The Go backend provides these endpoints:

- `/login` - User authentication
- `/logout` - Session termination
- `/userinfo` - Protected user information

Features:
- Session-based authentication
- CORS support for local development
- In-memory user and session storage
- Middleware for protected routes

## Build

Create production build:

```bash
cd frontend
pnpm build
```

Output will be in `frontend/dist/` directory.

## License

MIT License. See [LICENSE](LICENSE) for details.