import os
import asyncpg

class Database:
    _pool = None

    @classmethod
    async def init(cls):
        """Initialize the database connection pool."""
        print('Initialize the database connection pool: ', os.getenv("POSTGRES_DB"))
        if cls._pool is None:
            cls._pool = await asyncpg.create_pool(
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASS"),
                database=os.getenv("POSTGRES_DB"),
                host=os.getenv("POSTGRES_HOST"),
                port=os.getenv("POSTGRES_PORT"),
                min_size=1,
                max_size=10  # Adjust based on expected workload
            )

    @classmethod
    async def get_connection(cls):
        """Get a connection from the pool."""
        if cls._pool is None:
            await cls.init()
        return await cls._pool.acquire()

    @classmethod
    async def release_connection(cls, conn):
        """Release a connection back to the pool."""
        if cls._pool and conn:
            await cls._pool.release(conn)

    @classmethod
    async def close(cls):
        """Close the connection pool."""
        if cls._pool:
            await cls._pool.close()
            cls._pool = None

# Initialize the pool when the project starts
async def init_db():
    await Database.init()
