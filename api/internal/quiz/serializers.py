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
