# Generated by Django 4.2.13 on 2024-06-12 08:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import housework.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('housework', '0002_house_admin_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='HouseInvitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Unique invitation token')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Invitation creation date')),
                ('expires_at', models.DateTimeField(default=housework.models.default_expires_at, verbose_name='Invitation expiration date')),
                ('house', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='housework.house', verbose_name='Related house')),
                ('invited_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Inviting user')),
            ],
        ),
    ]
