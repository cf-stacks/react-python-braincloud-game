from rest_framework import serializers

from sesam import models


class QuestionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.QuestionCategory
        fields = ('id', 'name')


class QuestionSerializer(serializers.ModelSerializer):
    category = QuestionCategorySerializer()

    class Meta:
        model = models.Question
        fields = ('id', 'category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')


class PendingQuestionSerializer(serializers.ModelSerializer):
    category = QuestionCategorySerializer()

    class Meta:
        model = models.Question
        fields = ('id', 'category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2', 'author')


class CreateQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Question
        fields = ('id', 'category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')

    def to_representation(self, instance):
        return QuestionSerializer().to_representation(instance=instance)


class StatisticsSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class AssignedQuestionSerializer(serializers.Serializer):
    user = serializers.UUIDField()
    categories = serializers.ListField(child=serializers.UUIDField())
    date = serializers.DateField()
