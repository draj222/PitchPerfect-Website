# ConnectUp

A platform for connecting startup founders with potential cofounders and founding engineers.

## Features

- User authentication and profile management
- Job posting and discovery system
- Matching algorithm based on skills and preferences
- Real-time messaging with potential connections
- Dashboard with analytics and progress tracking

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## Prerequisites

- Node.js (v14+)
- npm (v7+)
- MongoDB (local or Atlas connection)

## Environment Setup

1. Clone the repository
2. Set up environment variables:
   - Copy `frontend/.env.example` to `frontend/.env`
   - Copy `backend/.env.example` to `backend/.env`
   - Update the environment variables as needed

## Development Mode

To run the application in development mode with hot reloading:

```bash
# Install dependencies for both frontend and backend
npm run install:all

# Start both servers in development mode
npm run dev
```

This will start:
- Frontend server at http://localhost:5173
- Backend server at http://localhost:5000

## Production Mode

To build and run the application in production mode:

```bash
# Option 1: Use the deploy script (recommended)
./deploy.sh

# Option 2: Manual steps
npm run install:all
npm run build
npm run start:prod
```

In production mode, the backend server will serve both the API and the static frontend files on port 5000.

## Accessing the Application

- **Development**: Visit http://localhost:5173 in your browser
- **Production**: Visit http://localhost:5000 in your browser

## Project Structure

```
connectup/
├── frontend/            # React frontend
│   ├── src/             # Frontend source code
│   ├── public/          # Static assets
│   └── dist/            # Production build (generated)
├── backend/             # Node.js backend
│   ├── src/             # Backend source code
│   └── dist/            # Compiled backend (generated)
└── package.json         # Root package.json with scripts
```

## Troubleshooting

- If you encounter TailwindCSS issues, run: `cd frontend && npm install -D tailwindcss postcss autoprefixer`
- If MongoDB connection fails, check your connection string in `backend/.env`
- For port conflicts, modify the port numbers in the respective environment files

## License

MIT