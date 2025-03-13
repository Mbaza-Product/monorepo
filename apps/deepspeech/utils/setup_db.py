from utils.db import Database

CREATE_TABLES_QUERY = """
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    time TIMESTAMP NOT NULL,
    feedback_token UUID NOT NULL,
    duration FLOAT NOT NULL,
    total_words INTEGER,
    total_char INTEGER,
    service character varying(255),
    text TEXT,
    audio_size INTEGER,
    metadata JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS inference_objects (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

async def setup_database():
    """Creates necessary tables in PostgreSQL if they do not exist."""
    await Database.init()
    conn = await Database.get_connection()
    await conn.execute(CREATE_TABLES_QUERY)
    await Database.release_connection(conn)
    print("✅ Database setup complete. Tables are ready.")