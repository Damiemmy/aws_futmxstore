from .base import * # noqa: F403

load_dotenv(BASE_DIR / ".env.development")

DEBUG = True
SECRET_KEY = os.environ.get('SECRET_KEY')
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",   
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

