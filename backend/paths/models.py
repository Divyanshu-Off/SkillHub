from django.db import models
from django.contrib.auth.models import User


class LearningPath(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="learning_paths",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, default="Full-Stack")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class PathStep(models.Model):
    path = models.ForeignKey(
        LearningPath,
        on_delete=models.CASCADE,
        related_name="steps",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resource_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.path.title} - Step {self.order}: {self.title}"
