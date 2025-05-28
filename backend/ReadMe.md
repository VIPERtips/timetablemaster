# 🏫 Timetable API

A backend system for managing lessons, teacher profiles, and authentication using Spring Boot.

---

## 📦 Features

- User authentication (register, login, refresh token)
- CRUD operations for lessons (create, update, delete, list)
- Teacher profile management
- Role-based access control (TEACHER role by default on registration)
- JWT-based security
- Swagger/OpenAPI documentation for easy testing

---

## 🚀 Getting Started

### Requirements

- Java 17 or higher
- Maven 3.8+
- MySQL (or H2 for testing)

---

### Running Locally

1. Clone the repo:

    ```bash
    git clone https://github.com/your-repo/vipertips-timetable.git
    cd vipertips-timetable
    ```

2. Update `application.properties` to point to your database:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/your_db
    spring.datasource.username=root
    spring.datasource.password=password
    ```

3. Build the project:

    ```bash
    mvn clean install
    ```

4. Run the app:

    ```bash
    mvn spring-boot:run
    ```

5. Access the Swagger API documentation at:

    ```
    http://localhost:8080/swagger-ui/index.html
    ```

---

## 🔑 API Endpoints

### Authentication

- **Register:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **Refresh Token:** `POST /api/auth/refresh-token?refreshToken={token}`

### Teacher

- **Get My Profile:** `GET /api/teacher`
- **Update My Profile:** `POST /api/teacher`

### Lessons

- **Create Lesson:** `POST /api/lesson`
- **Update Lesson:** `PUT /api/lesson/{lessonId}`
- **Delete Lesson:** `DELETE /api/lesson/{lessonId}`
- **Get Lessons (Paginated):** `GET /api/lesson/teacher?page=0&size=10`

---

## 📝 Notes

- On registration, users are assigned the `TEACHER` role by default.
- Use the `Authorization: Bearer <token>` header for all protected endpoints.
- Lesson operations are tied to the logged-in teacher.
- Swagger UI makes it easier to test everything.

---

## 👀 Example Request for Creating a Lesson

```http
POST /api/lesson
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "title": "Math Class",
  "description": "Algebra basics",
  "startTime": "2025-06-01T10:00:00",
  "endTime": "2025-06-01T11:00:00"
}
