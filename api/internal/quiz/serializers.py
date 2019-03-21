from rest_framework import serializers

from sesam import models


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ('id', 'category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')


class QuestionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.QuestionCategory
        fields = ('id', 'name')
