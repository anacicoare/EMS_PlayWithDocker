"""
WSGI config for tasks_module project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""


from django.core.wsgi import get_wsgi_application
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
EMS_ROOT = os.path.dirname(HERE)
sys.path.insert(0, EMS_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tasks_module.settings")

application = get_wsgi_application()
