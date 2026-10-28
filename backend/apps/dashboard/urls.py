from django.urls import path

from .views import DashboardSummaryView, RecentActivityListView, DashboardAnalyticsView

urlpatterns = [
    path(
        "summary/",
        DashboardSummaryView.as_view(),
        name="dashboard-summary",
    ),
    path(
        "activities/",
        RecentActivityListView.as_view(),
        name="dashboard-activities",
    ),
    path(
        "analytics/",
        DashboardAnalyticsView.as_view(),
        name="dashboard-analytics",
    ),
]
