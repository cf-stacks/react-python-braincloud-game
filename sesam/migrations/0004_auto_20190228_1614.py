# Generated by Django 2.1.5 on 2019-02-28 16:14

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('sesam', '0003_auto_20190228_1442'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserMoneyLogModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('direction', models.SmallIntegerField(choices=[(0, 'In'), (1, 'Out')], default=0)),
                ('comment', models.CharField(max_length=150)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='room',
            name='bet',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='money',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
