from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import sqlite3
import json
from contextlib import contextmanager

class Activity(BaseModel):
    id: int
    action: str
    message: str
    timestamp: str
    read: bool = False
    entity_type: str  # 'folder' or 'file'
    entity_id: str
    user_id: Optional[str] = None

class ActivityLogger:
    def __init__(self, db_path: str = "activities.db"):
        self.db_path = db_path
        self._init_db()

    @contextmanager
    def get_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self):
        with self.get_db() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS activities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    action TEXT NOT NULL,
                    message TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    read BOOLEAN NOT NULL DEFAULT 0,
                    entity_type TEXT NOT NULL,
                    entity_id TEXT NOT NULL,
                    user_id TEXT
                )
            """)
            conn.commit()

    def log_activity(self, action: str, message: str, entity_type: str, entity_id: str, user_id: Optional[str] = None) -> Activity:
        timestamp = datetime.utcnow().isoformat()
        
        with self.get_db() as conn:
            cursor = conn.execute("""
                INSERT INTO activities (action, message, timestamp, entity_type, entity_id, user_id)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (action, message, timestamp, entity_type, entity_id, user_id))
            
            activity_id = cursor.lastrowid
            conn.commit()

        return Activity(
            id=activity_id,
            action=action,
            message=message,
            timestamp=timestamp,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            read=False
        )

    def get_activities(self, limit: int = 50) -> List[Activity]:
        with self.get_db() as conn:
            cursor = conn.execute("""
                SELECT * FROM activities 
                ORDER BY timestamp DESC 
                LIMIT ?
            """, (limit,))
            
            activities = []
            for row in cursor:
                activities.append(Activity(
                    id=row['id'],
                    action=row['action'],
                    message=row['message'],
                    timestamp=row['timestamp'],
                    read=bool(row['read']),
                    entity_type=row['entity_type'],
                    entity_id=row['entity_id'],
                    user_id=row['user_id']
                ))
            
            return activities

    def mark_as_read(self, activity_id: int) -> bool:
        with self.get_db() as conn:
            conn.execute("""
                UPDATE activities 
                SET read = 1 
                WHERE id = ?
            """, (activity_id,))
            conn.commit()
            return True

    def mark_all_as_read(self) -> bool:
        with self.get_db() as conn:
            conn.execute("UPDATE activities SET read = 1")
            conn.commit()
            return True

    def delete_activity(self, activity_id: int) -> bool:
        with self.get_db() as conn:
            conn.execute("DELETE FROM activities WHERE id = ?", (activity_id,))
            conn.commit()
            return True

# Create singleton instance
activity_logger = ActivityLogger() 