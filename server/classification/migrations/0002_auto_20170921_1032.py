# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-09-21 08:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('main', '0001_initial'),
        ('contenttypes', '0002_remove_content_type_name'),
        ('classification', '0001_initial'),
        ('descriptor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='classificationentrysynonym',
            name='synonym_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.EntitySynonymType'),
        ),
        migrations.AddField(
            model_name='classificationentry',
            name='content_type',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType'),
        ),
        migrations.AddField(
            model_name='classificationentry',
            name='descriptor_meta_model',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='descriptor.DescriptorMetaModel'),
        ),
        migrations.AddField(
            model_name='classificationentry',
            name='parent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='children', to='classification.ClassificationEntry'),
        ),
        migrations.AddField(
            model_name='classificationentry',
            name='rank',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='classification.ClassificationRank'),
        ),
        migrations.AddField(
            model_name='classification',
            name='content_type',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType'),
        ),
        migrations.AlterUniqueTogether(
            name='classificationrank',
            unique_together=set([('classification', 'level')]),
        ),
    ]
