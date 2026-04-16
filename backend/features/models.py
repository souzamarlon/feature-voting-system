from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    ROLE_ADMIN = "admin"
    ROLE_USER = "user"
    ROLE_CHOICES = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_USER, "User"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_USER)

    @classmethod
    def get_for_user(cls, user):
        profile, _ = cls.objects.get_or_create(user=user)
        return profile

    def __str__(self) -> str:
        return f"{self.user.username} ({self.role})"


class Feature(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="features",
    )

    class Meta:
        ordering = ["-votes", "-created_at"]

    def __str__(self) -> str:
        return self.title
