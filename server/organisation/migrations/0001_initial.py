# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-09-20 09:37
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('descriptor', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Establishment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('descriptors', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('descriptor_meta_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='descriptor.DescriptorMetaModel')),
            ],
            options={
                'verbose_name': 'Establishment',
            },
        ),
        migrations.CreateModel(
            name='GRC',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Undefined GRC', max_length=255)),
                ('identifier', models.CharField(default='undefined', max_length=255)),
                ('description', models.TextField(blank=True, default='')),
            ],
            options={
                'verbose_name': 'Genetic Resource Center',
            },
        ),
        migrations.CreateModel(
            name='Organisation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('descriptors', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('type', models.CharField(default='ORG_TYPE:01', max_length=16)),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('descriptor_meta_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='descriptor.DescriptorMetaModel')),
            ],
            options={
                'verbose_name': 'Organisation',
            },
        ),
        migrations.AddField(
            model_name='grc',
            name='organisations',
            field=models.ManyToManyField(to='organisation.Organisation'),
        ),
        migrations.AddField(
            model_name='establishment',
            name='organisation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='establishments', to='organisation.Organisation'),
        ),
    ]
