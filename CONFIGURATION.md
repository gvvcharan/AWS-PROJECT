# Configuration Reference

## Database Configuration

### PostgreSQL Connection Details
```properties
# Database URL
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb

# Credentials (provided through environment variables)
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

# PostgreSQL Driver
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate Dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# DDL Auto (create/update tables automatically)
spring.jpa.hibernate.ddl-auto=update

# Show SQL (debug mode)
spring.jpa.show-sql=true
```

## Eureka Configuration

### Server (MS-EUREKA-SERVER)
```properties
spring.application.name=MS-EUREKA-SERVER
server.port=8761

# Don't register server with itself
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

### Clients (MS1.1, MS2.1, MS2.2, MS-API-GATEWAY)
```properties
# Register with Eureka
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true

# Eureka Server URL
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# Prefer IP address (optional)
eureka.instance.prefer-ip-address=true
```

## JWT Configuration

### JWTService Settings
```java
// Secret key is injected from jwt.secret; configure JWT_SECRET_KEY.
// Use a private random value of at least 32 bytes.

// Token Expiration (24 hours)
long expirationTime = 86400000; // ms

// Algorithm: HS256 (HMAC SHA256)

// Token Claims
- "un" : username
- "role" : user role
- "id" : user ID
- "iat" : issued at time
- "exp" : expiration time
```

## API Gateway Routes

### Route Configuration (MS-API-GATEWAY)
```properties
# Route 1: Addition Service
spring.cloud.gateway.routes[0].id=MS1
spring.cloud.gateway.routes[0].uri=lb://MS1
spring.cloud.gateway.routes[0].predicates[0]=Path=/ms1/**

# Route 2: Multiplication Service (Load Balanced)
spring.cloud.gateway.routes[1].id=MS2
spring.cloud.gateway.routes[1].uri=lb://MS2
spring.cloud.gateway.routes[1].predicates[0]=Path=/ms2/**
```

**Note**: `lb://` prefix enables load balancing through Eureka

## Service Registry Names

These names must match the `spring.application.name` property:

| Service | Registry Name | Port(s) |
|---------|---------------|---------|
| Authentication | MS1 | 8001 |
| Task Management | MS2 | 8002, 8003 |
| API Gateway | MS-API-GATEWAY | 8000 |
| Eureka Server | N/A | 8761 |

## Dependencies Versions

### Spring Framework Versions
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<spring-cloud.version>2023.0.0</spring-cloud.version>
```

### Key Dependencies
```xml
<!-- Eureka Server -->
spring-cloud-starter-netflix-eureka-server

<!-- Eureka Client -->
spring-cloud-starter-netflix-eureka-client

<!-- API Gateway -->
spring-cloud-starter-gateway

<!-- Web Support -->
spring-boot-starter-web
spring-boot-starter-webflux

<!-- Database -->
spring-boot-starter-data-jpa
org.postgresql:postgresql:42.6.0

<!-- JWT -->
io.jsonwebtoken:jjwt-api:0.13.0
io.jsonwebtoken:jjwt-impl:0.13.0
io.jsonwebtoken:jjwt-jackson:0.13.0

<!-- Documentation -->
org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2
```

## Database Schema

### user_tab (MS1.1)
```sql
CREATE TABLE user_tab (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INTEGER
);
```

### task (MS2.1 & MS2.2)
```sql
CREATE TABLE task (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    assignedto INTEGER,
    priority INTEGER,
    deadline VARCHAR(255),
    status INTEGER,
    createdby INTEGER
);
```

## Environment Variables (Required for authenticated database services)

Set these variables before starting MS1.1, MS2.1, or MS2.2:

```bash
# Database
DB_PASSWORD=<your-postgres-password>

# JWT signing key: use a private random value of at least 32 bytes
JWT_SECRET_KEY=<your-private-random-secret>

# Eureka
EUREKA_SERVER_URL=http://localhost:8761/eureka/

# Services
MS1_PORT=8001
MS2_PORT=8002
GATEWAY_PORT=8000
EUREKA_PORT=8761
```

## Common Configuration Changes

### Change Database
Replace in all `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://your-host:5432/your-db
spring.datasource.username=your-username
spring.datasource.password=your-password
```

### Change Service Ports
Modify in respective `application.properties`:
```properties
server.port=XXXX
```

### Change Eureka Server Location
Update in client `application.properties`:
```properties
eureka.client.service-url.defaultZone=http://eureka-host:8761/eureka/
```

### Change JWT Secret
Set `JWT_SECRET_KEY` in the environment. Do not hardcode it in Java source or commit it to Git.

### Change Token Expiration
Update in `JWTService.java`:
```java
// Current: 24 hours (86400000 ms)
// Change to your desired value in milliseconds
new Date(new Date().getTime() + YOUR_EXPIRATION_TIME_MS)
```

## Docker Configuration (Future)

### Eureka Server Dockerfile
```dockerfile
FROM openjdk:17-slim
COPY target/ms-eureka-server.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Service Dockerfile (Generic)
```dockerfile
FROM openjdk:17-slim
COPY target/service.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Docker Compose (Future)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
  
  eureka:
    build: ./MS-EUREKA-SERVER
    ports:
      - "8761:8761"
  
  ms1:
    build: ./MS1.1
    ports:
      - "8001:8001"
    depends_on:
      - eureka
      - postgres
  
  # ... similar for other services
```

## Performance Tuning

### Connection Pool (for high traffic)
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

### JPA Query Caching
```properties
spring.jpa.properties.hibernate.query.in_clause_parameter_padding=true
spring.jpa.properties.hibernate.dialect.fetch_size=50
```

### Gateway Timeout Configuration
```properties
spring.cloud.gateway.httpclient.connect-timeout=5000
spring.cloud.gateway.httpclient.response-timeout=10s
```

## Logging Configuration

### Logging Levels
```properties
# Root logger
logging.level.root=INFO

# Spring Framework
logging.level.org.springframework=DEBUG

# Eureka
logging.level.com.netflix.eureka=WARN

# Application
logging.level.com.klu.springmvc=DEBUG

# Output to file
logging.file.name=logs/application.log
```

## Debugging Tips

### Enable Debug Mode
```properties
debug=true
```

### Print All Configurations
```properties
logging.level.org.springframework.boot.autoconfigure=DEBUG
```

### Eureka Debug
```properties
logging.level.com.netflix.eureka.EurekaClientConfigBean=DEBUG
logging.level.com.netflix.discovery.DiscoveryClient=DEBUG
```

### JWT Debug
Add in JWTService:
```java
System.out.println("Token generated: " + token);
System.out.println("Claims: " + claim);
```

---

This reference document covers all configuration aspects of the microservices architecture.
