#!/usr/bin/env python
"""
Database initialization script
Run: python scripts/init_db.py
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base, User, Client, Meter, UserRole
from datetime import datetime
import uuid

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://edsa:edsa_password@localhost:5432/edsa_db')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def init_database():
    """Initialize database with tables and sample data"""
    print("Creating tables...")
    Base.metadata.create_all(engine)
    print("Tables created successfully!")
    
    session = Session()
    
    try:
        # Check if admin user exists
        admin = session.query(User).filter(User.username == "admin").first()
        if not admin:
            print("Creating admin user...")
            admin = User(
                id=uuid.uuid4(),
                username="admin",
                email="admin@edsa.gov.sl",
                full_name="System Administrator",
                role=UserRole.ADMIN,
                status="active",
                created_at=datetime.utcnow()
            )
            session.add(admin)
            session.commit()
            print("Admin user created!")
        
        print("Database initialization complete!")
        
    except Exception as e:
        session.rollback()
        print(f"Error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    init_database()