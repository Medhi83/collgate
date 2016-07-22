# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-22 15:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accession', '0003_auto_20160721_1415'),
    ]

    operations = [
        migrations.AddField(
            model_name='descriptorgroup',
            name='can_delete',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='descriptorgroup',
            name='can_modify',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='descriptortype',
            name='can_delete',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='descriptortype',
            name='can_modify',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='descriptortype',
            name='format',
            field=models.TextField(default='{"type": "string"}'),
        ),
        migrations.AddField(
            model_name='descriptortype',
            name='mandatory_for',
            field=models.CommaSeparatedIntegerField(blank=True, default='', max_length=255),
        ),
    ]
