from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationTests(APITestCase):
    def test_registration_login_and_protected_access(self):
        register_url = reverse('register')
        credentials = {'username': 'tester', 'password': 'secret123'}

        resp = self.client.post(register_url, credentials, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        login_url = reverse('login')
        resp = self.client.post(login_url, credentials, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        access_token = resp.data['access']

        protected_url = reverse('protected')
        resp = self.client.get(protected_url, HTTP_AUTHORIZATION=f'Bearer {access_token}')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['detail'], 'success')
