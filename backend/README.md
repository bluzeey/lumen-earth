# Backend

This directory contains a minimal Django project skeleton.

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
3. Apply database migrations:

   ```bash
   python manage.py migrate
   ```
4. Run the development server:

   ```bash
   python manage.py runserver
   ```

## Authentication

The backend exposes the following authentication endpoints:

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| POST   | `/auth/register/` | Register a new user     |
| POST   | `/auth/login/`    | Obtain an auth token    |
| POST   | `/auth/logout/`   | Invalidate the session  |

### Example requests

Register a user:

```bash
curl -X POST http://localhost:8000/auth/register/ \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'
```

Log in:

```bash
curl -X POST http://localhost:8000/auth/login/ \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'
```

Log out:

```bash
curl -X POST http://localhost:8000/auth/logout/ \
  -H "Authorization: Token <token>"
```
