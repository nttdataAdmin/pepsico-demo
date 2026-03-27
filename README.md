# PEPSICO MANAGEMENT SYSTEM

A comprehensive asset management dashboard for PepsiCo with AI-powered recommendations and analysis capabilities.

## Features

- **Executive Summary**: Overview of all assets with status summary, map visualization, and detailed summary panel
- **Anomalies**: Condition monitoring with vibration and temperature charts
- **Root Cause Analysis**: Interactive flow visualization from assets to root causes
- **Recommendations**: AI-powered recommendations for asset maintenance
- **Maintenance Schedule**: Scheduled and in-progress maintenance tasks

## Technology Stack

### Backend
- FastAPI
- Python 3.9+
- Azure OpenAI integration
- CSV/JSON data loading (no pandas required)

### Frontend
- React 18
- React Router
- Recharts for data visualization
- Axios for API calls

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file from the example:
```bash
cp .env.example .env
```

5. Configure your Azure OpenAI credentials in `.env`:
```
AZURE_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_DEPLOYMENT=gpt-4.1
AZURE_API_KEY=your-api-key-here
AZURE_API_VERSION=2024-08-01-preview
```

6. Run the backend server (use `127.0.0.1` on Windows if `0.0.0.0` fails with a socket permission error):
```bash
# Windows PowerShell (from backend folder)
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 9898 --reload
```

The API will be available at `http://127.0.0.1:9898`. The dev frontend proxies `/api` there via `package.json` → `proxy`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Dev settings are in `.env.development` (port **3002**, API proxied to the backend — do not set `REACT_APP_API_URL` unless you need a direct URL). If webpack fails with `allowedHosts`, `DANGEROUSLY_DISABLE_HOST_CHECK=true` is already set there for local dev.

4. Start the development server:
```bash
npm start
```

Open **http://localhost:3002** (or whatever `PORT` you set).

## Project Structure

```
pepsico/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/      # API endpoints
│   │   │   └── models.py    # Pydantic models
│   │   ├── services/        # Business logic
│   │   ├── config.py        # Configuration
│   │   └── main.py          # FastAPI app
│   ├── data/                # Mock data files
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/assets` - Get all assets with optional filters
- `GET /api/assets/summary` - Get asset status summary
- `GET /api/anomalies` - Get anomaly monitoring data
- `GET /api/root-cause` - Get root cause analysis data
- `GET /api/recommendations` - Get recommendations
- `GET /api/maintenance` - Get maintenance schedule
- `POST /api/ai/recommendations` - Get AI-generated recommendations
- `POST /api/ai/analysis` - Get AI analysis for specific asset

## Data Files

Mock data is stored in:
- `backend/data/assets.json` - Asset master data
- `backend/data/anomalies.csv` - Vibration/temperature monitoring data
- `backend/data/root_causes.json` - Root cause probability data
- `backend/data/recommendations.csv` - Recommendations data
- `backend/data/maintenance.csv` - Maintenance schedule data

## AI Integration

The dashboard integrates with Azure OpenAI to provide:
- Dynamic recommendations based on asset status and criticality
- Contextual analysis for specific assets
- Root cause insights

Configure your Azure OpenAI credentials in the backend `.env` file to enable AI features.

## Development

- Backend runs on port 8000 by default
- Frontend runs on port 6900 by default
- CORS is configured to allow frontend-backend communication
- Hot reload is enabled for both backend and frontend during development

## License

This project is for demonstration purposes.

