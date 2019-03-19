from django.core.management.base import BaseCommand

from ... import factories


class Command(BaseCommand):
    help = 'Creates questions and question categories if needed'

    def add_arguments(self, parser):
        parser.add_argument('question_count', nargs=1, type=int)

        parser.add_argument(
            '--create-categories',
            action='store_true',
            dest='create_categories',
            help='Create question categories',
        )

    def handle(self, *args, **options):
        if options['create_categories']:
            for x in range(10):
                factories.QuestionCategoryFactory()

        for x in range(options['question_count'][0]):
            factories.QuestionFactory()
