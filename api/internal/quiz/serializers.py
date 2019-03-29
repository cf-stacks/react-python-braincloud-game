from collections import defaultdict

from django.utils.translation import ugettext
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
        fields = (
            'id', 'category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2', 'author',
            'created_at', 'reviewed_at',
        )


class CreateQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Question
        fields = ('id', 'category', 'description', 'answer_correct', 'answer_incorrect_1', 'answer_incorrect_2')

    def validate(self, data):
        unique = set([])
        errors = defaultdict(list)
        for item in ('answer_correct', 'answer_incorrect_1', 'answer_incorrect_2'):
            if data[item] in unique:
                errors[item] = ugettext("Answer should be unique")
            unique.add(data[item])
        if errors:
            raise serializers.ValidationError(errors)

        return data

    def to_representation(self, instance):
        return QuestionSerializer().to_representation(instance=instance)


class StatisticsSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class AssignedQuestionSerializer(serializers.Serializer):
    user = serializers.UUIDField()
    categories = serializers.ListField(child=serializers.UUIDField())
    date = serializers.DateField()

    def __init__(self, *args, **kwargs):
        super(AssignedQuestionSerializer, self).__init__(*args, **kwargs)
        if not self.context['request'].user.groups.filter(name__iexact=models.USER_GROUP_EDITOR).exists():
            self.fields.pop('date')
