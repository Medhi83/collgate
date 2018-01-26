# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-01-26 11:54
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accession', '0010_batchaction_data'),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_status', models.IntegerField(choices=[(0, 'Pending'), (1, 'Valid'), (2, 'Archived'), (3, 'Removed')], default=1)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default={'status': 'created'})),
                ('accession', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='accession.Accession')),
                ('content_type', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.PROTECT, to='contenttypes.ContentType')),
                ('input_batches', models.ManyToManyField(related_name='_action_input_batches_+', to='accession.Batch')),
                ('output_batches', models.ManyToManyField(related_name='_action_output_batches_+', to='accession.Batch')),
            ],
            options={
                'verbose_name': 'action',
                'default_permissions': [],
            },
        ),
        migrations.RenameModel(
            old_name='BatchActionType',
            new_name='ActionType',
        ),
        migrations.AlterIndexTogether(
            name='batchaction',
            index_together=set([]),
        ),
        migrations.RemoveField(
            model_name='batchaction',
            name='accession',
        ),
        migrations.RemoveField(
            model_name='batchaction',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='batchaction',
            name='input_batches',
        ),
        migrations.RemoveField(
            model_name='batchaction',
            name='output_batches',
        ),
        migrations.RemoveField(
            model_name='batchaction',
            name='type',
        ),
        migrations.RemoveField(
            model_name='batchaction',
            name='user',
        ),
        migrations.DeleteModel(
            name='BatchAction',
        ),
        migrations.AddField(
            model_name='action',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='accession.ActionType'),
        ),
        migrations.AddField(
            model_name='action',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterIndexTogether(
            name='action',
            index_together=set([('accession', 'type')]),
        ),
    ]
