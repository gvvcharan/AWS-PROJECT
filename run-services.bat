@echo off
REM This batch file helps manage all microservices
REM Usage: run-services.bat [command]
REM Commands: eureka, ms1, ms2, ms22, gateway, all, stop

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Usage: run-services.bat [command]
    echo Commands:
    echo   eureka   - Start Eureka Server
    echo   ms1      - Start MS1.1 Authentication Service
    echo   ms2      - Start MS2.1 Task Service
    echo   ms22     - Start MS2.2 Task Service
    echo   gateway  - Start API Gateway
    echo   all      - Start all services (requires multiple terminals)
    echo   build    - Build all services
    goto end
)

if "%1"=="build" (
    echo Building all services...
    cd MS-EUREKA-SERVER && mvn clean install && cd ..
    cd MS1.1 && mvn clean install && cd ..
    cd MS2.1 && mvn clean install && cd ..
    cd MS2.2 && mvn clean install && cd ..
    cd MS-API-GATEWAY && mvn clean install && cd ..
    echo Build complete!
    goto end
)

if "%1"=="eureka" (
    cd MS-EUREKA-SERVER
    mvn spring-boot:run
    goto end
)

if "%1"=="ms1" (
    cd MS1.1
    mvn spring-boot:run
    goto end
)

if "%1"=="ms2" (
    cd MS2.1
    mvn spring-boot:run
    goto end
)

if "%1"=="ms22" (
    cd MS2.2
    mvn spring-boot:run
    goto end
)

if "%1"=="gateway" (
    cd MS-API-GATEWAY
    mvn spring-boot:run
    goto end
)

if "%1"=="all" (
    echo Starting all services...
    echo Please open 5 separate terminal windows and run:
    echo.
    echo Terminal 1: run-services.bat eureka
    echo Terminal 2: run-services.bat ms1
    echo Terminal 3: run-services.bat ms2
    echo Terminal 4: run-services.bat ms22
    echo Terminal 5: run-services.bat gateway
    echo.
    goto end
)

:end
endlocal
