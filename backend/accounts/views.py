import json
import secrets
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()
TOKENS: dict[str, str] = {}


@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = json.loads(request.body or b"{}")
    username = data.get("username")
    password = data.get("password")
    email = data.get("email", "")
    if not username or not password:
        return JsonResponse({"error": "username and password required"}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "user exists"}, status=400)
    user = User.objects.create_user(username=username, password=password, email=email)
    token = secrets.token_hex(16)
    TOKENS[token] = user.username
    return JsonResponse({"token": token}, status=201)


@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = json.loads(request.body or b"{}")
    username = data.get("username")
    password = data.get("password")
    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=400)
    token = secrets.token_hex(16)
    TOKENS[token] = user.username
    return JsonResponse({"token": token})


@csrf_exempt
def refresh_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = json.loads(request.body or b"{}")
    old_token = data.get("token")
    username = TOKENS.pop(old_token, None)
    if username is None:
        return JsonResponse({"error": "Invalid token"}, status=400)
    new_token = secrets.token_hex(16)
    TOKENS[new_token] = username
    return JsonResponse({"token": new_token})


def protected(request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Token "):
        return JsonResponse({"detail": "Authentication credentials were not provided."}, status=401)
    token = auth.split()[1]
    if token not in TOKENS:
        return JsonResponse({"detail": "Invalid token."}, status=401)
    return JsonResponse({"status": "ok"})
