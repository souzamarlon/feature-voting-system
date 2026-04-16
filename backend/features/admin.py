from django.contrib import admin

from .models import Feature, UserProfile


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_by", "votes", "created_at")
    search_fields = ("title",)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    search_fields = ("user__username",)
