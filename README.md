# PepsiCo Management System (demo)

A single application for asset health, production signals, and maintenance coordination. The UI walks an operator from a quality gate through analytics and planned work, with a context-aware assistant on each dashboard step.

<<<<<<< HEAD
## Capabilities:
=======
## What you get
>>>>>>> parent of 2d16a8c (Final changes pepsico 4'27)

- **Quality gate** — Upload a form image; the API classifies **Go** vs **No-Go** and routes the session (executive-only positive path vs full analytics with supervisor release).
- **Operator lens** — **Processing** (fryer, thermal, seasoning story) vs **packaging** (palletizer, case line, conveyors). The same navigation uses lens-specific scenarios so charts, queues, and narratives stay coherent.
- **Executive summary** — Fleet KPIs, site map, and (on No-Go after approval) deeper tabs. Go shows a simplified healthy-line snapshot.
- **Agentic-style panels** — Cross-feed hints and narrative strips (downtime, actions, corroboration) sit beside primary tables and charts so each step feels like fused operations data, not an isolated screen.
- **CMMS-shaped records** — Maintenance and recommendation rows share the same identifiers (**Eventid**, **Line**, **Technicianid**, **Workcenterroles**, **Issuetype**) so downtime narrative, work orders, and action queue read as one routing model.
- **In-app assistant** — On dashboard routes, the assistant receives the current page JSON, filters, QC state, and operator lens. Answers follow what is on screen; optional server snapshots supplement the packaging-aligned export when the lens is packaging.

## Dashboard flow

1. **Login** → **Upload** (role + form) → **Executive summary**  
2. **No-Go** — Supervisor **HITL** unlocks **Anomalies** → **Root cause** → **Recommendations** → **Planned downtime**  
3. **Go** — Short executive path; optional return to upload for another cycle  

Telemetry and lists respect header filters (state, plant, period) where applicable.

## Technology

| Layer | Stack |
|--------|--------|
| API | FastAPI, Python 3.9+, Uvicorn |
| UI | React 18, React Router, Recharts |
| AI | Azure OpenAI (assistant, recommendations, optional narratives) |
| Optional | Microsoft Graph / SMTP for maintenance notifications; Azure Document Intelligence for OCR on uploads |

Backend reads scenario assets from `backend/data` (JSON/CSV). The UI also uses embedded scenario tables for lens-specific views where the story diverges from the server file layout.

## Setup

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` with your **Azure** endpoint, deployment, API key, and API version. Start the API on **9898**; bind to `0.0.0.0` if other machines should call it:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 9898 --reload
```

Windows: `run_dev.bat` is provided for the same idea.

### Frontend

```bash
cd frontend
npm install
npm start
```

Default dev app: **9897** (`frontend/.env.development`). The dev server proxies `/api` to the backend on **127.0.0.1:9898** unless `REACT_APP_API_URL` overrides it.

Open the app at `http://localhost:9897` (or your host IP on the same ports if `HOST=0.0.0.0`). Allow firewall access to **9897** and **9898** when testing from another device.

## Project layout

```
pepsico-demo/
├── backend/
│   ├── app/           # FastAPI app, routes, services
│   ├── data/          # Scenario assets (assets, anomalies, RCA, maintenance, recommendations)
│   └── requirements.txt
├── frontend/
│   └── src/           # Pages, agentic panels, assistant context, scenario data helpers
└── README.md
```

## API (summary)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/assets`, `/api/assets/summary` | Fleet registry and counts |
| GET | `/api/anomalies` | Condition monitoring rows |
| GET | `/api/root-cause` | RCA structure |
| GET | `/api/recommendations` | Action queue source |
| GET | `/api/maintenance` | Schedule source |
| POST | `/api/forms/classify` | Go / No-Go from upload |
| POST | `/api/ai/assistant` | Dashboard assistant (grounded in page + optional server snapshot) |
| POST | `/api/ai/recommendations`, `/api/ai/analysis` | Targeted LLM helpers |

Interactive docs: `http://<host>:9898/docs` when the server is running.

## Configuration notes

- **Upload classification** — Filename hints (e.g. `go.png` / `nogo.png`) and optional OCR when Document Intelligence is enabled.  
- **Assistant** — Requires Azure credentials on the backend; the UI still renders if the model is unavailable.  
- **Maintenance email** — Graph or SMTP env vars on the API host; optional default recipient via `REACT_APP_MAINTENANCE_NOTIFY_TO` in the frontend env.  

## License

Demonstration use only.
