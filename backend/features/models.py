from django.db import models


class Feature(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-votes", "-created_at"]

    def __str__(self) -> str:
        return self.title
