# LSA Measurement Game 

A high-performance, full-stack educational gaming application built with the MVC (Model-View-Controller)architecture. This project helps students master the concept of Lateral Surface Area (LSA) through an interactive drag-and-drop visual engine.

## 🚀 Key Features

* **MVC Architecture**: Organized codebase with clear separation between business logic, data models, and routing.

* **Secure Authentication**: Implemented JWT-based user sessions with `bcryptjs` for robust password hashing.
* **Anti-Cheat Verification**: Real-time server-side calculation check ($2 \times h \times (l + w)$) to ensure data integrity.
* **Global Error Handling**: Centralized middleware to manage application-wide errors and provide consistent API responses.
* **Interactive Audio Feedback**: Integrated sound effects for immediate user feedback on correct and incorrect actions.
* **Relational Database**: Structured MySQL schema with Foreign Key constraints linking users to their scores.

## 🛠️ Tech Stack

* **Backend**  : Node.js, Express.js (v5.2.1)
* **Database** : MySQL (using `mysql2` for optimized pooling)
* **Validation**: `Zod` for schema-based request validation.
* **Security**: `express-rate-limit` for DDoS protection & JWT for secure APIs.
* **Frontend**: Vanilla JavaScript with CSS3 Flexbox/Grid for a modern dark-themed UI.

## 📁 Project Structure

LSA/
├── src/
│   ├── config/      # Database configuration
│   ├── controllers/ # Request handling logic
│   ├── middlewares/ # Auth & Global Error handlers
│   ├── models/      # SQL queries & Data schemas
│   └── routes/      # API endpoint definitions
├── public/          # Frontend assets (HTML, CSS, JS, Sounds)
└── server.js        # Application entry point