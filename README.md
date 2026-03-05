## Distributed Rate Limiter System

A production-style distributed rate limiter built using Node.js, Redis, and Docker. The system implements Token Bucket and Sliding Window algorithms to control API traffic across distributed services.

## Architecture

Client
   ↓
API Gateway (Express)
   ↓
Rate Limiter Service
   ↓
Redis
   ↓
Demo API

## Features

- Token Bucket Rate Limiting
- Sliding Window Rate Limiting
- Distributed State using Redis
- API Gateway Pattern
- Containerized Microservices (Docker)
- Load Testing using k6
- Metrics Endpoint

## Run the System

1- Start services:
  docker-compose up --build

2- Run load test:
  k6 run load-tests/k6-test.js

3- Access API Gateway:
  http://localhost:8080/api/profile

4- Metrics endpoint:
  http://localhost:3000/metrics



## Tech Stack

- Node.js
- Express.js
- Redis
- Docker
- k6




