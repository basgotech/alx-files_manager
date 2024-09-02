import redis
from functools import partial

class RedisClient:
    """
    Class for performing operations with Redis service
    """
    def __init__(self):
        self.client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
        
        # Register event handlers for Redis client
        self.client.connection_pool.connection_kwargs['error_handler'] = self.error_handler
        self.client.connection_pool.connection_kwargs['connect_handler'] = self.connect_handler

    def error_handler(self, error):
        print(f"Redis client not connected to the server: {error}")

    def connect_handler(self):
        # print('Redis client connected to the server')
        pass

    def is_alive(self):
        """
        Checks if connection to Redis is alive
        :return: True if connection is alive, False otherwise
        """
        try:
            self.client.ping()
            return True
        except redis.ConnectionError:
            return False

    async def get(self, key):
        """
        Gets value corresponding to key in Redis
        :param key: key to search for in Redis
        :return: value of key or None if not found
        """
        try:
            value = await self.client.get(key)
            return value
        except Exception as e:
            print(f"Error fetching key '{key}': {e}")
            return None

    async def set(self, key, value, duration):
        """
        Creates a new key in Redis with a specific TTL
        :param key: key to be saved in Redis
        :param value: value to be assigned to the key
        :param duration: TTL of the key in seconds
        """
        try:
            await self.client.setex(key, duration, value)
        except Exception as e:
            print(f"Error setting key '{key}' with value '{value}': {e}")

    async def delete(self, key):
        """
        Deletes key in Redis service
        :param key: key to be deleted
        """
        try:
            await self.client.delete(key)
        except Exception as e:
            print(f"Error deleting key '{key}': {e}")

redis_client = RedisClient()
