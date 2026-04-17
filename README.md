# ArtiGate

ArtiGate is a web application designed to streamline the process of managing academic conferences. It allows participants to register, log in, submit articles, and perform peer reviews, all in one place.

## Motivation

ArtiGate was born out of a professor's frustration with the lack of a centralized, efficient system to handle participant registration, article submission, and peer review. This project addresses that gap, aiming to simplify conference workflows for academics and researchers.

## Tech Stack

* **Frontend**: React 18, Redux Toolkit, React Router, Tailwind CSS, Vite
* **Backend**: NestJS (Clean Architecture)
* **Database**: SQLServer (via Prisma ORM)
* **Monorepo**: Nx

## Features

* **User registration and authentication** (JWT-based)
* **Article submission** with summary and author association
* **Peer review system** with score (1-10) and commentary
* **Automatic score averaging** on article after each review
* **Business rules**: prevents self-review and duplicate reviews per reviewer
* **Soft-delete** across all entities
* **Role-based access**: reviewer-only pages and actions
* **My Articles** page with expandable review details per article
* **My Reviews** page for reviewers to track submitted reviews

## Project Structure

```
/backend-api              # NestJS backend API
  └── src/app/
      ├── application/       # Use cases: services + DTOs
      ├── config/            # App configuration
      ├── domain/            # Business entities and repository interfaces
      ├── infrastructure/    # Prisma repositories
      ├── interface/         # Controllers and abstract adapters
      ├── modules/           # NestJS feature modules
      └── shared/            # Filters, pipes, guards, utilities

/frontend                 # React frontend
  └── src/
      ├── app/               # Root app component and routing
      ├── components/        # Reusable UI components
      ├── config/            # Frontend configuration
      ├── pages/             # Route-level page components
      ├── services/          # API client services
      ├── store/slices/      # Redux state (user, roles)
      ├── providers/         # Context providers (toast)
      ├── shared/types/      # Shared TypeScript types
      └── utils/             # Utility functions

/prisma                   # Database schema and migrations
```

## Pages and Routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/signup` | Sign Up | Public |
| `/about` | About | Public |
| `/home` | Home (dashboard) | Authenticated |
| `/submit-article` | Submit Article | Authenticated |
| `/my-articles` | My Articles | Authenticated |
| `/submit-review` | Submit Review | Authenticated + Reviewer |
| `/my-reviews` | My Reviews | Authenticated + Reviewer |

## API Modules

| Module | Endpoints |
|---|---|
| User | CRUD, find by email/address/review |
| Role | CRUD, find by name |
| Address | CRUD |
| Article | CRUD, find by author |
| Review | CRUD, find by reviewer, find by article |

## Screenshots

### Landing Page
![Landing Page](docs/screenshots/1.png)

### Login
![Login](docs/screenshots/2.png)

### Dashboard
![Dashboard](docs/screenshots/3.png)

### Submit Article
![Submit Article](docs/screenshots/4.png)

### Submit Review
![Submit Review](docs/screenshots/5.png)

### About
![About](docs/screenshots/6.png)

## Getting Started

### Prerequisites

* Node.js (v18+)
* npm
* SQL Server

### Installation

```bash
npm install
```

Copy `.env.example` to `.env` and configure your database connection and JWT secret.

### Running

```bash
# Frontend (http://localhost:3001)
npx nx serve frontend

# Backend (http://localhost:3000)
npx nx serve backend-api
```

### Testing and Linting

```bash
npx nx test backend-api     # Unit tests
npx nx test backend-api-e2e # E2E tests
npx nx lint                  # Lint all projects
```

## Database

Migrations are managed via Prisma. Models: User, Role, UserRole, Address, Article, ArticleAuthor, Review, Payment.

```bash
npx prisma migrate dev    # Apply migrations
npx prisma studio         # Visual database browser
```

## Contributing

Want to help? Feel free to open an issue or submit a pull request.

## License

MIT

## About the Author

Created by [Gabriel Azevedo](https://github.com/azevedo1x/)
Contact: see email in GitHub bio
