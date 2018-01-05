# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-05 09:21
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Audit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.IntegerField()),
                ('type', models.IntegerField(choices=[(0, 'Create'), (1, 'Update'), (2, 'Delete'), (3, 'Remove'), (4, 'Action'), (5, 'M2M change')], default=0)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('fields', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'default_permissions': [],
            },
        ),
        migrations.AlterIndexTogether(
            name='audit',
            index_together=set([('timestamp', 'id', 'user'), ('timestamp', 'id', 'user', 'content_type', 'object_id'), ('timestamp', 'id', 'content_type', 'object_id')]),
        ),
    ]
