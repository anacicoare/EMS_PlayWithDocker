#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os, sys

# this file lives in E:\idp\EMS\tasks_module\...
HERE = os.path.dirname(os.path.abspath(__file__))
EMS_ROOT = os.path.dirname(HERE)            # ← goes up from tasks_module/ to EMS/
if EMS_ROOT not in sys.path:
    sys.path.insert(0, EMS_ROOT)

def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tasks_module.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
