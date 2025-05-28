
# TeacherPro - Lesson Management System

A web application for teachers to manage their weekly lesson timetables, featuring real-time notifications and a clean, modern interface.

---

## 🔥 What's Inside

- **Frontend**: Built with React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.
- **Backend**: Developed with Spring Boot, featuring JWT authentication, role-based access control, and a fully documented API.

---

## ⚡ Project Structure

```

teacherpro/
├── frontend/     # React app
├── backend/      # Spring Boot API
└── README.md     # Project overview (this file)

````

---

## 🚀 Getting Started

### Clone the project
```bash
git clone https://github.com/your-repo/teacherpro.git
cd teacherpro
````

---
### ✉️ Email Setup (Gmail)
The backend uses Gmail SMTP to send real-time notifications. You need to enable it:

Generate App Password:

Go to your Google Account

Go to Security > 2-Step Verification (turn it on)

Go to App Passwords

Select Mail and your device, then generate a password

Copy the generated password

Replace in application.yml:

yaml
Copy code
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-generated-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
## Heads up: Don’t push your real credentials to GitHub. Add them in your local application.yml

### Run the Backend

```bash
cd backend
# Update application.properties with your DB credentials
mvn clean install
mvn spring-boot:run
```

* Backend will be live at: [http://localhost:8080](http://localhost:8080)
* Swagger docs: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

### Run the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

* Frontend will be live at: [http://localhost:8081](http://localhost:8081)

---

## 🌍 Deployment

* **Frontend**: Deploy to Vercel, Netlify, or any static hosting.
* **Backend**: Deploy to your favorite cloud platform or VPS.

---

## 🤝 Contributing

* Fork this repo
* Create a new branch (`git checkout -b feature/amazing-feature`)
* Commit and push your changes
* Open a Pull Request

---

## 📜 License

MIT License

---

## 📬 Support

For help, create an issue in the repo or hit up the team.

```
