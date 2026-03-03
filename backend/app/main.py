from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import assets, anomalies, root_cause, recommendations, ai, maintenance

app = FastAPI(title="PEPSICO MANAGEMENT SYSTEM API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(assets.router)
app.include_router(anomalies.router)
app.include_router(root_cause.router)
app.include_router(recommendations.router)
app.include_router(ai.router)
app.include_router(maintenance.router)


@app.get("/")
async def root():
    return {"message": "PEPSICO MANAGEMENT SYSTEM API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

