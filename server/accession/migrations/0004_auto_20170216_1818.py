# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-16 17:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accession', '0003_auto_20170111_1832'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='accession',
            options={'permissions': (('get_accession', 'Can get an accession'), ('list_accession', 'Can list accessions'), ('search_accession', 'Can search for accessions')), 'verbose_name': 'accession'},
        ),
        migrations.AlterModelOptions(
            name='batch',
            options={'permissions': (('get_batch', 'Can get a batch'), ('list_batch', 'Can list batch'), ('search_batch', 'Can search for batches')), 'verbose_name': 'batch'},
        ),
        migrations.RemoveField(
            model_name='accession',
            name='synonyms',
        ),
        migrations.AddField(
            model_name='accessionsynonym',
            name='accession',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to='accession.Accession'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='accessionsynonym',
            name='synonym',
            field=models.CharField(db_index=True, default='undefined', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='batch',
            name='accession',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='batches', to='accession.Accession'),
        ),
    ]
