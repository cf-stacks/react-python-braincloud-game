import csv
import logging

from django.core.management.base import BaseCommand

from ... import models

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Upload questions from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str)

    def handle(self, *args, **options):
        filename = options['filename']
        category = models.QuestionCategory.objects.get_or_create(
            name='Несортированные'
        )[0]
        author = models.User.objects.get(email='author_1@example.com')
        try:
            with open(filename, 'r') as csv_file:
                reader = csv.DictReader(csv_file, delimiter=';')
                for row in reader:
                    models.Question.objects.create(
                        category=category,
                        author=author,
                        status=models.Question.STATUS_DRAFT,
                        description=row['description'],
                        answer_correct=row['answer_correct'],
                        answer_incorrect_1=row['answer_incorrect_1'],
                        answer_incorrect_2=row['answer_incorrect_2']
                    )
        except FileNotFoundError:
            logger.error(f'Cannot read file {filename} to import')
