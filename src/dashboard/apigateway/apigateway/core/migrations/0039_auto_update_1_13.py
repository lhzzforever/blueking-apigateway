# Generated by Django 3.2.18 on 2024-02-22 04:08

from django.core.management import call_command
from django.db import migrations


def run_migrate_command(apps, schema_editor):
    call_command("migrate_access_strategy")
    call_command("migrate_access_strategy_user_verified")
    call_command("migrate_backend")
    call_command("delete_celery_task", task_name="apigateway.controller.tasks.syncing.release_updated_check")


class Migration(migrations.Migration):
    dependencies = [
        ('plugin', '0012_pluginbinding_source'),
        ('core', '0038_auto_20231023_1526'),
        ('django_celery_beat', '0001_initial'),
    ]

    operations = [migrations.RunPython(run_migrate_command)]
