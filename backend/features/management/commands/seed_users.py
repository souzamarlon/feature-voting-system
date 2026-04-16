from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from rest_framework.authtoken.models import Token

from features.models import UserProfile


class Command(BaseCommand):
    help = "Create demo admin and regular users with tokens."

    def handle(self, *args, **options):
        User = get_user_model()
        demo_users = [
            {
                "username": "admin",
                "password": "admin123",
                "role": UserProfile.ROLE_ADMIN,
            },
            {
                "username": "user",
                "password": "user123",
                "role": UserProfile.ROLE_USER,
            },
        ]

        for demo_user in demo_users:
            user, created = User.objects.get_or_create(username=demo_user["username"])
            user.set_password(demo_user["password"])
            user.save()

            profile = UserProfile.get_for_user(user)
            profile.role = demo_user["role"]
            profile.save()

            token, _ = Token.objects.get_or_create(user=user)
            status_message = "Created" if created else "Updated"
            self.stdout.write(
                f"{status_message} {user.username} ({profile.role}) token: {token.key}"
            )
