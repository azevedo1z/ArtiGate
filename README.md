# ArtiGate

ArtiGate is a web application designed to streamline the process of managing academic conferences. It allows participants to register, log in, submit articles, and perform peer reviews—all in one place.

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

![image](https://github.com/user-attachments/assets/64b47563-d2a0-446c-9195-4865d61bce75)
![image](https://github.com/user-attachments/assets/ffc1b78e-0288-4775-a522-507be6880c4e)


## 📝 License

MIT

## 🙋 About the Author

Created by [Gabriel Azevedo](https://github.com/azevedo1x/)
Contact: see email in GitHub bio
