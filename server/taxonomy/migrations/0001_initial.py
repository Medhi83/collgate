# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-07 09:48
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import re
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Taxon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Hidden'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(db_index=True, max_length=255, unique=True, validators=[django.core.validators.RegexValidator(code='invalid_name', message='Name must contains only alphanumerics characters or _ or - and be at least 3 characters length', regex=re.compile('^[a-zA-Z0-9_-]{3,}$', 34))])),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('rank', models.IntegerField(choices=[(60, 'Family'), (61, 'Sub-family'), (70, 'Genus'), (71, 'Sub-genus'), (80, 'Specie'), (81, 'Sub-specie')])),
                ('parent_list', models.CharField(blank=True, default='', max_length=1024)),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='taxonomy.Taxon')),
            ],
            options={
                'verbose_name': 'taxon',
            },
        ),
        migrations.CreateModel(
            name='TaxonSynonym',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Hidden'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(db_index=True, max_length=255, unique=True, validators=[django.core.validators.RegexValidator(code='invalid_name', message='Name must contains only alphanumerics characters or _ or - and be at least 3 characters length', regex=re.compile('^[a-zA-Z0-9_-]{3,}$', 34))])),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('language', models.CharField(choices=[('en', 'English'), ('fr', 'French')], max_length=2)),
                ('type', models.IntegerField(choices=[(0, 'Primary'), (1, 'Synonym'), (2, 'Code')])),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('taxon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='synonyms', to='taxonomy.Taxon')),
            ],
            options={
                'verbose_name': 'taxon synonym',
            },
        ),
    ]
