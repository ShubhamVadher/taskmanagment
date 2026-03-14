# TaskFlow — Task Management System

A full-stack task management web application with user authentication, role-based access control, real-time task collaboration, and a dedicated admin panel.

\---

## 📽️ Demo

<!-- Paste your demo video link below -->

> 🎥 \*\*Video Demo:\*\* https://drive.google.com/file/d/1FMcclWmeKqhMENLOs4vja4NXjgA4Xihk/view?usp=drive\_link

\---

## 🚀 Tech Stack

### Frontend

* **React.js** — UI framework
* **React Router DOM** — client-side routing
* **Auth0** — user authentication
* **Axios** — HTTP requests
* **CSS** — custom styling (no UI library)

### Backend

* **Node.js + Express.js** — REST API server
* **MongoDB + Mongoose** — database \& ODM
* **JWT (jsonwebtoken)** — token-based auth
* **bcrypt** — password hashing
* **cookie-parser** — cookie handling
* **nodemailer** — email notifications on task assignment
* **dotenv** — environment variable management
* **cors** — cross-origin resource sharing

\---

## 📁 Project Structure

```
taskmanagment/
├── back/                       # Backend (Express)
│   ├── config/
│   │   └── connection.js       # MongoDB connection
│   ├── jwt/
│   │   ├── gentoken.js         # User JWT generator
│   │   └── adminjwt.js         # Admin JWT generator
│   ├── middleware/
│   │   ├── isloggedin.js       # User auth middleware
│   │   └── isAdmin.js          # Admin auth middleware
│   ├── mailing/
│   │   └── mail.js             # Email notification service
│   ├── models/
│   │   ├── user.js             # User schema
│   │   └── task.js             # Task schema
│   ├── server.js               # Main Express server
│   └── .env                    # Environment variables
│
└── front/                      # Frontend (React)
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── AdminNavbar.js
        │   ├── Home.js
        │   ├── Createtask.js
        │   ├── Viewtasks.js
        │   ├── Admin.js            # Admin login
        │   ├── Adminpage.js        # Admin dashboard
        │   ├── Adminuseres.js      # All users list
        │   ├── AdminUserDetail.js  # Single user detail
        │   ├── Admintasks.js       # All tasks list
        │   ├── AdminTaskDetail.js  # Single task detail
        │   └── Protectedroute.js   # Route guards
        └── App.js
```

\---

## ⚙️ Features

### 👤 User

* Login via **Auth0** (OAuth)
* Create tasks and assign members by email
* Email notification sent to all members on task creation
* View all tasks assigned to or created by you
* Post updates on tasks
* Mark tasks as complete (only task creator)

### 🔐 Admin

* Separate admin login with credentials stored in `.env`
* JWT-based admin session via secure cookie
* **Admin Dashboard** with:

  * View all tasks — filter by status (pending/completed), task name, creator email
  * View all users — search by email, paginated (10 per page)
  * User detail page — full info, all tasks (with owner/member role), remove user
  * Task detail page — all members, all updates, delete task
  * Removing a user deletes all their owned tasks and removes them from all member groups
  * Deleting a task removes it from all members' task lists
\---

## 🔒 API Endpoints

### User Auth \& Tasks

|Method|Endpoint|Auth|Description|
|-|-|-|-|
|POST|`/signin`|❌|Register or login user|
|GET|`/logout`|✅ User|Logout, clear cookie|
|POST|`/createtask`|✅ User|Create a task|
|GET|`/gettasks`|✅ User|Get all tasks for logged-in user|
|POST|`/updatetask/:id`|✅ User|Post an update on a task|
|GET|`/complete/:id`|✅ User|Mark task as complete (creator only)|

### Admin

|Method|Endpoint|Auth|Description|
|-|-|-|-|
|GET|`/adminloggin`|❌|Admin login, sets cookie|
|GET|`/adminlogout`|✅ Admin|Admin logout, clears cookie|
|GET|`/admin/users`|✅ Admin|Get all users|
|GET|`/admin/user`|✅ Admin|Search user by email (`?email=`)|
|GET|`/admin/user/:id`|✅ Admin|Get single user with tasks|
|DELETE|`/admin/user/:id`|✅ Admin|Delete user + their tasks|
|GET|`/admin/tasks`|✅ Admin|Get all tasks (supports filters)|
|GET|`/admin/task/:id`|✅ Admin|Get single task details|
|DELETE|`/admin/task/:id`|✅ Admin|Delete task|

\---

## 🛠️ Setup \& Installation

### Prerequisites

* Node.js >= 16
* MongoDB (local or Atlas)
* Auth0 account

\---

### 1\. Clone the repo

```bash
git clone https://github.com/ShubhamVadher/taskmanagment.git
cd taskmanagment
```

\---

### 2\. Backend Setup

```bash
cd back
npm install
```

Create a `.env` file in the `back/` folder:

```env
key=your\_jwt\_secret\_key
password=your\_email\_password
emailid=your\_email@gmail.com
connectionString=mongodb://localhost:27017/task
PORT=5000
ADMINKEY=your\_admin\_jwt\_secret
```

Start the backend:

```bash
npm start
# or with nodemon:
npx nodemon server.js
```

\---

### 3\. Frontend Setup

```bash
cd ../front
npm install
```

Create a `.env` file in the `front/` folder:

```env
REACT\_APP\_DOMAIN=your\_auth0\_domain
REACT\_APP\_CLINETID=your\_auth0\_client\_id
REACT\_APP\_ADMIN\_ID=20233568
REACT\_APP\_ADMIN\_PASSWORD=shubham12345
```

Start the frontend:

```bash
npm start
```

App runs at `http://localhost:3000`

\---

## 🌐 Routes

|Path|Access|Description|
|-|-|-|
|`/`|Public|Home page|
|`/createtask`|Auth0 user|Create a new task|
|`/viewtasks`|Auth0 user|View your tasks|
|`/admin`|Public|Admin login page|
|`/adminpage`|Admin|Admin dashboard|
|`/admintasks`|Admin|All tasks|
|`/admintasks/:id`|Admin|Task detail|
|`/adminusers`|Admin|All users|
|`/adminusers/:id`|Admin|User detail|

\---

## 📬 Email Notifications

When a task is created, every assigned member (including the creator) receives an email notification. Configure Gmail credentials in `.env` using an [App Password](https://support.google.com/accounts/answer/185833).

\---

