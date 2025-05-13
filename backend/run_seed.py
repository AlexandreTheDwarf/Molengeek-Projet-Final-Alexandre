import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from events.seed import seed

if __name__ == "__main__":
    seed()
