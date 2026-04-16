from django.urls import path

from .auth_views import login_view, me_view
from .views import FeatureListCreateView, delete_feature, upvote_feature


urlpatterns = [
    path("features", FeatureListCreateView.as_view(), name="feature-list-create"),
    path("features/<int:pk>", delete_feature, name="feature-delete"),
    path("features/<int:pk>/upvote", upvote_feature, name="feature-upvote"),
    path("auth/login", login_view, name="auth-login"),
    path("auth/me", me_view, name="auth-me"),
]
