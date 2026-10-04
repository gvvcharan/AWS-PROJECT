# Quick Start Guide

## Step 1: Database Setup

Open PostgreSQL and run:

```sql
CREATE DATABASE mydb;
```

Before starting the services, set `DB_PASSWORD` to your PostgreSQL password and `JWT_SECRET_KEY` to a private random string of at least 32 bytes. In PowerShell, run these in each service terminal:

```powershell
$env:DB_PASSWORD = "your-postgres-password"
$env:JWT_SECRET_KEY = "your-private-random-secret-at-least-32-bytes"
```

Do not commit real values for these variables.

## Step 2: Clone/Extract the Project

Navigate to the project root directory in your terminal.

## Step 3: Run Services in Separate Terminals

Open 5 terminal windows and run each command in sequence:

### Terminal 1 - Eureka Server
```bash
cd MS-EUREKA-SERVER
mvn clean install
mvn spring-boot:run
```
Wait until you see: "Started MsEurekaServerApplication"

### Terminal 2 - MS1.1 (Auth Service)
```bash
cd MS1.1
mvn clean install
mvn spring-boot:run
```

### Terminal 3 - MS2.1 (Task Service)
```bash
cd MS2.1
mvn clean install
mvn spring-boot:run
```

### Terminal 4 - MS2.2 (Task Service Replica)
```bash
cd MS2.2
mvn clean install
mvn spring-boot:run
```

### Terminal 5 - API Gateway
```bash
cd MS-API-GATEWAY
mvn clean install
mvn spring-boot:run
```

## Step 4: Verify All Services

Check Eureka Dashboard: http://localhost:8761/

You should see:
- MS1 (running on port 8001)
- MS2 (running on ports 8002 and 8003 - appears as 1 service with 2 instances)
- MS-API-GATEWAY (running on port 8000)

## Step 5: Test Authentication Flow

1. **Signup a User**
   - Open Postman or browser
   - POST: http://localhost:8001/ms1/signup
   - Headers: Content-Type: application/json
   - Body:
     ```json
     {
       "username": "balajee",
       "password": "password123"
     }
     ```
   - Response: `{"code": 200, "message": "User Registerd Successfully"}`

2. **Login to Get JWT Token**
   - POST: http://localhost:8001/ms1/signin
   - Body:
     ```json
     {
       "username": "balajee",
       "password": "password123"
     }
     ```
   - Response: `{"code": 200, "jwt": "eyJhbGciOiJIUzI1NiJ9..."}`
   - **Copy the JWT token for next steps**

3. **Test Add Endpoint**
   - GET: http://localhost:8001/ms1/add?a=10&b=20
   - Response: `MS 1.1 - Additon = 30`

## Step 6: Test Task Management with Load Balancing

1. **Create Task (MS2.1)**
   - POST: http://localhost:8000/ms2/createtask
   - Headers:
     - Content-Type: application/json
     - Token: <paste_your_jwt_token>
   - Body:
     ```json
     {
       "title": "Task 1",
       "description": "First task",
       "assignedto": 1,
       "priority": 1,
       "deadline": "2026-12-31",
       "status": 0
     }
     ```
   - Response: `{"code": 200, "message": "Task Created Successfully from MS 2.1"}`

2. **Create Task Again (MS2.2 - Load Balanced)**
   - Repeat same POST request
   - Response: `{"code": 200, "message": "Task Created Successfully from MS 2.2"}`
   - This shows load balancing is working!

3. **Get All Tasks**
   - GET: http://localhost:8000/ms2/getalltasks/1/10
   - Headers: Token: <jwt_token>
   - Response shows paginated task list

4. **Get Specific Task**
   - GET: http://localhost:8000/ms2/gettask/1
   - Headers: Token: <jwt_token>

5. **Update Task**
   - PUT: http://localhost:8000/ms2/updatetask/1
   - Headers: Token: <jwt_token>, Content-Type: application/json
   - Body: (modified task JSON)

6. **Delete Task**
   - DELETE: http://localhost:8000/ms2/deletetask/1
   - Headers: Token: <jwt_token>

## Step 7: Test Multiplication Endpoint

- GET: http://localhost:8000/ms2/mul?a=5&b=6
- Response: `MS 2.1 - Multiplication = 30`

## Troubleshooting

**Services not starting?**
- Ensure Java 17+ is installed: `java -version`
- Ensure Maven is installed: `mvn -version`
- Check PostgreSQL is running: `psql -U postgres`

**Cannot connect to database?**
- Verify `DB_PASSWORD` is set in the terminal running the service and matches your PostgreSQL password.
  - Database: mydb
- Ensure PostgreSQL service is running

**JWT Token Error?**
- Copy the full token from signin response
- Include it in the `Token` header exactly as provided
- Ensure token hasn't expired (24 hours)

**Load Balancing Not Working?**
- Ensure both MS2.1 and MS2.2 are running
- Check console logs for Eureka registration
- Restart API Gateway if services started after it

## Console Tips

Each service logs its startup:
- "Started Ms1Application in X seconds"
- "Started Ms2Application in X seconds"
- "Registered instance with Eureka"

Check the Eureka dashboard (http://localhost:8761/) for real-time service status.
