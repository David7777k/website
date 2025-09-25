<<<<<<< HEAD
# Quick start

This repository contains a React frontend and a FastAPI backend. To make local development easier on Windows (PowerShell), there is a helper script `start.ps1` that launches both backend and frontend in separate PowerShell windows.

Steps (Windows / PowerShell):

1. Open PowerShell in the repository root (where `start.ps1` lives)
2. Run the helper:

   ./start.ps1

What it does:
- Creates a Python virtual environment at `backend/.venv` and installs `backend/requirements.txt` if missing
- Starts the backend using `uvicorn server:app --reload --port 8000`
- Starts the frontend using `yarn start` if `yarn.lock` is present, otherwise `npm start`

Optional setup:
- Copy `backend/.env.example` to `backend/.env` and edit MongoDB URL / SECRET_KEY as needed
- Copy `frontend/.env.example` to `frontend/.env` to point the frontend at the backend API

If you want a different flow (e.g., Docker, single-terminal multiplexing, or macOS/Linux scripts), tell me which platform and I'll add it.

