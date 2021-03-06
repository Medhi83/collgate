# Generated by Django 2.0.2 on 2018-02-08 08:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('main', '0001_initial'),
        ('classification', '0001_initial'),
        ('descriptor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='classificationentrysynonym',
            name='synonym_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main.EntitySynonymType'),
        ),
        migrations.AddField(
            model_name='classificationentry',
            name='content_type',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.PROTECT, to='contenttypes.ContentType'),
        ),
        migrations.AddField(
            model_name='classificationentry',
            name='layout',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='descriptor.Layout'),
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
            model_name='classificationentry',
            name='related',
            field=models.ManyToManyField(related_name='relate_to_classificationsentries', to='classification.ClassificationEntry'),
        ),
        migrations.AddField(
            model_name='classification',
            name='content_type',
            field=models.ForeignKey(editable=False, on_delete=django.db.models.deletion.PROTECT, to='contenttypes.ContentType'),
        ),
        migrations.AlterUniqueTogether(
            name='classificationrank',
            unique_together={('classification', 'level')},
        ),
    ]
