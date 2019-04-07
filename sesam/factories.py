import datetime

from django.utils import timezone
import factory.fuzzy
import factory.random

from . import models


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.User


class QuestionCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.QuestionCategory
        django_get_or_create = ('name',)

    name = factory.Faker('color_name', locale='ru')


class QuestionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Question

    category = factory.fuzzy.FuzzyChoice(choices=models.QuestionCategory.objects.all())
    description = factory.Faker('text', locale='ru')
    author = factory.fuzzy.FuzzyChoice(choices=models.User.objects.filter(groups__name__iexact=models.USER_GROUP_AUTHOR))
    editor = factory.fuzzy.FuzzyChoice(choices=models.User.objects.filter(groups__name__iexact=models.USER_GROUP_EDITOR))
    created_at = factory.fuzzy.FuzzyDateTime(start_dt=timezone.now() - datetime.timedelta(days=14))
    reviewed_at = factory.LazyAttribute(lambda obj: factory.fuzzy.FuzzyDateTime(start_dt=obj.created_at).fuzz())
    status = factory.fuzzy.FuzzyChoice([x[0] for x in models.Question.STATUSES])
    answer_correct = factory.Faker('job', locale='ru')
    answer_incorrect_1 = factory.Faker('job', locale='ru')
    answer_incorrect_2 = factory.Faker('job', locale='ru')
