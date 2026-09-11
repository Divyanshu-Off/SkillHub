from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import ProjectViewSet
from paths.views import LearningPathViewSet, PathStepViewSet
from users.views import RegisterView, CurrentUserView

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"paths", LearningPathViewSet, basename="learningpath")
router.register(r"steps", PathStepViewSet, basename="pathstep")

urlpatterns = [
    # JWT Authentication & User endpoints
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/jwt/create/", TokenObtainPairView.as_view(), name="jwt-create"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    # API endpoints from router
    path("", include(router.urls)),
]
