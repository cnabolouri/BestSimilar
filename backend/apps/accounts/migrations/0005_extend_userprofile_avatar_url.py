from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0004_split_favorite_privacy"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="avatar_url",
            field=models.URLField(blank=True, max_length=1000),
        ),
    ]
