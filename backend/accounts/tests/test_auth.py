import json
from django.test import TestCase
from django.urls import reverse


class AuthFlowTests(TestCase):
    def test_register_login_refresh_and_access_protected_endpoint(self) -> None:
        register_url = reverse("register")
        response = self.client.post(
            register_url,
            data=json.dumps({"username": "alice", "password": "secret123"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        token = response.json()["token"]

        login_url = reverse("login")
        response = self.client.post(
            login_url,
            data=json.dumps({"username": "alice", "password": "secret123"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        login_token = response.json()["token"]

        refresh_url = reverse("token_refresh")
        response = self.client.post(
            refresh_url,
            data=json.dumps({"token": login_token}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        new_token = response.json()["token"]
        self.assertNotEqual(login_token, new_token)

        protected_url = reverse("protected")
        response = self.client.get(protected_url, HTTP_AUTHORIZATION=f"Token {new_token}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})
