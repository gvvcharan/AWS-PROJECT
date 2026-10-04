#!/bin/bash

# This script helps manage all microservices
# Usage: ./run-services.sh [command]
# Commands: eureka, ms1, ms2, ms22, gateway, all, build

case "$1" in
    "")
        echo "Usage: ./run-services.sh [command]"
        echo "Commands:"
        echo "  eureka   - Start Eureka Server"
        echo "  ms1      - Start MS1.1 Authentication Service"
        echo "  ms2      - Start MS2.1 Task Service"
        echo "  ms22     - Start MS2.2 Task Service"
        echo "  gateway  - Start API Gateway"
        echo "  all      - Start all services (requires multiple terminals)"
        echo "  build    - Build all services"
        ;;
    "build")
        echo "Building all services..."
        cd MS-EUREKA-SERVER && mvn clean install && cd ..
        cd MS1.1 && mvn clean install && cd ..
        cd MS2.1 && mvn clean install && cd ..
        cd MS2.2 && mvn clean install && cd ..
        cd MS-API-GATEWAY && mvn clean install && cd ..
        echo "Build complete!"
        ;;
    "eureka")
        cd MS-EUREKA-SERVER && mvn spring-boot:run
        ;;
    "ms1")
        cd MS1.1 && mvn spring-boot:run
        ;;
    "ms2")
        cd MS2.1 && mvn spring-boot:run
        ;;
    "ms22")
        cd MS2.2 && mvn spring-boot:run
        ;;
    "gateway")
        cd MS-API-GATEWAY && mvn spring-boot:run
        ;;
    "all")
        echo "Starting all services..."
        echo "Please open 5 separate terminal windows and run:"
        echo ""
        echo "Terminal 1: ./run-services.sh eureka"
        echo "Terminal 2: ./run-services.sh ms1"
        echo "Terminal 3: ./run-services.sh ms2"
        echo "Terminal 4: ./run-services.sh ms22"
        echo "Terminal 5: ./run-services.sh gateway"
        echo ""
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use: ./run-services.sh [eureka|ms1|ms2|ms22|gateway|all|build]"
        ;;
esac
