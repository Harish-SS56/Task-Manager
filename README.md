 📝 Task Manager App

A full-stack MERN application that allows users to register, log in, and manage their personal tasks with full CRUD functionality. This project was built as part of a Software Engineer Intern assignment to demonstrate proficiency in the MERN stack and deploy a working solution.

🌐 Live URL

 App: [https://task-manager-vhfw.onrender.com](https://task-manager-vhfw.onrender.com)

🎯 Features

🔐 Authentication

* User registration and login using email/password
* JWT-based authentication
* Password hashing using bcrypt
* Protected dashboard route

📋 Task Management

* View all tasks belonging to the logged-in user
* Add a new task with a title and description
* Edit task content and toggle completion status
* Delete tasks
* All operations are persisted in MongoDB

🖥️ Frontend (React + TailwindCSS)

* Clean, responsive UI with TailwindCSS
* Landing Page with navigation to the dashboard
* Register and Login forms with validation
* Dashboard with task list and action controls
* State management via React Context
* React Router for navigation

⚙️ Backend (Node.js + Express)

* REST API with routes:

  * POST /register — Register user
  * POST /login — Authenticate and return JWT
  * GET /tasks — Retrieve user's tasks
  * POST /tasks — Create a new task
  * PUT /tasks/\:id — Update an existing task
  * DELETE /tasks/\:id — Remove a task
* Secure middleware to protect routes using JWT
* MongoDB schema for users and tasks

🧰 Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | React, TailwindCSS, Axios     |
| Routing    | React Router DOM              |
| Backend    | Node.js, Express              |
| Auth       | JSON Web Tokens (JWT), bcrypt |
| Database   | MongoDB Atlas, Mongoose       |
| Deployment | Render (Frontend + Backend)   |

🛠️ Getting Started

Clone the repository:

```bash
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app
```

Install dependencies:

```bash
# Install root dependencies (if monorepo)
npm install

# OR separately in frontend and backend
cd client && npm install
cd ../server && npm install
```

Create environment files:

Backend (.env):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Frontend (.env):

```env
VITE_API_URL=https://task-manager-vhfw.onrender.com
```

Run the app locally:

Frontend:

```bash
cd client
npm run dev
```

Backend:

```bash
cd server
npm run dev
```

🗂️ Project Structure

task-manager-app/
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│
├── server/                  # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
└── README.md

🖼️ Screenshots

Include screenshots here for:

![image](https://github.com/user-attachments/assets/6c5f1dc3-297f-44ed-b634-6818ade1ab2b)

![image](https://github.com/user-attachments/assets/0f50e4fe-ba79-4adb-969a-e794c5a6ce69)

![image](https://github.com/user-attachments/assets/ec04ac4a-992d-4d06-ad65-16a39069e207)

![image](https://github.com/user-attachments/assets/d4a2b722-b16c-44bc-b05b-c98f98c1fc77)


📤 Submission

✅ GitHub repository with full source code
✅ Live deployed version: [https://task-manager-vhfw.onrender.com](https://task-manager-vhfw.onrender.com)
✅ This README with setup instructions, technologies, and screenshots

📬 Contact

* GitHub: [https://github.com/your-username](https://github.com/Harish-SS56)
* LinkedIn: [https://linkedin.com/in/your-name](https://www.linkedin.com/in/harish-s-s-a17a1729b)


