
from django.urls import path

from .views import (
    ChatAPIView,
    HybridSearchAPIView,
    MaterialSummaryAPIView,
)

app_name = "ai_assistant"

urlpatterns = [
    path(
        "search/",
        HybridSearchAPIView.as_view(),
        name="hybrid-search",
    ),
    path(
        "chat/",
        ChatAPIView.as_view(),
        name="chat",
    ),
    path(
        "materials/<int:material_id>/summarize/",
        MaterialSummaryAPIView.as_view(),
        name="material-summary",
    ),
]
