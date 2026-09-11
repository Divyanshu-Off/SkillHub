from django.db import models
from django.contrib.auth.models import User
from paths.models import LearningPath, PathStep


class UserPathProgress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="path_progress",
    )
    path = models.ForeignKey(
        LearningPath,
        on_delete=models.CASCADE,
        related_name="user_progress",
    )
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "path")

    def __str__(self) -> str:
        return f"{self.user.username} - {self.path.title}"


class UserStepProgress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="step_progress",
    )
    step = models.ForeignKey(
        PathStep,
        on_delete=models.CASCADE,
        related_name="user_progress",
    )
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "step")

    def __str__(self) -> str:
        status = "Done" if self.completed else "Pending"
        return f"{self.user.username} - {self.step.title} [{status}]"
