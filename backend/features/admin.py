from django.contrib import admin

from .models import Feature


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "votes", "created_at")
    search_fields = ("title",)
