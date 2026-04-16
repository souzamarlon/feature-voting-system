from django.urls import path

from .views import FeatureListCreateView, upvote_feature


urlpatterns = [
    path("features", FeatureListCreateView.as_view(), name="feature-list-create"),
    path("features/<int:pk>/upvote", upvote_feature, name="feature-upvote"),
]
