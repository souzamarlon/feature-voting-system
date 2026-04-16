from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Feature
from .serializers import FeatureSerializer


class FeatureListCreateView(generics.ListCreateAPIView):
    serializer_class = FeatureSerializer
    queryset = Feature.objects.order_by("-votes", "-created_at")


@api_view(["POST"])
def upvote_feature(request, pk: int) -> Response:
    feature = get_object_or_404(Feature, pk=pk)
    Feature.objects.filter(pk=feature.pk).update(votes=F("votes") + 1)
    feature.refresh_from_db()
    serializer = FeatureSerializer(feature)
    return Response(serializer.data, status=status.HTTP_200_OK)
