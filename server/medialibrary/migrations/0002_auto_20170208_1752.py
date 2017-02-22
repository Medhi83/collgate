# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-08 16:52
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('medialibrary', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='media',
            name='owner_content_type',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='contenttypes.ContentType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='media',
            name='owner_object_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]