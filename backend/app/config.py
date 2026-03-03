try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    azure_endpoint: str = ""
    azure_deployment: str = "gpt-4.1"
    azure_api_key: str = ""
    azure_api_version: str = "2024-08-01-preview"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

