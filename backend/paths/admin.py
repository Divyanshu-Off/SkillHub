from django.contrib import admin
from .models import LearningPath, PathStep


class PathStepInline(admin.TabularInline):
    model = PathStep
    extra = 1


@admin.register(LearningPath)
class LearningPathAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "category", "created_at")
    list_filter = ("category", "created_at")
    search_fields = ("title", "description", "owner__username")
    inlines = [PathStepInline]


@admin.register(PathStep)
class PathStepAdmin(admin.ModelAdmin):
    list_display = ("title", "path", "order", "created_at")
    list_filter = ("path",)
    search_fields = ("title", "description")
