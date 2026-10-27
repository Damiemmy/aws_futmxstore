from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    HybridSearchRequestSerializer,
    RetrievedChunkSerializer,
)
from .services import search_material_chunks

#----------------------------ChatBot Imports START-------------------------
import logging

from .generator import AnswerGenerationError
from .services import answer_question,summarize_material



logger = logging.getLogger(__name__)

#----------------------------ChatBot Imports END-------------------------


class HybridSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_serializer = HybridSearchRequestSerializer(
            data=request.data
        )
        request_serializer.is_valid(raise_exception=True)

        query = request_serializer.validated_data["query"]
        top_k = request_serializer.validated_data["top_k"]

        results = search_material_chunks(
            query=query,
            top_k=top_k,
        )

        response_serializer = RetrievedChunkSerializer(
            results,
            many=True,
        )

        return Response(
            {
                "query": query,
                "count": len(results),
                "results": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )




class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = HybridSearchRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["query"]
        top_k = serializer.validated_data["top_k"]

        try:
            result = answer_question(
                question=question,
                top_k=top_k,
            )
        except AnswerGenerationError:
            logger.exception("FUTMxStore answer generation failed.")

            return Response(
                {
                    "error": (
                        "The assistant is temporarily unavailable. "
                        "Please try again shortly."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(result, status=status.HTTP_200_OK)



class MaterialSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, material_id: int):
        try:
            result = summarize_material(material_id=material_id)
        except AnswerGenerationError:
            logger.exception(
                "FUTMxStore material summarization failed."
            )
            return Response(
                {
                    "error": (
                        "Summarization is temporarily unavailable. "
                        "Please try again shortly."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if result["status"] == "unavailable":
            return Response(
                result,
                status=status.HTTP_404_NOT_FOUND,
            )

        if result["status"] == "not_indexed":
            return Response(
                result,
                status=status.HTTP_409_CONFLICT,
            )

        return Response(result, status=status.HTTP_200_OK)
