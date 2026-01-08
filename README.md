# ArtiGate

ArtiGate is a web application designed to streamline the process of managing academic conferences. It allows participants to register, log in, submit articles, and perform peer reviews, all in one place.

## 🧠 Motivation

ArtiGate was born out of a professor's frustration with the lack of a centralized, efficient system to handle participant registration, article submission, and peer review. This project addresses that gap, aiming to simplify conference workflows for academics and researchers.

## ⚙️ Tech Stack

* **Frontend**: React
* **Backend**: NestJS (with Clean Architecture)
* **Database**: PostgreSQL
* **Monorepo**: Nx

## 📦 Project Structure

```
/backend-api              # NestJS backend API
  └── src/
      ├── main.ts
      └── app/
          ├── app.module.ts
          ├── application/     # Application layer (Use Cases)
          │   ├── dtos/
          │   └── services/
          ├── config/          # Configuration files
          │   ├── config.validation.ts
          │   └── configuration.ts
          ├── domain/          # Domain layer (Business logic)
          │   └── models/
          ├── infrastructure/  # Infrastructure layer (External services)
          │   ├── repositories/
          │   └── services/
          ├── interface/       # Interface layer (Controllers & adapters)
          │   └── adapter/
          ├── modules/
          └── shared/

/frontend                 # React frontend application
  └── src/
      ├── main.tsx
      ├── styles.css
      └── app/
          ├── app.tsx
          ├── components/  # Reusable UI components
          ├── config/      # Frontend configuration
          ├── pages/       # Page components
          ├── providers/   # Context providers
          ├── services/    # API services
          ├── shared/
          │   └── types/
          ├── store/       # State management
          │   └── slices/
          └── utils/       # Helper functions

/prisma                   # Database schema and migrations
  ├── schema.prisma
  └── migrations/

/docs                     # Documentation
```

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm
* PostgreSQL (local or cloud)

### Installation

```bash
npm install
```

### Running the project

* Start the frontend:

```bash
npx nx serve frontend
```

* Start the backend API:

```bash
npx nx serve backend-api
```

## 🤝 Contributing

Want to help? Feel free to open an issue or submit a pull request.

## 📷 Screenshots / Demo

<img width="1366" height="3431" alt="image" src="https://github.com/user-attachments/assets/6fecda52-4e9e-4cce-87a7-7c1f9d49ed34" />

<img width="1347" height="628" alt="image" src="https://github.com/user-attachments/assets/577e8fe2-c9cb-400d-b72b-b0bec1dbb33c" />

## 📝 License

MIT

## 🙋 About the Author

Created by [Gabriel Azevedo](https://github.com/azevedo1x/)
Contact: see email in GitHub bio
