# API Testing Reference

## Prerequisites
- All services running
- JWT token obtained from signin endpoint

## 1. Authentication Service (MS1.1)

### Signup
```bash
curl -X POST http://localhost:8001/ms1/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"balajee","password":"password123"}'
```

### Signin
```bash
curl -X POST http://localhost:8001/ms1/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"balajee","password":"password123"}'
```

### Addition
```bash
curl -X GET "http://localhost:8001/ms1/add?a=10&b=20"
```

## 2. Task Service via Direct Port (MS2.1 on 8002)

### Create Task
```bash
curl -X POST http://localhost:8002/ms2/createtask \
  -H "Content-Type: application/json" \
  -H "Token: <JWT_TOKEN>" \
  -d '{
    "title":"Task 1",
    "description":"Description 1",
    "assignedto":1,
    "priority":1,
    "deadline":"2026-12-31",
    "status":0
  }'
```

### Get All Tasks
```bash
curl -X GET "http://localhost:8002/ms2/getalltasks/1/10" \
  -H "Token: <JWT_TOKEN>"
```

### Get Specific Task
```bash
curl -X GET "http://localhost:8002/ms2/gettask/1" \
  -H "Token: <JWT_TOKEN>"
```

### Update Task
```bash
curl -X PUT http://localhost:8002/ms2/updatetask/1 \
  -H "Content-Type: application/json" \
  -H "Token: <JWT_TOKEN>" \
  -d '{
    "title":"Updated Title",
    "description":"Updated Description",
    "assignedto":2,
    "priority":2,
    "deadline":"2026-12-31",
    "status":1
  }'
```

### Delete Task
```bash
curl -X DELETE "http://localhost:8002/ms2/deletetask/1" \
  -H "Token: <JWT_TOKEN>"
```

### Multiplication
```bash
curl -X GET "http://localhost:8002/ms2/mul?a=10&b=20"
```

## 3. Task Service via API Gateway (Load Balanced - 8000)

All requests go through the gateway and are load balanced between MS2.1 and MS2.2:

### Create Task (Through Gateway)
```bash
curl -X POST http://localhost:8000/ms2/createtask \
  -H "Content-Type: application/json" \
  -H "Token: <JWT_TOKEN>" \
  -d '{
    "title":"Gateway Task",
    "description":"Created via gateway",
    "assignedto":1,
    "priority":1,
    "deadline":"2026-12-31",
    "status":0
  }'
```

Run this multiple times to see load balancing:
- Odd requests: MS 2.1
- Even requests: MS 2.2

### Get All Tasks (Through Gateway)
```bash
curl -X GET "http://localhost:8000/ms2/getalltasks/1/10" \
  -H "Token: <JWT_TOKEN>"
```

### Get Specific Task (Through Gateway)
```bash
curl -X GET "http://localhost:8000/ms2/gettask/1" \
  -H "Token: <JWT_TOKEN>"
```

### Update Task (Through Gateway)
```bash
curl -X PUT http://localhost:8000/ms2/updatetask/1 \
  -H "Content-Type: application/json" \
  -H "Token: <JWT_TOKEN>" \
  -d '{
    "title":"Updated via Gateway",
    "description":"Modified",
    "assignedto":2,
    "priority":2,
    "deadline":"2026-12-31",
    "status":1
  }'
```

### Delete Task (Through Gateway)
```bash
curl -X DELETE "http://localhost:8000/ms2/deletetask/1" \
  -H "Token: <JWT_TOKEN>"
```

## 4. Testing Load Balancing

The API Gateway distributes requests between MS2.1 (8002) and MS2.2 (8003):

```bash
# Run this multiple times to see alternating responses
for i in {1..5}; do
  echo "Request $i:"
  curl -X POST http://localhost:8000/ms2/createtask \
    -H "Content-Type: application/json" \
    -H "Token: <JWT_TOKEN>" \
    -d '{"title":"Task","description":"Test","assignedto":1,"priority":1,"deadline":"2026-12-31","status":0}' \
    2>/dev/null | grep -o "MS 2\.[12]"
  echo ""
  sleep 1
done
```

## 5. Eureka Service Registry

### View All Registered Services
```bash
curl -X GET http://localhost:8761/eureka/apps
```

### View Specific Service
```bash
curl -X GET http://localhost:8761/eureka/apps/MS1
curl -X GET http://localhost:8761/eureka/apps/MS2
curl -X GET http://localhost:8761/eureka/apps/MS-API-GATEWAY
```

## Notes

- Replace `<JWT_TOKEN>` with actual token from signin response
- Port 8000: API Gateway
- Port 8001: MS1 (Auth)
- Port 8002: MS2.1 (Task)
- Port 8003: MS2.2 (Task)
- Port 8761: Eureka Registry
