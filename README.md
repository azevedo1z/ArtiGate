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
/apps
  ├── backend-api     # NestJS backend
  └── frontend         # React frontend

Backend:
- /interface
  - controllers/
  - adapters/
- /application
  - dto/
  - services/
- /domain
  - models/
- /infrastructure
  - repositories/
  - services/

Frontend:
- components/
- pages/
- providers/
- store/
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

<img width="1366" height="3431" alt="image" src="https://github.com/user-attachments/assets/932d435d-f798-404b-9f6b-e81cf30f8b4c" />
<img width="800" height="374" alt="image" src="https://github.com/user-attachments/assets/b0be8c54-1e4d-4aec-bf3e-e663cc4ebb50" />


## 📝 License

MIT

## 🙋 About the Author

Created by [Gabriel Azevedo](https://github.com/azevedo1x/)
Contact: see email in GitHub bio
