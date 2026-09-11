from rest_framework import serializers
from paths.models import LearningPath, PathStep
from progress.models import UserStepProgress


class PathStepSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = PathStep
        fields = [
            "id",
            "path",
            "title",
            "description",
            "resource_url",
            "order",
            "created_at",
            "is_completed",
        ]
        read_only_fields = ["id", "created_at", "is_completed"]

    def get_is_completed(self, obj) -> bool:
        user = self.context.get("request") and self.context["request"].user
        if not user or not user.is_authenticated:
            return False
        return UserStepProgress.objects.filter(user=user, step=obj, completed=True).exists()


class LearningPathSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    steps = PathStepSerializer(many=True, read_only=True)
    total_steps = serializers.SerializerMethodField()
    completed_steps = serializers.SerializerMethodField()

    class Meta:
        model = LearningPath
        fields = [
            "id",
            "owner",
            "title",
            "description",
            "category",
            "steps",
            "total_steps",
            "completed_steps",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "total_steps", "completed_steps", "created_at", "updated_at"]

    def get_total_steps(self, obj) -> int:
        return obj.steps.count()

    def get_completed_steps(self, obj) -> int:
        user = self.context.get("request") and self.context["request"].user
        if not user or not user.is_authenticated:
            return 0
        step_ids = obj.steps.values_list("id", flat=True)
        return UserStepProgress.objects.filter(
            user=user, step_id__in=step_ids, completed=True
        ).count()
