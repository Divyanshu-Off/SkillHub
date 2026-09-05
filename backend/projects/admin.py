from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "created_at", "updated_at")
    list_filter = ("created_at", "owner")
    search_fields = ("title", "description", "owner__username")
