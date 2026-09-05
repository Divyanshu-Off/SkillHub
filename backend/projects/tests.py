from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from projects.models import Project


class ProjectAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123")
        self.other_user = User.objects.create_user(username="otheruser", password="password123")
        self.project = Project.objects.create(
            owner=self.user,
            title="SkillHub Showcase",
            description="A learning & portfolio platform",
            github_url="https://github.com/testuser/skillhub",
            live_url="https://skillhub.example.com",
        )

    def test_list_projects_unauthenticated(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "SkillHub Showcase")
        self.assertEqual(response.data["results"][0]["owner"], "testuser")

    def test_get_project_detail_unauthenticated(self):
        response = self.client.get(f"/api/projects/{self.project.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "SkillHub Showcase")

    def test_create_project_unauthenticated_fails(self):
        payload = {
            "title": "New Project",
            "description": "Some description",
        }
        response = self.client.post("/api/projects/", payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_project_authenticated(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "title": "NLP Sentiment Pipeline",
            "description": "Text classification with PyTorch",
            "github_url": "https://github.com/testuser/nlp-pipeline",
            "live_url": "https://nlp.example.com",
        }
        response = self.client.post("/api/projects/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "NLP Sentiment Pipeline")
        self.assertEqual(response.data["owner"], "testuser")
        self.assertEqual(Project.objects.count(), 2)

    def test_update_project_by_non_owner_forbidden(self):
        self.client.force_authenticate(user=self.other_user)
        payload = {"title": "Malicious Update"}
        response = self.client.patch(f"/api/projects/{self.project.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_by_owner(self):
        self.client.force_authenticate(user=self.user)
        payload = {"title": "SkillHub - Updated Title"}
        response = self.client.patch(f"/api/projects/{self.project.id}/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.title, "SkillHub - Updated Title")

    def test_delete_project_by_owner(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"/api/projects/{self.project.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)
