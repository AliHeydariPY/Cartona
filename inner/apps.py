from django.apps import AppConfig


class InnerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inner'

    def ready(self):
        import inner.signals