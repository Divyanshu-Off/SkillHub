from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from paths.models import LearningPath, PathStep
from paths.serializers import LearningPathSerializer, PathStepSerializer
from progress.models import UserPathProgress, UserStepProgress
from api.permissions import IsOwnerOrReadOnly


class LearningPathViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing, creating, and retrieving Learning Paths.
    """
    queryset = LearningPath.objects.all().select_related("owner").prefetch_related("steps")
    serializer_class = LearningPathSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        """Enroll the authenticated user into this learning path."""
        path = self.get_object()
        progress, created = UserPathProgress.objects.get_or_create(user=request.user, path=path)
        return Response({"enrolled": True, "path_id": path.id}, status=status.HTTP_200_OK)


class PathStepViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing individual steps within learning paths.
    """
    queryset = PathStep.objects.all().select_related("path")
    serializer_class = PathStepSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def toggle_completion(self, request, pk=None):
        """
        Toggle the completion state of a specific learning step for the logged in user.
        """
        step = self.get_object()
        progress, created = UserStepProgress.objects.get_or_create(user=request.user, step=step)
        progress.completed = not progress.completed
        progress.completed_at = timezone.now() if progress.completed else None
        progress.save()

        # Ensure user is also enrolled in path
        UserPathProgress.objects.get_or_create(user=request.user, path=step.path)

        return Response({
            "step_id": step.id,
            "completed": progress.completed,
            "completed_at": progress.completed_at,
        })
