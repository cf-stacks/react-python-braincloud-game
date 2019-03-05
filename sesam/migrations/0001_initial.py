# Generated by Django 2.1.5 on 2019-03-05 20:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import sesam.managers
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0009_alter_user_last_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(db_index=True, max_length=254, null=True, unique=True, verbose_name='Email')),
                ('name', models.CharField(max_length=30, verbose_name='Name')),
                ('is_staff', models.BooleanField(default=False, verbose_name='Staff status')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Date joined')),
                ('device_id', models.UUIDField(db_index=True, null=True, unique=True, verbose_name='Device ID')),
                ('money', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Money')),
                ('points', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Points')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
            },
            managers=[
                ('objects', sesam.managers.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('name', models.CharField(max_length=100, verbose_name='Name')),
                ('game_type', models.CharField(choices=[('quiz', 'Quiz'), ('durak', 'Durak'), ('arkanoid', 'Arkanoid')], default='quiz', max_length=20, unique=True, verbose_name='Game type')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GameSetting',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('min_players', models.PositiveSmallIntegerField(default=2)),
                ('max_players', models.PositiveSmallIntegerField(default=4)),
                ('wait_time', models.PositiveSmallIntegerField(default=30)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('description', models.TextField(verbose_name='Description')),
                ('status', models.PositiveSmallIntegerField(choices=[(0, 'New'), (1, 'Accepted'), (2, 'Rejected')], default=0, verbose_name='Status')),
                ('answer_correct', models.CharField(max_length=100, verbose_name='Correct answer')),
                ('answer_incorrect_1', models.CharField(max_length=100, verbose_name='Incorrect answer 1')),
                ('answer_incorrect_2', models.CharField(max_length=100, verbose_name='Incorrect answer 2')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='authored_questions', to=settings.AUTH_USER_MODEL, verbose_name='Author')),
            ],
            options={
                'verbose_name': 'Question',
                'verbose_name_plural': 'Questions',
            },
        ),
        migrations.CreateModel(
            name='QuestionCategory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'Question category',
                'verbose_name_plural': 'Question categories',
            },
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('external_id', models.UUIDField()),
                ('bet', models.DecimalField(decimal_places=2, max_digits=10)),
                ('started_at', models.DateTimeField(null=True)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to='sesam.Game')),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserMoneyLogModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('direction', models.SmallIntegerField(choices=[(0, 'In'), (1, 'Out')], default=0)),
                ('comment', models.CharField(max_length=150)),
                ('points', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='question',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sesam.QuestionCategory', verbose_name='Question category'),
        ),
        migrations.AddField(
            model_name='question',
            name='editor',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='edited_questions', to=settings.AUTH_USER_MODEL, verbose_name='Editor'),
        ),
        migrations.AddField(
            model_name='game',
            name='setting',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='sesam.GameSetting', verbose_name='Setting'),
        ),
    ]
