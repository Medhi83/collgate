# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-13 12:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('accession', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='descriptormetamodel',
            name='target',
            field=models.ForeignKey(default=0, editable=False, on_delete=django.db.models.deletion.CASCADE, related_name='descriptors_meta_model', to='contenttypes.ContentType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='descriptorpanel',
            name='descriptor_model',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='panels', to='accession.DescriptorModel'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sample',
            name='descriptor_meta_model',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='samples', to='accession.DescriptorMetaModel'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='descriptormetamodel',
            name='descriptor_models',
            field=models.ManyToManyField(related_name='descriptor_meta_models', to='accession.DescriptorPanel'),
        ),
        migrations.AlterField(
            model_name='descriptormetamodel',
            name='label',
            field=models.TextField(default='{}'),
        ),
        migrations.AlterField(
            model_name='descriptormodeltype',
            name='descriptor_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='descriptor_model_types', to='accession.DescriptorModel'),
        ),
        migrations.AlterField(
            model_name='descriptormodeltype',
            name='label',
            field=models.TextField(default='{}'),
        ),
        migrations.AlterField(
            model_name='descriptorpanel',
            name='label',
            field=models.TextField(default='{}'),
        ),
    ]