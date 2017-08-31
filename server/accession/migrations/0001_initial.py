# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-08-31 15:55
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('descriptor', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Accession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('descriptors', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('name', models.CharField(db_index=True, max_length=255)),
                ('code', models.CharField(db_index=True, max_length=255, unique=True)),
            ],
            options={
                'permissions': (('get_accession', 'Can get an accession'), ('list_accession', 'Can list accessions'), ('search_accession', 'Can search for accessions')),
                'verbose_name': 'accession',
            },
        ),
        migrations.CreateModel(
            name='AccessionClassificationEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('primary', models.BooleanField(db_index=True, default=False)),
                ('accession', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accession.Accession')),
            ],
        ),
        migrations.CreateModel(
            name='AccessionSynonym',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(db_index=True, max_length=128)),
                ('language', models.CharField(default='en', max_length=5)),
                ('type', models.CharField(default='ACC_SYN:03', max_length=64)),
                ('accession', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='synonyms', to='accession.Accession')),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'verbose_name': 'accession synonym',
            },
        ),
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('accessions', models.ManyToManyField(related_name='assets', to='accession.Accession')),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'verbose_name': 'panel',
            },
        ),
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('descriptors', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('accession', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='batches', to='accession.Accession')),
                ('batches', models.ManyToManyField(related_name='children', to='accession.Batch')),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('descriptor_meta_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='descriptor.DescriptorMetaModel')),
            ],
            options={
                'permissions': (('get_batch', 'Can get a batch'), ('list_batch', 'Can list batch'), ('search_batch', 'Can search for batches')),
                'verbose_name': 'batch',
            },
        ),
        migrations.CreateModel(
            name='BatchAction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('type', models.IntegerField(choices=[(0, 'Introduction'), (1, 'Multiplication'), (2, 'Regeneration'), (3, 'Test'), (4, 'Clean-up'), (5, 'Sample'), (6, 'Dispatch'), (7, 'Elimination')], db_index=True, default=0)),
                ('accession', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accession.Accession')),
                ('input_batches', models.ManyToManyField(related_name='_batchaction_input_batches_+', to='accession.Batch')),
                ('output_batches', models.ManyToManyField(related_name='_batchaction_output_batches_+', to='accession.Batch')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'default_permissions': [],
            },
        ),
        migrations.CreateModel(
            name='Sample',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('descriptors', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='samples', to='accession.Batch')),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
                ('descriptor_meta_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='descriptor.DescriptorMetaModel')),
            ],
            options={
                'verbose_name': 'sample',
            },
        ),
    ]
