# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-13 16:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taxonomy', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxonsynonym',
            name='synonym',
            field=models.CharField(db_index=True, default='', max_length=255),
            preserve_default=False,
        ),
    ]