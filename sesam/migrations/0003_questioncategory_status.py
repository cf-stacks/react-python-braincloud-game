# Generated by Django 2.1.5 on 2019-04-01 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sesam', '0002_add_groups'),
    ]

    operations = [
        migrations.AddField(
            model_name='questioncategory',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(0, 'active'), (1, 'stopped')], default=0, verbose_name='status'),
        ),
    ]
