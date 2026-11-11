from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
url = os.getenv("db_url")
if url is None:
    raise RuntimeError("db_url is not set in environment/.env")
engine = create_engine(url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
