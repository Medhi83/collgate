# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-23 12:35
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20170216_1815'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='action',
            unique_together=set([]),
        ),
        migrations.AlterIndexTogether(
            name='action',
            index_together=set([]),
        ),
        migrations.RemoveField(
            model_name='action',
            name='models',
        ),
        migrations.DeleteModel(
            name='Action',
        ),
    ]
