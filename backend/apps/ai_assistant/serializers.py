
from rest_framework import serializers


class HybridSearchRequestSerializer(serializers.Serializer):
    query = serializers.CharField(
        max_length=1000,
        trim_whitespace=True,
    )

    top_k = serializers.IntegerField(
        required=False,
        default=5,
        min_value=1,
        max_value=10,
    )


class RetrievedChunkSerializer(serializers.Serializer):
    chunk_id = serializers.IntegerField()
    material_id = serializers.IntegerField()
    material_title = serializers.CharField()
    course_code = serializers.CharField()
    page_number = serializers.IntegerField()
    chunk_index = serializers.IntegerField()
    text = serializers.CharField()
    material_url = serializers.CharField(
        allow_null=True,
        required=False,
    )
    rrf_score = serializers.FloatField()
    keyword_score = serializers.FloatField()
    semantic_score = serializers.FloatField()




class MaterialSummaryRequestSerializer(serializers.Serializer):
    material_id = serializers.IntegerField(min_value=1)
