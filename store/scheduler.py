from redis import Redis
from rq_scheduler import Scheduler
from datetime import timedelta
from django.utils import timezone

redis_conn = Redis()
scheduler = Scheduler(connection=redis_conn)

def schedule_periodic_task(func, interval_seconds=60, job_id=None, start_delay=10, result_ttl=300):

    job_id = job_id or func.__module__ + '.' + func.__name__

    for job in scheduler.get_jobs():
        if job.func_name == job_id:
            scheduler.cancel(job)

    scheduler.schedule(
        scheduled_time=timezone.now() + timedelta(seconds=start_delay),
        func=func,
        interval=interval_seconds,
        repeat=None,
        result_ttl=result_ttl
    )
