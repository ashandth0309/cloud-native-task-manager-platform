# Cloud-Native Task Manager Platform

A full-stack task management platform built to demonstrate practical DevOps and platform engineering skills.

## Tech Stack

- React frontend using Vite
- Node.js and Express backend
- MongoDB database
- Docker and Docker Compose
- GitHub Actions CI/CD
- Environment-based configuration
- Health checks and basic API logging
- Deployment-ready structure for Render, AWS, Azure, or GCP

## Architecture

```mermaid
flowchart LR
  User[User Browser] --> Frontend[React Frontend / Nginx Container]
  Frontend --> API[Node.js Express API / Docker Container]
  API --> Mongo[(MongoDB Database)]
  GitHub[GitHub Repository] --> Actions[GitHub Actions CI/CD]
  Actions --> Build[Build and Test Docker Images]
  Build --> Cloud[Cloud Deployment]
  API --> Logs[Platform Logs]
  API --> Health[/api/health]
```

## Project Structure

```text
cloud-native-task-manager-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/workflows/ci.yml
├── docs/architecture.mmd
├── docker-compose.yml
├── .env.example
└── README.md
```

## Run Locally with Docker

```bash
git clone <your-repository-url>
cd cloud-native-task-manager-platform
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Run Locally without Docker

### Backend

```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API and database health check |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Example Task JSON

```json
{
  "title": "Prepare DevOps portfolio project",
  "description": "Dockerize app and add CI pipeline",
  "priority": "high",
  "status": "todo"
}
```

## Environment Variables

### Backend

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/task-manager
CLIENT_URL=http://localhost:3000
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000
```

## CI/CD

The GitHub Actions workflow performs:

1. Backend dependency installation and test command
2. Frontend dependency installation, test command, and production build
3. Backend Docker image build
4. Frontend Docker image build

Workflow file: `.github/workflows/ci.yml`

## Deployment Options

### Render

Recommended simple deployment:

1. Create a MongoDB Atlas database.
2. Deploy the backend as a Web Service.
3. Add backend environment variables:
   - `MONGO_URI`
   - `CLIENT_URL`
   - `NODE_ENV=production`
4. Deploy the frontend as a Static Site or Docker Web Service.
5. Set `VITE_API_BASE_URL` to the deployed backend URL.

### AWS / Azure / GCP

Possible cloud deployment approaches:

- AWS: ECS/Fargate, Elastic Beanstalk, or App Runner
- Azure: App Service or Container Apps
- GCP: Cloud Run or App Engine

Use MongoDB Atlas for the managed database or run MongoDB through the cloud provider's container/database services.

## Monitoring and Logging

Current implementation includes:

- `morgan` HTTP request logs
- Structured startup, database, and error logs
- `/api/health` endpoint for uptime checks
- Cloud platform logs through Render/AWS/Azure/GCP

Possible future improvements:

- Prometheus metrics endpoint
- Grafana dashboard
- Centralized logging with OpenTelemetry
- Error tracking with Sentry

## LinkedIn Project Description

Containerized a full-stack task management application using Docker, automated build/test workflows with GitHub Actions, and deployed the application to a cloud environment. Added environment-based configuration, API health checks, and basic logging to improve reliability and maintainability.
