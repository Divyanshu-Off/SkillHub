from rest_framework import viewsets, permissions
from projects.models import Project
from projects.serializers import ProjectSerializer
from api.permissions import IsOwnerOrReadOnly


class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for listing, creating, retrieving, updating, and deleting projects.
    - Anyone can list and view project details.
    - Authenticated users can create projects (owner is automatically assigned).
    - Only the project owner can update or delete their project.
    """
    queryset = Project.objects.all().select_related("owner")
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
