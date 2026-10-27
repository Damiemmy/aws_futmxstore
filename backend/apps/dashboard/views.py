from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from .serializers import ActivitySerializer
from .selectors import get_recent_activities
from .services import get_academic_dashboard_summary


from rest_framework.permissions import IsAdminUser
from . import selectors


class DashboardSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(get_academic_dashboard_summary())


class RecentActivityListView(ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        try:
            limit = int(self.request.query_params.get("limit", 20))
        except (TypeError, ValueError):
            limit = 20

        limit = max(1, min(limit, 100))

        return get_recent_activities(limit=limit)


class DashboardAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            days = int(request.query_params.get("days", 30))
        except (TypeError, ValueError):
            days = 30

        days = max(1, min(days, 90))

        return Response({
            "period_days": days,
            "downloads_per_day": selectors.get_downloads_per_day(
                days=days
            ),
            "popular_courses": selectors.get_popular_courses(
                days=days,
                limit=10,
            ),
            "engagement_per_day": selectors.get_engagement_per_day(
                days=days
            ),
        })
