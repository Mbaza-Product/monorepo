import uuid
from datetime import datetime
from time import time
import json
from utils.db import Database  # Import shared database connection

class Logger:
    def __init__(self, **kwargs) -> None:
        self.log = {
            "time": datetime.now(),
            "service": 'None',
            "feedback_token": uuid.uuid4(),
            "duration": time(),
            "total_words": 0,
            "total_char": 0,
            "text": "",
            "audio_size": 0,
            "metadata": {}  # Keep a dictionary for extra data
        }
        self.update(**kwargs)

    def getData(self):
        log = self.log
        log["time"] = log["time"].isoformat()
        log["feedback_token"] = str(log["feedback_token"])
        return log

    def update(self, **kwargs):
        self.log["duration"] = time() - self.log["duration"]
        for key, value in kwargs.items():
            if key in self.log:
                self.log[key] = value  # Update predefined columns
            else:
                print(key)
                self.log["metadata"][key] = value  # Update dynamic data (JSONB)

    async def commit_to_db(self):
        """Commits log entry to the database using shared connection."""
        try:
            await Database.init()  # Ensure connection pool is initialized
            conn = await Database.get_connection()

            query = """
            INSERT INTO logs (service, time, feedback_token, duration, total_words, total_char, text, audio_size, metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """

            await conn.execute(
                query,
                self.log["service"],
                self.log["time"],
                self.log["feedback_token"],
                self.log["duration"],
                self.log["total_words"],
                self.log["total_char"],
                self.log["text"],
                self.log["audio_size"],
                json.dumps(self.log["metadata"])  # Store the extra data in the JSONB column
            )

            await Database.release_connection(conn)
            print("✅ Log committed to database")

        except Exception as e:
            print(f"❌ Could not commit log to database: {e}")
