# Generated by Django 2.1.5 on 2019-02-28 14:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sesam', '0002_auto_20190228_1440'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='setting',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='sesam.GameSetting'),
        ),
    ]
