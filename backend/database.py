# database.py
from sqlalchemy import create_engine, Column, Integer, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()
engine = create_engine('sqlite:///data_storage.db')
Session = sessionmaker(bind=engine)

class SavedData(Base):
    __tablename__ = 'saved_data'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<SavedData(name='{self.name}', type='{self.type}')>"

Base.metadata.create_all(engine)