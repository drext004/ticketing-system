# Ticketing System Backend

A backend system for an online ticketing and seat reservation application. Built with Node.js, Express, TypeScript, Prisma, and SQLite, featuring JWT authentication and real-time capabilities via Socket.io.

## Features

- **User Authentication**: Secure user registration and login using JWT and bcrypt.
- **Show Management**: Admin endpoints for creating, listing, and deleting shows.
- **Seat Booking Flow**:
  - View available seats map for a specific show.
  - Reserve/lock seats temporarily (prevents double-booking).
  - Confirm payment and finalize booking.
  - Release unbooked/timed-out seats.
- **Real-time Updates**: Configured with Socket.io for broadcasting seat availability (CORS enabled for frontend at `http://localhost:5173`).

## Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [SQLite](https://sqlite.org/) (for development)
- **Authentication**: JWT & bcrypt

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory. You can use `.env.example` as a template:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"
```

### 3. Database Setup

Run Prisma migrations to initialize the SQLite database:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 4. Running the Application

**Development Mode (nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

The server will start running on `http://localhost:3000`.

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication
- `POST /api/register`: Register a new user
- `POST /api/login`: User login, returns a JWT token

### Shows
- `GET /api/shows`: Get a list of all available shows
- `POST /api/admin/shows`: (Admin) Create a new show
- `DELETE /api/admin/shows/:showId`: (Admin) Delete a show

### Booking (Requires JWT Bearer Token)
- `GET /api/getSeats/shows/:showId/seats`: Get the seat map and status for a specific show
- `POST /api/chooseShow`: Temporarily reserve/lock a seat
- `POST /api/payment`: Mock payment confirmation step
- `POST /api/booking`: Finalize the seat booking
- `POST /api/releaseSeat`: Release a previously locked seat
