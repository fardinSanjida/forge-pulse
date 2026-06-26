# Forge Pulse

Forge Pulse is a fitness and gym management platform for members, trainers, and administrators. Members can browse approved fitness classes, save favorites, book classes, and join community discussions. Trainers can apply for approval, submit classes, and publish forum posts. Admins review trainer applications and moderate submitted classes.

## Live URL

Add your deployed client URL here.

## Key Features

- Better Auth email/password authentication with Google sign-in support.
- Role-based dashboard routing for users, trainers, and admins.
- Trainer application submission and admin approve/reject workflow.
- Trainer class submission with pending status by default.
- Admin class moderation with approve, reject, and delete actions.
- Public approved classes page with server-side search, category filter, and pagination.
- Private class details actions for bookings and favorite classes backed by MongoDB.
- Payment flow placeholder that persists booking records to the database.
- Community forum listing, post details, voting, comments, replies, and own-comment deletion.
- Global loading state and custom 404 page.

## Main Packages

- Next.js
- React
- Better Auth
- MongoDB
- HeroUI
- React Toastify
- Tailwind CSS
- Gravity UI icons

## Environment Variables

Create `.env` in the client project:

```env
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
MONGO_DB_URI=your_mongodb_uri
AUTH_DB_NAME=forge_pulse_db
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Create `.env` in the server project:

```env
MONGO_DB_URI=your_mongodb_uri
MONGO_DB_NAME=forge_pulse_db
AUTH_DB_NAME=forge_pulse_db
```

## Local Development

Client:

```bash
npm run dev
```

Server:

```bash
npm start
```

## Admin Credentials

Admin Email: `admin@ironpulse.com`

Admin Password: `Password123`
