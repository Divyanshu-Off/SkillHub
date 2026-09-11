from django.contrib import admin
from .models import UserPathProgress, UserStepProgress


@admin.register(UserPathProgress)
class UserPathProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "path", "started_at")
    search_fields = ("user__username", "path__title")


@admin.register(UserStepProgress)
class UserStepProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "step", "completed", "completed_at")
    list_filter = ("completed",)
    search_fields = ("user__username", "step__title")
