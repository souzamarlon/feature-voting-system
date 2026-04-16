from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Feature, UserProfile
from .serializers import FeatureSerializer


class FeatureListCreateView(generics.ListCreateAPIView):
    serializer_class = FeatureSerializer
    queryset = Feature.objects.order_by("-votes", "-created_at")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


@api_view(["POST"])
def upvote_feature(request, pk: int) -> Response:
    feature = get_object_or_404(Feature, pk=pk)
    Feature.objects.filter(pk=feature.pk).update(votes=F("votes") + 1)
    feature.refresh_from_db()
    serializer = FeatureSerializer(feature)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_feature(request, pk: int) -> Response:
    feature = get_object_or_404(Feature, pk=pk)
    profile = UserProfile.get_for_user(request.user)

    is_admin = profile.role == UserProfile.ROLE_ADMIN
    is_owner = feature.created_by_id == request.user.id

    if not is_admin and not is_owner:
        return Response(
            {"detail": "You do not have permission to delete this feature."},
            status=status.HTTP_403_FORBIDDEN,
        )

    feature.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
