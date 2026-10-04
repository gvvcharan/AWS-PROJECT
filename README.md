# Spring Boot Microservices Project

This project demonstrates a complete microservices architecture using Spring Boot with:
- **Eureka Server** for service discovery
- **MS1.1** - Authentication Service (Port 8001)
- **MS2.1** - Task Management Service (Port 8002)
- **MS2.2** - Task Management Service Replica (Port 8003)
- **MS-API-GATEWAY** - API Gateway with Load Balancing (Port 8000)

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL Server running locally
- PostgreSQL database named `mydb` and its username/password
- `DB_PASSWORD` and `JWT_SECRET_KEY` environment variables set before starting the services. Use a JWT secret of at least 32 bytes.

## Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE mydb;
```

Set `DB_PASSWORD` to the PostgreSQL password and `JWT_SECRET_KEY` to a private, randomly generated value of at least 32 bytes. For example, in PowerShell:

```powershell
$env:DB_PASSWORD = "your-postgres-password"
$env:JWT_SECRET_KEY = "your-private-random-secret-at-least-32-bytes"
```

Set these variables in each terminal used to start a service, or configure them in your operating system's environment.

The application will automatically create tables via Hibernate `ddl-auto=update`.

## Project Structure

```
MicroservicesProject/
├── MS-EUREKA-SERVER/       # Service Discovery Server
├── MS1.1/                  # Authentication Service
├── MS2.1/                  # Task Management Service
├── MS2.2/                  # Task Management Service (Load Balancing)
├── MS-API-GATEWAY/         # API Gateway with Routes
└── README.md
```

## Running the Services

### 1. Start Eureka Server (Port 8761)
```bash
cd MS-EUREKA-SERVER
mvn spring-boot:run
```

### 2. Start MS1.1 - Authentication Service (Port 8001)
```bash
cd MS1.1
mvn spring-boot:run
```

### 3. Start MS2.1 - Task Service (Port 8002)
```bash
cd MS2.1
mvn spring-boot:run
```

### 4. Start MS2.2 - Task Service (Port 8003)
```bash
cd MS2.2
mvn spring-boot:run
```

### 5. Start MS-API-GATEWAY (Port 8000)
```bash
cd MS-API-GATEWAY
mvn spring-boot:run
```

## Testing the Services

### Access Swagger UI

- **MS1.1 Swagger**: http://localhost:8001/swagger-ui/index.html
- **MS2.1 Swagger**: http://localhost:8002/swagger-ui/index.html

### Service Endpoints

#### 1. Authentication Service (MS1.1)

**Signup**: `POST /ms1/signup`
```json
{
  "username": "balajee",
  "password": "password123",
  "role": 1
}
```

**Signin**: `POST /ms1/signin`
```json
{
  "username": "balajee",
  "password": "password123"
}
```
Response:
```json
{
  "code": 200,
  "jwt": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Addition**: `GET /ms1/add?a=10&b=20`
Response: `MS 1.1 - Additon = 30`

#### 2. Task Management Service (MS2.1 & MS2.2)

**Create Task**: `POST /ms2/createtask`
- Header: `Token: <JWT_TOKEN>`
```json
{
  "title": "title1",
  "description": "description1",
  "assignedto": 2,
  "priority": 1,
  "deadline": "30.07.2026",
  "status": 0
}
```

**Get All Tasks**: `GET /ms2/getalltasks/{PAGE}/{SIZE}`
- Header: `Token: <JWT_TOKEN>`
- Example: `GET /ms2/getalltasks/1/10`

**Get Task**: `GET /ms2/gettask/{ID}`
- Header: `Token: <JWT_TOKEN>`
- Example: `GET /ms2/gettask/1`

**Update Task**: `PUT /ms2/updatetask/{ID}`
- Header: `Token: <JWT_TOKEN>`
- Example: `PUT /ms2/updatetask/1`

**Delete Task**: `DELETE /ms2/deletetask/{ID}`
- Header: `Token: <JWT_TOKEN>`
- Example: `DELETE /ms2/deletetask/1`

**Multiplication**: `GET /ms2/mul?a=10&b=20`
Response: `MS 2.1 - Multiplication = 200`

#### 3. API Gateway Routes

All requests go through the API Gateway on port 8000:

- **Authentication**: `http://localhost:8000/ms1/**` → Routes to MS1.1
- **Task Service**: `http://localhost:8000/ms2/**` → Routes to MS2.1 or MS2.2 (Load Balanced)

### Testing Load Balancing

Use the REST Client Chrome extension or Postman:

**URL**: `POST http://localhost:8000/ms2/createtask`
**Header**: `Token: <JWT_TOKEN>`
**Body**:
```json
{
  "title": "new title",
  "description": "description 1",
  "assignedto": 3,
  "priority": 1,
  "deadline": "10.07.2026",
  "status": 0
}
```

Call this endpoint multiple times to see load balancing in action:
- First call: Routed to MS2.1 → Response: "Task Created Successfully from MS 2.1"
- Second call: Routed to MS2.2 → Response: "Task Created Successfully from MS 2.2"

## Architecture Details

### Eureka Service Registry
- Runs on port 8761
- All services register themselves with Eureka
- Dashboard: http://localhost:8761/

### Load Balancing
- API Gateway uses Eureka's built-in load balancer
- Routes with `lb://MS2` prefix enable load balancing
- Traffic is distributed between MS2.1 and MS2.2

### JWT Token Structure
- Tokens expire after 24 hours (86400000 ms)
- Contains username, role, and user ID
- The signing key is provided through the `JWT_SECRET_KEY` environment variable; do not commit or share its value.
- Validated on each task operation

### Database Schema

**user_tab** (MS1.1):
- id: Integer (Primary Key, Auto-increment)
- username: String (Unique)
- password: String
- role: Integer

**task** (MS2.1 & MS2.2):
- id: Integer (Primary Key, Auto-increment)
- title: String
- description: String
- assignedto: Integer
- priority: Integer
- deadline: String
- status: Integer
- createdby: Integer

## Technology Stack

- **Spring Boot**: 3.2.0
- **Spring Cloud**: 2023.0.0
  - Eureka Server/Client
  - API Gateway
- **Spring Data JPA**: ORM framework
- **PostgreSQL**: Database
- **JWT (JJWT 0.13.0)**: Token generation and validation
- **Springdoc OpenAPI**: Swagger UI documentation

## Common Issues and Solutions

### Connection Refused
- Ensure PostgreSQL is running on localhost:5432
- Check database credentials match the application.properties files

### Eureka Not Registering Services
- Ensure Eureka Server is started before other services
- Check network connectivity between services
- Verify eureka.client.service-url.defaultZone is correct

### JWT Token Invalid
- Ensure token is passed in the `Token` header
- Verify token hasn't expired (24-hour expiration)
- Use a valid token obtained from /ms1/signin

### Load Balancer Not Working
- Ensure both MS2.1 and MS2.2 are running
- Check API Gateway can reach both services
- Verify routes in application.properties use `lb://` prefix

## Stopping Services

Press `Ctrl + C` in each terminal running the services.

## Future Enhancements

- Add request/response logging filters
- Implement circuit breaker pattern
- Add API rate limiting
- Implement distributed tracing with Sleuth
- Add comprehensive API documentation
- Implement caching strategies
- Add authentication with OAuth2
