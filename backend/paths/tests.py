from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from paths.models import LearningPath, PathStep
from progress.models import UserStepProgress


class LearningPathAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="pathtester", password="password123")
        self.other_user = User.objects.create_user(username="pathother", password="password123")

        self.path = LearningPath.objects.create(
            owner=self.user,
            title="Django Full-Stack Mastery",
            description="From zero to production with DRF and React",
            category="Full-Stack",
        )
        self.step1 = PathStep.objects.create(
            path=self.path,
            title="Set up Django and DRF",
            description="Configure settings, Postgres, and apps",
            order=1,
            resource_url="https://docs.djangoproject.com",
        )
        self.step2 = PathStep.objects.create(
            path=self.path,
            title="Integrate React and Vite",
            description="Scaffold frontend and setup Tailwind",
            order=2,
            resource_url="https://vite.dev",
        )

    def test_list_paths(self):
        response = self.client.get("/api/paths/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["total_steps"], 2)

    def test_toggle_step_completion(self):
        self.client.force_authenticate(user=self.user)
        # Step is initially incomplete
        response = self.client.post(f"/api/steps/{self.step1.id}/toggle_completion/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["completed"])
        self.assertTrue(UserStepProgress.objects.filter(user=self.user, step=self.step1, completed=True).exists())

        # Toggle again sets to False
        response2 = self.client.post(f"/api/steps/{self.step1.id}/toggle_completion/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertFalse(response2.data["completed"])

    def test_create_learning_path_authenticated(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "title": "NLP Interview Prep",
            "description": "Transformers, tokenization, embeddings",
            "category": "Machine Learning",
        }
        response = self.client.post("/api/paths/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["owner"], "pathtester")
