# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-02-13 21:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_notificationslog'),
    ]

    operations = [
        migrations.AddField(
            model_name='learnerprogressnotification',
            name='quiz_num_correct',
            field=models.IntegerField(null=True),
        ),
    ]
