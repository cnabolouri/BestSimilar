from django.db import migrations, models


def copy_favorite_visibility(apps, schema_editor):
    UserPrivacySettings = apps.get_model("accounts", "UserPrivacySettings")

    for settings in UserPrivacySettings.objects.all():
        settings.show_favorite_titles = settings.show_favorites
        settings.show_favorite_people = settings.show_favorites
        settings.save(
            update_fields=[
                "show_favorite_titles",
                "show_favorite_people",
            ],
        )


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0003_remove_userprivacysettings_public_profile"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprivacysettings",
            name="show_favorite_people",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="userprivacysettings",
            name="show_favorite_titles",
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(copy_favorite_visibility, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="userprivacysettings",
            name="show_favorites",
        ),
    ]
