#!/usr/bin/env python
"""
Database migration script
Run: python scripts/migrate_db.py
"""

import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from alembic import command
from alembic.config import Config

def run_migrations():
    """Run database migrations"""
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Migrations applied successfully!")

if __name__ == "__main__":
    run_migrations()