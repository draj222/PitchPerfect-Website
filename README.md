# ConnectUp

A modern web application for connecting startup founders with potential cofounders and founding engineers.

## Overview

ConnectUp is a matchmaking platform that uses AI to intelligently pair startup founders looking to fill key roles with skilled individuals looking to join impactful startups.

## Key Features

- User Authentication & Profile Management
- Posting and Viewing Roles
- AI-Driven Matching Engine
- Integrated Communication Platform
- Analytics Dashboard

## Tech Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express.js and TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API for intelligent matching
- **Deployment**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (optional - app can run without DB)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/connectup.git
   cd connectup
   ```

2. Install dependencies:
   ```
   # Install all dependencies at once
   npm run install:all
   
   # Or install separately:
   # Backend dependencies
   cd backend-new
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Backend environment variables are in `backend-new/.env`
   - Key settings to update:
     - `JWT_SECRET` for security
     - `MONGODB_URI` if using a different MongoDB instance
     - `OPENAI_API_KEY` for matching functionality

4. Start the development servers:
   ```
   # Start both backend and frontend at once
   npm run dev
   
   # Or start separately:
   # Start backend server
   npm run dev:backend

   # Start frontend server
   npm run dev:frontend
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - API Health Check: http://localhost:5001/health

## Project Structure

- `/frontend` - React application with TypeScript
- `/backend-new` - Express.js API with TypeScript
- `/docker-compose.yml` - Container orchestration for deployment

## Troubleshooting

- **MongoDB Connection**: If you see MongoDB connection errors, ensure MongoDB is running on your local machine or update the connection URI in `.env`.
- **Port Conflicts**: If ports 5001 or 5173 are in use, you can change them in the respective configuration files.

## License

MIT