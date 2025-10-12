from django.apps import AppConfig

class InnerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inner'

    def ready(self):
        import inner.signals

        import threading
        from inner.tasks import clear_expired_product_fields
        from store.scheduler import schedule_periodic_task

        def schedule():
            schedule_periodic_task(
                func=clear_expired_product_fields,
                interval_seconds=60,
                job_id='clear_expired_fields_inner'
            )

        threading.Timer(1.0, schedule).start()
