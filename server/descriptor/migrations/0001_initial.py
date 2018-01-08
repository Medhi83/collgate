# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-08 13:16
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Descriptor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('code', models.CharField(max_length=64, unique=True)),
                ('group_name', models.CharField(db_index=True, default=None, max_length=255, null=True)),
                ('description', models.TextField(blank=True, default='')),
                ('values', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=None, null=True)),
                ('format', django.contrib.postgres.fields.jsonb.JSONField(default={'type': 'undefined'})),
                ('can_delete', models.BooleanField(default=True)),
                ('can_modify', models.BooleanField(default=True)),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'verbose_name': 'descriptor type',
            },
        ),
        migrations.CreateModel(
            name='DescriptorValue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('code', models.CharField(max_length=64)),
                ('language', models.CharField(default='en', max_length=5)),
                ('parent', models.CharField(max_length=64, null=True)),
                ('ordinal', models.IntegerField(default=0, null=True)),
                ('value0', models.CharField(default='', max_length=127, null=True)),
                ('value1', models.CharField(default='', max_length=127, null=True)),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('descriptor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='values_set', to='descriptor.Descriptor')),
            ],
            options={
                'verbose_name': 'descriptor value',
            },
        ),
        migrations.CreateModel(
            name='Layout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('label', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('description', models.TextField(blank=True, default='')),
                ('structure', django.contrib.postgres.fields.jsonb.JSONField(default='undefined')),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('target', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='layouts', to='contenttypes.ContentType')),
            ],
            options={
                'verbose_name': 'layout',
            },
        ),
        migrations.AlterUniqueTogether(
            name='descriptorvalue',
            unique_together=set([('code', 'language')]),
        ),
        migrations.AlterIndexTogether(
            name='descriptorvalue',
            index_together=set([('descriptor', 'language', 'value0'), ('descriptor', 'language', 'ordinal'), ('code', 'language'), ('descriptor', 'language', 'value1'), ('descriptor', 'language')]),
        ),
    ]
