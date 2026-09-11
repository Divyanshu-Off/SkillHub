from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthAPITests(APITestCase):
    def test_register_user_success(self):
        payload = {
            "username": "newdeveloper",
            "email": "dev@skillhub.com",
            "password": "strongpassword123",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newdeveloper").exists())

    def test_jwt_obtain_and_refresh_token(self):
        User.objects.create_user(username="authuser", password="password123")
        login_payload = {
            "username": "authuser",
            "password": "password123",
        }
        response = self.client.post("/api/auth/jwt/create/", login_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        refresh_token = response.data["refresh"]
        refresh_response = self.client.post("/api/auth/jwt/refresh/", {"refresh": refresh_token})
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)

    def test_get_current_user(self):
        user = User.objects.create_user(username="profileuser", email="user@skillhub.com", password="password123")
        # Unauthenticated fails
        res_unauth = self.client.get("/api/auth/me/")
        self.assertEqual(res_unauth.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated succeeds
        self.client.force_authenticate(user=user)
        res_auth = self.client.get("/api/auth/me/")
        self.assertEqual(res_auth.status_code, status.HTTP_200_OK)
        self.assertEqual(res_auth.data["username"], "profileuser")
        self.assertEqual(res_auth.data["email"], "user@skillhub.com")
