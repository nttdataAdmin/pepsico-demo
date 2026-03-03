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
- Pandas for data processing

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

6. Run the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```
PORT=6900
REACT_APP_API_URL=http://localhost:8000
```

**Important:** The `PORT=6900` line is required to run the frontend on port 6900 instead of the default 3000.

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:6900`

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

